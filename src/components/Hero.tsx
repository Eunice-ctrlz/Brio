import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeftIcon, ChevronRightIcon } from './Icons';

interface Slide {
  id: string;
  categoryTag: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  mainImage: string;
  secondaryImage?: string;
  bgGradient: string;
}

const SLIDES: Slide[] = [
  {
    id: 'skin-care',
    categoryTag: 'Natural Botanicals',
    title: 'SKIN CARE',
    subtitle: 'Healthy & Natural · Fresh & Radiant',
    ctaText: 'Shop Skin Care',
    ctaLink: '/products?category=skin-care',
    mainImage: '/products/face_cream.jpeg',
    secondaryImage: '/products/serum.jpeg',
    bgGradient: 'linear-gradient(135deg, #F4FAF5 0%, #E8F5ED 100%)',
  },
  {
    id: 'bath-body',
    categoryTag: 'Pure Botanical Care',
    title: 'BATH & BODY',
    subtitle: 'Cleanse & Refresh · Pure Organic',
    ctaText: 'Shop Bath & Body',
    ctaLink: '/products?category=bath-body',
    mainImage: '/products/showergel.jpeg',
    secondaryImage: '/products/body_lotion.jpeg',
    bgGradient: 'linear-gradient(135deg, #FDF9F3 0%, #EEF7F1 100%)',
  },
];

export function Hero() {
  const [current, setCurrent] = useState(0);

  // Auto-advance slides every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const slide = SLIDES[current]!;

  return (
    <section className="hero-section" aria-label="Featured Promotions">
      <div className="container">
        <div
          className="hero-banner"
          style={{ background: slide.bgGradient }}
        >
          {/* Subtle botanical line-art watermark in corners */}
          <svg
            className="hero-banner__watermark hero-banner__watermark--tl"
            viewBox="0 0 160 160"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M10 150C20 90 60 40 150 10M10 150C50 140 100 110 150 50M10 150C80 120 130 90 150 10"
              stroke="#8CC63F"
              strokeWidth="1.5"
              strokeOpacity="0.22"
            />
            <circle cx="90" cy="50" r="3" fill="#8CC63F" fillOpacity="0.25" />
            <circle cx="120" cy="30" r="2" fill="#8CC63F" fillOpacity="0.25" />
          </svg>

          <svg
            className="hero-banner__watermark hero-banner__watermark--br"
            viewBox="0 0 160 160"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M150 10C140 70 100 120 10 150M150 10C110 20 60 50 10 110M150 10C80 40 30 70 10 150"
              stroke="#8CC63F"
              strokeWidth="1.5"
              strokeOpacity="0.22"
            />
          </svg>

          {/* Left Column: Real Product Mockup */}
          <div className="hero-banner__media">
            <div className="hero-banner__image-stage">
              {slide.secondaryImage && (
                <div className="hero-banner__prod-secondary">
                  <img
                    src={slide.secondaryImage}
                    alt=""
                    className="hero-banner__img hero-banner__img--second"
                  />
                </div>
              )}
              <div className="hero-banner__prod-main">
                <img
                  src={slide.mainImage}
                  alt={slide.title}
                  className="hero-banner__img hero-banner__img--main"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Hero Typography matching reference */}
          <div className="hero-banner__content">
            <span className="hero-banner__tag">{slide.categoryTag}</span>
            <h1 className="hero-banner__title">{slide.title}</h1>
            <p className="hero-banner__subtitle">{slide.subtitle}</p>
            <Link to={slide.ctaLink} className="hero-banner__cta">
              {slide.ctaText}
            </Link>
          </div>

          {/* Navigation Controls: Circular Next Button */}
          <button
            type="button"
            className="hero-banner__nav-btn hero-banner__nav-btn--next"
            onClick={() => setCurrent((c) => (c + 1) % SLIDES.length)}
            aria-label="Next slide"
          >
            <ChevronRightIcon size={20} />
          </button>

          <button
            type="button"
            className="hero-banner__nav-btn hero-banner__nav-btn--prev"
            onClick={() => setCurrent((c) => (c - 1 + SLIDES.length) % SLIDES.length)}
            aria-label="Previous slide"
          >
            <ChevronLeftIcon size={20} />
          </button>

          {/* Dots Indicator */}
          <div className="hero-banner__dots" role="tablist" aria-label="Slide dots">
            {SLIDES.map((s, index) => (
              <button
                key={s.id}
                type="button"
                role="tab"
                aria-selected={index === current}
                className={`hero-banner__dot ${index === current ? 'hero-banner__dot--active' : ''}`}
                onClick={() => setCurrent(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
