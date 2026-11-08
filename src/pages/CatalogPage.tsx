import { useEffect, useState, type FormEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SearchIcon } from '@/components/Icons';
import { ProductGrid } from '@/components/ProductGrid';
import { useApi } from '@/hooks/useApi';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { api } from '@/services/api';
import { CATEGORY_LABELS } from '@/services/productArt';
import type { CategorySlug } from '@/types';

type CategoryFilter = CategorySlug | 'all';

const TABS: Array<{ value: CategoryFilter; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'skin-care', label: CATEGORY_LABELS['skin-care'] },
  { value: 'bath-body', label: CATEGORY_LABELS['bath-body'] },
];

/** Never trust the URL: anything unknown falls back to "all". */
function parseCategory(value: string | null): CategoryFilter {
  return value === 'skin-care' || value === 'bath-body' ? value : 'all';
}

export function CatalogPage() {
  const [params, setParams] = useSearchParams();
  const category = parseCategory(params.get('category'));
  const urlQuery = params.get('q') ?? '';

  // The input has its own state so typing feels instant; the URL updates after a pause.
  const [search, setSearch] = useState(urlQuery);
  const debouncedSearch = useDebouncedValue(search);

  // URL → input (e.g. the navbar search or the back button changed `q`).
  useEffect(() => {
    setSearch(urlQuery);
  }, [urlQuery]);

  // Input → URL (after the user stops typing).
  useEffect(() => {
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        const term = debouncedSearch.trim();
        if (term) next.set('q', term);
        else next.delete('q');
        return next.toString() === prev.toString() ? prev : next;
      },
      { replace: true },
    );
    // Only react to the debounced value; urlQuery changes are handled above.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  function selectCategory(value: CategoryFilter) {
    setParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value === 'all') next.delete('category');
      else next.set('category', value);
      return next;
    });
  }

  const { data, loading, error, retry } = useApi(
    (signal) => api.getProducts({ category, search: urlQuery }, signal),
    [category, urlQuery],
  );

  const title = category === 'all' ? 'All Products' : CATEGORY_LABELS[category];

  return (
    <div className="container page">
      <header className="page__head">
        <div>
          <p className="eyebrow">Shop</p>
          <h1>{title}</h1>
          <p className="page__sub" aria-live="polite">
            {loading && !data
              ? 'Loading…'
              : data
                ? `${data.length} ${data.length === 1 ? 'product' : 'products'}${
                    urlQuery ? ` for “${urlQuery}”` : ''
                  }`
                : ''}
          </p>
        </div>

        <form
          className="search search--wide"
          role="search"
          onSubmit={(e: FormEvent) => e.preventDefault()}
        >
          <SearchIcon size={18} />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search the catalog…"
            aria-label="Search the catalog"
          />
        </form>
      </header>

      <nav className="tabs" aria-label="Product categories">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            type="button"
            className={`tab ${category === tab.value ? 'tab--active' : ''}`}
            aria-pressed={category === tab.value}
            onClick={() => selectCategory(tab.value)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <ProductGrid
        products={data}
        loading={loading}
        error={error}
        onRetry={retry}
        emptyText={
          urlQuery
            ? `Nothing matched “${urlQuery}”. Try a different word or category.`
            : 'There are no products in this category yet.'
        }
      />
    </div>
  );
}