import { Link } from 'react-router-dom';
import { LeafIcon } from './Icons';

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <Link to="/" className="brand" aria-label="Brio home">
            <LeafIcon size={26} className="brand__leaf" />
            <span className="brand__name">Brio</span>
          </Link>
          <p>Clean, leaf-fresh skin and body care. Gentle on you, kind to the planet.</p>
        </div>

        <nav className="footer__col" aria-label="Shop">
          <h4>Shop</h4>
          <Link to="/products">All Products</Link>
          <Link to="/products?category=skin-care">Skin Care</Link>
          <Link to="/products?category=bath-body">Bath &amp; Body</Link>
        </nav>

        <nav className="footer__col" aria-label="Account">
          <h4>Account</h4>
          <Link to="/account">My account</Link>
          <Link to="/account">Order history</Link>
        </nav>
      </div>
      <div className="container footer__legal">
        <small>© {new Date().getFullYear()} Brio. All rights reserved.</small>
      </div>
    </footer>
  );
}