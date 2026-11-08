import type { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { CATEGORY_LABELS } from '@/services/productArt';
import { formatPrice } from '@/utils/format';
import { Button } from './Button';
import { StarRating } from './StarRating';

const LOW_STOCK_THRESHOLD = 10;

function stockStatus(stock: number): { text: string; tone: 'in' | 'low' | 'out' } {
  if (stock <= 0) return { text: 'Out of stock', tone: 'out' };
  if (stock <= LOW_STOCK_THRESHOLD) return { text: `Only ${stock} left`, tone: 'low' };
  return { text: 'In stock', tone: 'in' };
}

interface Props {
  product: Product;
  variant?: 'default' | 'tinted';
}

export function ProductCard({ product, variant = 'default' }: Props) {
  const { addItem } = useCart();
  const status = stockStatus(product.stock);
  const soldOut = product.stock <= 0;

  return (
    <article className={`card card--${variant}`}>
      <div className="card__media">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="card__img"
        />
        {product.badge && <span className="badge card__badge">{product.badge}</span>}
      </div>

      <div className="card__body">
        <p className="card__category">{CATEGORY_LABELS[product.category]}</p>
        <h3 className="card__name">{product.name}</h3>
        
        <div className="card__rating-row">
          <StarRating rating={product.rating} reviewCount={product.reviewCount} />
        </div>

        <div className="card__price-row">
          <span className="card__price">{formatPrice(product.price)}</span>
          {product.compareAtPrice && (
            <s className="card__compare">{formatPrice(product.compareAtPrice)}</s>
          )}
        </div>

        <p className={`stock stock--${status.tone}`}>
          <span className="stock__dot" aria-hidden="true" />
          {status.text}
        </p>

        <Button
          fullWidth
          disabled={soldOut}
          onClick={() => addItem(product)}
          className="card__action-btn"
          aria-label={soldOut ? `${product.name} is out of stock` : `Add ${product.name} to cart`}
        >
          {soldOut ? 'Sold out' : 'Add to Cart'}
        </Button>
      </div>
    </article>
  );
}
