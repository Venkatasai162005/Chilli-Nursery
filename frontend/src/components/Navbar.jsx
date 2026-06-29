import { useState } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LanguageContext';

const LANG_OPTIONS = [
  { code: 'en', label: 'EN' },
  { code: 'te', label: 'తె' },
  { code: 'hi', label: 'हि' },
];

export default function Navbar() {
  const { totalItems } = useCart();
  const { admin, logout } = useAuth();
  const { lang, t, switchLang } = useLang();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isAdmin = location.pathname.startsWith('/admin');

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* Logo */}
        <Link to="/" className="navbar-logo-img-link" onClick={() => setMenuOpen(false)}>
          <img src="/logo.png" alt="Sri Devi Chilli Nursery" className="navbar-logo-img" />
        </Link>

        {/* Language Switcher */}
        <div className="lang-switcher" style={{ display: 'flex', gap: '0.25rem', marginLeft: 'auto', marginRight: '0.75rem' }}>
          {LANG_OPTIONS.map((opt) => (
            <button
              key={opt.code}
              onClick={() => switchLang(opt.code)}
              style={{
                padding: '0.25rem 0.5rem',
                borderRadius: '6px',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                border: `1.5px solid ${lang === opt.code ? 'var(--green-400)' : 'var(--border-2)'}`,
                background: lang === opt.code ? 'rgba(64,145,108,0.2)' : 'transparent',
                color: lang === opt.code ? 'var(--green-200)' : 'var(--text-secondary)',
                transition: 'all 0.2s',
                fontFamily: 'sans-serif',
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Mobile menu toggle */}
        <button
          className="mobile-menu-btn"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {menuOpen ? '✕' : '☰'}
        </button>

        {/* Links */}
        {isAdmin ? (
          /* ── Admin nav ── */
          <ul className={`navbar-links ${menuOpen ? 'open' : ''}`}>
            <li><NavLink to="/admin"                onClick={() => setMenuOpen(false)}>Dashboard</NavLink></li>
            <li><NavLink to="/admin/plants"         onClick={() => setMenuOpen(false)}>Plants</NavLink></li>
            <li><NavLink to="/admin/orders"         onClick={() => setMenuOpen(false)}>Orders</NavLink></li>
            <li><NavLink to="/admin/reports"        onClick={() => setMenuOpen(false)}>Reports</NavLink></li>
            <li style={{ position: 'relative' }}>
              <NavLink to="/admin/notifications" onClick={() => setMenuOpen(false)}>
                🔔 Alerts
              </NavLink>
            </li>
            <li>
              <button className="btn btn-ghost btn-sm" onClick={handleLogout} style={{ marginLeft: '0.5rem' }}>
                Logout
              </button>
            </li>
          </ul>
        ) : (
          /* ── Farmer nav ── */
          <ul className={`navbar-links ${menuOpen ? 'open' : ''}`}>
            <li><NavLink to="/"        end onClick={() => setMenuOpen(false)}>{t('home')}</NavLink></li>
            <li><NavLink to="/browse"     onClick={() => setMenuOpen(false)}>{t('browsePlants')}</NavLink></li>
            <li><NavLink to="/track"      onClick={() => setMenuOpen(false)}>{t('trackOrder')}</NavLink></li>
            <li><NavLink to="/contact"    onClick={() => setMenuOpen(false)}>{t('contact')}</NavLink></li>
            <li>
              <Link
                to="/cart"
                className="navbar-cart-btn"
                onClick={() => setMenuOpen(false)}
              >
                🛒 {t('cart')}
                {totalItems > 0 && (
                  <span className="cart-badge">{totalItems}</span>
                )}
              </Link>
            </li>
            <li>
              <Link
                to="/admin/login"
                onClick={() => setMenuOpen(false)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.4rem 0.9rem',
                  borderRadius: '20px',
                  background: 'linear-gradient(135deg, #ff6b35 0%, #e91e8c 100%)',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  letterSpacing: '0.03em',
                  textDecoration: 'none',
                  boxShadow: '0 2px 12px rgba(233,30,140,0.35)',
                  border: 'none',
                  transition: 'transform 0.18s, box-shadow 0.18s',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'scale(1.06)';
                  e.currentTarget.style.boxShadow = '0 4px 18px rgba(233,30,140,0.55)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '0 2px 12px rgba(233,30,140,0.35)';
                }}
              >
                🔐 Admin
              </Link>
            </li>
          </ul>
        )}
      </div>
    </nav>
  );
}
