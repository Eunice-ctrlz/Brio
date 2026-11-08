import { useEffect, useState, type FormEvent } from 'react';
import { Link, NavLink, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { CartIcon, CloseIcon, LeafIcon, MenuIcon, SearchIcon, UserIcon } from './Icons';

const LINKS = [
  { label: 'All Products', to: '/products' },
  { label: 'Skin Care', to: '/products?category=skin-care' },
  { label: 'Bath & Body', to: '/products?category=bath-body' },
];

export function Navbar() {
  const { user, isAuthenticated } = useAuth();
  const { itemCount, toggleCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();

  const [query, setQuery] = useState(params.get('q') ?? '');
  const [menuOpen, setMenuOpen] = useState(false);

  // Keep the input in sync when the URL changes (back button, category links, etc.).
  useEffect(() => {
    setQuery(params.get('q') ?? '');
  }, [params]);

  // Close the mobile menu after any navigation.
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname, location.search]);

  function onSearch(e: FormEvent) {
    e.preventDefault();
    const q = query.trim();
    navigate(q ? `/products?q=${encodeURIComponent(q)}` : '/products');
  }

  /** NavLink only compares paths, so decide "active" ourselves using the query string too. */
  function isActive(to: string): boolean {
    const [path = '', search = ''] = to.split('?');
    if (location.pathname !== path) return false;
    const wanted = new URLSearchParams(search).get('category');
    return (params.get('category') ?? null) === wanted;
  }

  return (
    <header className="nav">
      {/* Row 1: search · brand · actions (on mobile: menu · brand · actions, then search) */}
      <div className="container nav__top">
        <button
          type="button"
          className="icon-btn nav__burger"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="primary-nav"
          onClick={() => setMenuOpen((o) => !o)}
        >
          {menuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>

        <form className="search" role="search" onSubmit={onSearch}>
          <SearchIcon size={18} />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products…"
            aria-label="Search products"
          />
        </form>

        <Link to="/" className="brand" aria-label="Brio home">
          <LeafIcon size={30} className="brand__leaf" />
          <span className="brand__name">Brio</span>
        </Link>

        <div className="nav__actions">
          <Link
            to={isAuthenticated ? '/account' : '/login'}
            className="icon-btn"
            aria-label={isAuthenticated ? `My account (${user?.firstName})` : 'Sign in to your account'}
            title={isAuthenticated ? `Signed in as ${user?.firstName}` : 'Sign In'}
          >
            <UserIcon />
          </Link>
          <button
            type="button"
            className="icon-btn cart-btn"
            onClick={toggleCart}
            aria-label={`Cart, ${itemCount} ${itemCount === 1 ? 'item' : 'items'}`}
          >
            <CartIcon />
            {itemCount > 0 && <span className="cart-btn__badge">{itemCount}</span>}
          </button>
        </div>
      </div>

      {/* Row 2: category links, centred */}
      <div className={`nav__bar ${menuOpen ? 'nav__bar--open' : ''}`}>
        <div className="container">
          <nav id="primary-nav" className="nav__links" aria-label="Primary">
            {LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={() => `nav__link ${isActive(link.to) ? 'nav__link--active' : ''}`}
              >
                {link.label}
              </NavLink>
            ))}
            <NavLink
              to={isAuthenticated ? '/account' : '/login'}
              className={() => `nav__link nav__link--auth-mobile ${isActive(isAuthenticated ? '/account' : '/login') ? 'nav__link--active' : ''}`}
            >
              {isAuthenticated ? `My Account (${user?.firstName})` : 'Sign In / Register'}
            </NavLink>
          </nav>
        </div>
      </div>
    </header>
  );
}