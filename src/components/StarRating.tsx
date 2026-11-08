import { StarIcon } from './Icons';

interface Props {
  rating: number;
  reviewCount?: number;
}

export function StarRating({ rating, reviewCount }: Props) {
  // Clamp to 0–5 in case the API sends something odd.
  const value = Math.max(0, Math.min(5, rating));

  return (
    <div className="stars" role="img" aria-label={`${value.toFixed(1)} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => {
        // 1 = full star, 0.5 = half, 0 = empty
        const fill = value >= n ? 1 : value >= n - 0.5 ? 0.5 : 0;
        return (
          <span key={n} className="stars__star">
            <StarIcon size={15} className="stars__empty" />
            {fill > 0 && (
              <span className="stars__fill" style={{ width: `${fill * 100}%` }}>
                <StarIcon size={15} filled />
              </span>
            )}
          </span>
        );
      })}
      {reviewCount !== undefined && <span className="stars__count">({reviewCount})</span>}
    </div>
  );
}