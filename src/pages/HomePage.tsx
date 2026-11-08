import { Link } from 'react-router-dom';
import { Hero } from '@/components/Hero';
import { PromoBanners } from '@/components/PromoBanners';
import { ProductGrid } from '@/components/ProductGrid';
import { useApi } from '@/hooks/useApi';
import { api } from '@/services/api';

export function HomePage() {
  const deals = useApi((signal) => api.getProducts({ deal: true }, signal), []);
  const featured = useApi((signal) => api.getProducts({ featured: true }, signal), []);

  return (
    <div className="home-page">
      <Hero />

      {/* Section: Daily Deals matching user's reference */}
      <section className="section section--promo" aria-labelledby="deals-title">
        <div className="container">
          <div className="section__head-centered">
            <h2 id="deals-title" className="section__title-centered">Daily Deals</h2>
            <p className="section__subtitle-centered">Special limited-time offers on our signature organic essentials</p>
          </div>

          <PromoBanners products={deals.data} />
        </div>
      </section>

      {/* Section: Featured Products matching user's reference */}
      <section className="section section--products" aria-labelledby="new-title">
        <div className="container">
          <div className="section__head-centered">
            <h2 id="new-title" className="section__title-centered">Featured Products</h2>
            <p className="section__subtitle-centered">Explore all fresh botanical formulations</p>
          </div>

          <ProductGrid
            products={featured.data}
            loading={featured.loading}
            error={featured.error}
            onRetry={featured.retry}
            columns={4}
          />

          <div className="section__footer-cta">
            <Link to="/products" className="btn btn--secondary btn--md">
              View all products →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
