import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
  type ReactNode,
} from 'react';
import type { CartItem, Product } from '@/types';

const STORAGE_KEY = 'brio.cart.v1'; // bump the version if the CartItem shape changes

/* ------------------------------ Reducer ------------------------------ */

type CartAction =
  | { type: 'ADD'; product: Product; quantity: number }
  | { type: 'SET_QUANTITY'; productId: number; quantity: number }
  | { type: 'REMOVE'; productId: number }
  | { type: 'CLEAR' }
  | { type: 'HYDRATE'; items: CartItem[] };

function cartReducer(items: CartItem[], action: CartAction): CartItem[] {
  switch (action.type) {
    case 'ADD': {
      const { product, quantity } = action;
      if (product.stock <= 0) return items; // can't add out-of-stock items

      const existing = items.find((i) => i.productId === product.id);
      if (existing) {
        // Already in cart: increase quantity, capped at stock.
        return items.map((i) =>
          i.productId === product.id
            ? { ...i, quantity: Math.min(i.quantity + quantity, i.maxQuantity) }
            : i,
        );
      }
      // New line: snapshot the product fields we need to render the cart.
      return [
        ...items,
        {
          productId: product.id,
          name: product.name,
          category: product.category,
          price: product.price,
          image: product.image,
          quantity: Math.min(quantity, product.stock),
          maxQuantity: product.stock,
        },
      ];
    }
    case 'SET_QUANTITY':
      if (action.quantity <= 0) return items.filter((i) => i.productId !== action.productId);
      return items.map((i) =>
        i.productId === action.productId
          ? { ...i, quantity: Math.min(action.quantity, i.maxQuantity) }
          : i,
      );
    case 'REMOVE':
      return items.filter((i) => i.productId !== action.productId);
    case 'CLEAR':
      return [];
    case 'HYDRATE':
      return action.items;
  }
}

/* --------------------------- Local storage --------------------------- */

/** Runtime check: localStorage is untrusted input, so don't just cast it. */
function isCartItem(value: unknown): value is CartItem {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.productId === 'number' &&
    typeof v.name === 'string' &&
    typeof v.category === 'string' &&
    typeof v.price === 'number' &&
    typeof v.image === 'string' &&
    typeof v.quantity === 'number' &&
    v.quantity > 0 &&
    typeof v.maxQuantity === 'number'
  );
}

function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(isCartItem) : [];
  } catch {
    return []; // corrupted JSON or storage blocked
  }
}

/* ------------------------------ Context ------------------------------ */

interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  /** Adds to the cart and opens the drawer. */
  addItem: (product: Product, quantity?: number) => void;
  setQuantity: (productId: number, quantity: number) => void;
  removeItem: (productId: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, dispatch] = useReducer(cartReducer, undefined, loadCart); // lazy init from storage
  const [isOpen, setIsOpen] = useState(false);

  // Save on every change.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* storage full or unavailable (private mode): cart still works in memory */
    }
  }, [items]);

  // Keep other tabs in sync.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) dispatch({ type: 'HYDRATE', items: loadCart() });
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const toggleCart = useCallback(() => setIsOpen((o) => !o), []);

  const addItem = useCallback((product: Product, quantity = 1) => {
    dispatch({ type: 'ADD', product, quantity });
    setIsOpen(true);
  }, []);
  const setQuantity = useCallback(
    (productId: number, quantity: number) => dispatch({ type: 'SET_QUANTITY', productId, quantity }),
    [],
  );
  const removeItem = useCallback(
    (productId: number) => dispatch({ type: 'REMOVE', productId }),
    [],
  );
  const clearCart = useCallback(() => dispatch({ type: 'CLEAR' }), []);

  const value = useMemo<CartContextValue>(() => {
    const itemCount = items.reduce((n, i) => n + i.quantity, 0);
    // Sum in cents to avoid floating-point drift (e.g. 0.1 + 0.2).
    const subtotal = items.reduce((sum, i) => sum + Math.round(i.price * 100) * i.quantity, 0) / 100;
    return {
      items, itemCount, subtotal, isOpen,
      openCart, closeCart, toggleCart, addItem, setQuantity, removeItem, clearCart,
    };
  }, [items, isOpen, openCart, closeCart, toggleCart, addItem, setQuantity, removeItem, clearCart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
}