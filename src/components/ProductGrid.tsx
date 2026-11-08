import type { Product } from '@/types';
import { Button } from './Button';
import { ProductCard } from './ProductCard';

interface Props {
  products: Product[] | null;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  /** Desktop column count (it still collapses to 2 then 1 on smaller screens). */
  columns?: 3 | 4;
  variant?: 'default' | 'tinted';
  skeletonCount?: number;
  emptyTitle?: string;
  emptyText?: string;
}

export function ProductGrid({
  products,
  loading,
  error,
  onRetry,
  columns = 4,
  variant = 'default',
  skeletonCount = 8,
  emptyTitle = 'No products found',
  emptyText = 'Try a different search or category.',
}: Props) {
  if (error) {
    return (
      <div className="state state--error" role="alert">
        <h3>We couldn’t load products</h3>
        <p>{error}</p>
        <Button variant="secondary" onClick={onRetry}>
          Try again
        </Button>
      </div>
    );
  }

  // First load: nothing to show yet, so show placeholders.
  if (loading && !products) {
    return (
      <div className={`grid grid--${columns}`} aria-busy="true" aria-label="Loading products">
        {Array.from({ length: skeletonCount }, (_, i) => (
          <div key={i} className="card card--skeleton" aria-hidden="true">
            <div className="skeleton skeleton--media" />
            <div className="card__body">
              <div className="skeleton skeleton--line skeleton--short" />
              <div className="skeleton skeleton--line" />
              <div className="skeleton skeleton--line skeleton--short" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="state">
        <h3>{emptyTitle}</h3>
        <p>{emptyText}</p>
      </div>
    );
  }

  // Refetching (e.g. new filter): keep old results visible but faded.
  return (
    <div className={`grid grid--${columns} ${loading ? 'grid--stale' : ''}`} aria-busy={loading}>
      {products.map((p) => (
        <ProductCard key={p.id} product={p} variant={variant} />
      ))}
    </div>
  );
}