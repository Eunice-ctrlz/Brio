import { useEffect, useRef, useState } from 'react';
import { useCart } from '@/context/CartContext';
import { api } from '@/services/api';
import { ApiError } from '@/services/errors';
import { formatPrice } from '@/utils/format';
import { Button } from './Button';
import { CheckIcon, CloseIcon, TrashIcon } from './Icons';
import { QuantitySelector } from './QuantitySelector';

type CheckoutState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; orderNumber: string };

export function CartDrawer() {
  const { items, itemCount, subtotal, isOpen, closeCart, setQuantity, removeItem, clearCart } =
    useCart();
  const [checkout, setCheckout] = useState<CheckoutState>({ status: 'idle' });
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  // While open: Esc closes, page scroll is locked, focus moves into the drawer.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && closeCart();
    document.addEventListener('keydown', onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeBtnRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, closeCart]);

  // Forget a finished checkout message once the drawer closes.
  useEffect(() => {
    if (!isOpen && checkout.status !== 'loading') setCheckout({ status: 'idle' });
  }, [isOpen, checkout.status]);

  async function handleCheckout() {
    setCheckout({ status: 'loading' });
    try {
      // Only ids + quantities: the server is the source of truth for prices.
      const res = await api.checkout({
        items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
      });
      clearCart();
      setCheckout({ status: 'success', orderNumber: res.data.orderNumber });
    } catch (err) {
      setCheckout({
        status: 'error',
        message: err instanceof ApiError ? err.message : 'Checkout failed. Please try again.',
      });
    }
  }

  const isEmpty = items.length === 0;

  return (
    <>
      <div
        className={`overlay ${isOpen ? 'overlay--visible' : ''}`}
        onClick={closeCart}
        aria-hidden="true"
      />
      <aside
        className={`drawer ${isOpen ? 'drawer--open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        aria-hidden={!isOpen}
        // `inert` keeps the closed drawer's buttons out of the tab order.
        inert={!isOpen}
      >
        <header className="drawer__header">
          <h2>
            Your cart <span className="drawer__count">({itemCount})</span>
          </h2>
          <button
            ref={closeBtnRef}
            type="button"
            className="icon-btn"
            onClick={closeCart}
            aria-label="Close cart"
          >
            <CloseIcon />
          </button>
        </header>

        {checkout.status === 'success' ? (
          <div className="drawer__state">
            <span className="drawer__state-icon">
              <CheckIcon size={28} />
            </span>
            <h3>Thank you!</h3>
            <p>
              Order <strong>{checkout.orderNumber}</strong> has been placed.
            </p>
            <Button as="link" to="/account" onClick={closeCart}>
              View my orders
            </Button>
          </div>
        ) : isEmpty ? (
          <div className="drawer__state">
            <h3>Your cart is empty</h3>
            <p>Add something fresh and it will show up here.</p>
            <Button as="link" to="/products" onClick={closeCart}>
              Start shopping
            </Button>
          </div>
        ) : (
          <>
            <ul className="drawer__items">
              {items.map((item) => (
                <li key={item.productId} className="cart-line">
                  <img src={item.image} alt="" className="cart-line__img" />
                  <div className="cart-line__info">
                    <p className="cart-line__name">{item.name}</p>
                    <p className="cart-line__price">{formatPrice(item.price)}</p>
                    <QuantitySelector
                      label={item.name}
                      value={item.quantity}
                      max={item.maxQuantity}
                      onChange={(q) => setQuantity(item.productId, q)}
                    />
                  </div>
                  <div className="cart-line__end">
                    <button
                      type="button"
                      className="icon-btn"
                      onClick={() => removeItem(item.productId)}
                      aria-label={`Remove ${item.name} from cart`}
                    >
                      <TrashIcon size={18} />
                    </button>
                    <span className="cart-line__total">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>

            <footer className="drawer__footer">
              <div className="drawer__subtotal">
                <span>Subtotal</span>
                <strong>{formatPrice(subtotal)}</strong>
              </div>
              <p className="drawer__note">Shipping and taxes are calculated at checkout.</p>
              {checkout.status === 'error' && (
                <p className="form-error" role="alert">
                  {checkout.message}
                </p>
              )}
              <Button
                fullWidth
                size="lg"
                loading={checkout.status === 'loading'}
                onClick={handleCheckout}
              >
                Checkout
              </Button>
            </footer>
          </>
        )}
      </aside>
    </>
  );
}