import type { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/utils/format';

interface Props {
  products: Product[] | null;
}

export function PromoBanners({ products }: Props) {
  const { addItem } = useCart();

  if (!products || products.length === 0) return null;

  const metaMap: Record<number, { eyebrow: string; tag: string; bgClass: string }> = {
    1: {
      eyebrow: 'Organic Care',
      tag: 'Brightening & Softening',
      bgClass: 'promo-card--mint',
    },
    2: {
      eyebrow: 'Daily Defence',
      tag: 'SPF 30 Face Care',
      bgClass: 'promo-card--rose',
    },
    3: {
      eyebrow: 'Fresh Botanical',
      tag: 'Deep Cleansing Gel',
      bgClass: 'promo-card--sage',
    },
    4: {
      eyebrow: 'Active Radiance',
      tag: 'Vitamin C & E Glow',
      bgClass: 'promo-card--gold',
    },
  };

  return (
    <div className="promo-banners">
      {products.map((product) => {
        const itemMeta = metaMap[product.id] || {
          eyebrow: 'Special Offer',
          tag: 'Add to Cart',
          bgClass: 'promo-card--mint',
        };
        const soldOut = product.stock <= 0;

        return (
          <article
            key={product.id}
            className={`promo-card ${itemMeta.bgClass}`}
            aria-label={product.name}
          >
            <div className="promo-card__content">
              <span className="promo-card__eyebrow">{itemMeta.eyebrow}</span>
              <h3 className="promo-card__title">{product.name}</h3>
              
              <div className="promo-card__price-row">
                <span className="promo-card__price">{formatPrice(product.price)}</span>
                {product.compareAtPrice && (
                  <s className="promo-card__compare">{formatPrice(product.compareAtPrice)}</s>
                )}
              </div>

              <div className="promo-card__actions">
                <button
                  type="button"
                  className="promo-card__btn"
                  disabled={soldOut}
                  onClick={() => addItem(product)}
                  aria-label={`Add ${product.name} to cart`}
                >
                  {soldOut ? 'Sold out' : 'Add to Cart'}
                </button>
                <span className="promo-card__tag-pill">{itemMeta.tag}</span>
              </div>
            </div>

            <div className="promo-card__media">
              <img
                src={product.image}
                alt={product.name}
                loading="lazy"
                className="promo-card__img"
              />
            </div>
          </article>
        );
      })}
    </div>
  );
}
