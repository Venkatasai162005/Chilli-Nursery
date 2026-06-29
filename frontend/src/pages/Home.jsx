import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { useLang } from '../context/LanguageContext';
import { useTranslate } from '../context/useTranslate';

// Sub-component so useTranslate hook is called per card (respects Rules of Hooks)
function FeaturedCard({ p, stockLabel, t }) {
  const desc = useTranslate(p.description || '');
  return (
    <div className="fp-card animate-fade-up">
      <div className="fp-img-wrap">
        <img src={p.imageUrl || 'https://placehold.co/400x400/1a2e1a/6abf7b?text=🌱'} alt={p.name} className="fp-img"
          onError={(e) => { e.target.src = 'https://placehold.co/400x400/1a2e1a/6abf7b?text=🌱'; }} />
        <span className={`fp-type-badge fp-type-${(p.type || 'hybrid').toLowerCase()}`}>
          {t({ Seedling:'typeSeedling', Grafted:'typeGrafted', Hybrid:'typeHybrid', 'Open Pollinated':'typeOpenPollinated', Other:'typeOther' }[p.type] || 'typeHybrid')}
        </span>
      </div>
      <div className="fp-body">
        <h3 className="fp-name">{p.name}</h3>
        <p className="fp-desc">{desc}</p>
        <div className="fp-footer">
          <div>
            <div className="fp-price">₹{p.price}<span>{t('sapling')}</span></div>
            <div className="fp-stock">{stockLabel(p.stock)}</div>
          </div>
          <Link to={`/plants/${p._id}`} className="btn btn-primary btn-sm fp-btn">{t('orderNow')}</Link>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const { t } = useLang();
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    api.get('/plants')
      .then((res) => setFeatured(res.data.slice(0, 4)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);


  const stockLabel = (stock) => {
    if (stock > 100) return t('inStock');
    if (stock > 0)   return `${t('lowStock')} ${stock} ${t('left')}`;
    return t('outOfStock');
  };

  return (
    <div className="page-wrapper">
      {/* Hero */}
      <section className="home-hero">
        <div className="hero-bg-glow" />
        <div className="container hero-content animate-fade-up">
          <div style={{ marginBottom: '1.5rem' }}>
            <img src="/logo.png" alt="Sri Devi Chilli Nursery"
              style={{ height: 130, width: 'auto', objectFit: 'contain', filter: 'drop-shadow(0 4px 20px rgba(0,0,0,0.5))' }} />
          </div>
          <div className="hero-badge">{t('heroBadge')}</div>
          <h1 className="hero-title">
            {t('heroTitle')}<br />
            <span className="hero-title-accent">{t('heroAccent')}</span>
          </h1>
          <p className="hero-subtitle">{t('heroSub')}</p>
          <div className="hero-actions">
            <Link to="/browse" className="btn btn-primary hero-cta">{t('browseBtn')}</Link>
            <Link to="/track"  className="btn btn-outline hero-cta">{t('trackBtn')}</Link>
          </div>
          <div className="hero-stats">
            <div className="hero-stat"><span>50+</span><p>{t('varieties')}</p></div>
            <div className="hero-stat-divider" />
            <div className="hero-stat"><span>500+</span><p>{t('farmersServed')}</p></div>
            <div className="hero-stat-divider" />
            <div className="hero-stat"><span>98%</span><p>{t('survivalRate')}</p></div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section" style={{ background: 'var(--bg-2)' }}>
        <div className="container">
          <h2 className="section-title text-center">{t('howToOrder')}</h2>
          <p className="section-subtitle text-center">{t('simpleSteps')}</p>
          <div className="steps-grid">
            {[
              { icon: '🔍', step: '1', titleK: 's1title', descK: 's1desc' },
              { icon: '🛒', step: '2', titleK: 's2title', descK: 's2desc' },
              { icon: '📝', step: '3', titleK: 's3title', descK: 's3desc' },
              { icon: '📦', step: '4', titleK: 's4title', descK: 's4desc' },
            ].map((s) => (
              <div key={s.step} className="step-card animate-fade-up">
                <div className="step-icon">{s.icon}</div>
                <div className="step-number">{t('step')} {s.step}</div>
                <h3>{t(s.titleK)}</h3>
                <p>{t(s.descK)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Plants */}
      <section className="section">
        <div className="container">
          <div className="flex items-center justify-between" style={{ marginBottom: '2rem' }}>
            <div>
              <h2 className="section-title">{t('featuredPlants')}</h2>
              <p className="section-subtitle">{t('featuredSub')}</p>
            </div>
            <Link to="/browse" className="btn btn-outline btn-sm">{t('viewAll')}</Link>
          </div>
          {loading ? (
            <div className="loading-center"><div className="spinner" /></div>
          ) : featured.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌱</div>
              <p style={{ fontSize: '1rem' }}>No plants added yet — check back soon!</p>
              <Link to="/browse" className="btn btn-outline btn-sm" style={{ marginTop: '1rem' }}>{t('viewAll')}</Link>
            </div>
          ) : (
            <div className="featured-grid">
              {featured.map((p) => (
                <FeaturedCard key={p._id} p={p} stockLabel={stockLabel} t={t} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why Us */}
      <section className="section" style={{ background: 'var(--bg-2)' }}>
        <div className="container">
          <h2 className="section-title text-center">{t('whyUs')}</h2>
          <div className="grid-3" style={{ marginTop: '2rem' }}>
            {[
              { icon: '🌿', titleK: 'f1title', descK: 'f1desc' },
              { icon: '💰', titleK: 'f2title', descK: 'f2desc' },
              { icon: '📱', titleK: 'f3title', descK: 'f3desc' },
            ].map((f) => (
              <div key={f.titleK} className="feature-card animate-fade-up">
                <div className="feature-icon">{f.icon}</div>
                <h3>{t(f.titleK)}</h3>
                <p>{t(f.descK)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="home-cta-banner">
        <div className="container text-center">
          <h2>{t('ctaTitle')}</h2>
          <p>{t('ctaSub')}</p>
          <Link to="/browse" className="btn btn-primary" style={{ fontSize: '1.05rem', padding: '0.85rem 2rem' }}>
            {t('startBrowsing')}
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <div className="container">
          <div className="footer-grid">
            <div>
              <div style={{ marginBottom: '0.75rem' }}>
                <img src="/logo.png" alt="Sri Devi Chilli Nursery"
                  style={{ height: 70, width: 'auto', objectFit: 'contain', filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.5))' }} />
              </div>
              <p className="text-muted text-sm">{t('footerSub')}</p>
            </div>
            <div>
              <h4 style={{ marginBottom: '0.75rem', color: 'var(--text-secondary)' }}>{t('quickLinks')}</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <Link to="/browse"  className="footer-link">{t('browsePlants')}</Link>
                <Link to="/track"   className="footer-link">{t('trackOrder')}</Link>
                <Link to="/contact" className="footer-link">{t('contactUs')}</Link>
              </div>
            </div>
          </div>
          <div className="divider" />
          <p className="text-center text-xs text-muted">{t('copyright')}</p>
        </div>
      </footer>

      <style>{`
        .home-hero { min-height:92vh; display:flex; align-items:center; position:relative; overflow:hidden;
          background: radial-gradient(ellipse at 20% 50%,rgba(39,107,66,.18) 0%,transparent 60%),
                      radial-gradient(ellipse at 80% 20%,rgba(230,57,70,.10) 0%,transparent 50%),var(--bg); }
        .hero-bg-glow { position:absolute; top:-200px; right:-200px; width:600px; height:600px;
          background:radial-gradient(circle,rgba(64,145,108,.12) 0%,transparent 70%); pointer-events:none; }
        .hero-content { position:relative; z-index:1; padding:4rem 0; }
        .hero-badge { display:inline-flex; align-items:center; gap:.4rem; background:rgba(64,145,108,.15);
          border:1px solid rgba(64,145,108,.3); color:var(--green-300); padding:.4rem 1rem;
          border-radius:var(--radius-full); font-size:.85rem; font-weight:600; margin-bottom:1.25rem; font-family:var(--font-display); }
        .hero-title { font-size:clamp(2rem,5vw,3.5rem); font-weight:900; line-height:1.1; margin-bottom:1.25rem; max-width:700px; }
        .hero-title-accent { background:linear-gradient(135deg,var(--green-300),var(--green-400));
          -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
        .hero-subtitle { font-size:1.1rem; color:var(--text-secondary); max-width:540px; margin-bottom:2rem; line-height:1.7; }
        .hero-actions { display:flex; gap:1rem; flex-wrap:wrap; margin-bottom:3rem; }
        .hero-cta { font-size:1rem; padding:.85rem 1.75rem; }
        .hero-stats { display:flex; align-items:center; gap:2rem; flex-wrap:wrap; }
        .hero-stat span { font-size:1.75rem; font-weight:800; color:var(--green-300); font-family:var(--font-display); }
        .hero-stat p { font-size:.8rem; color:var(--text-muted); margin-top:.1rem; }
        .hero-stat-divider { width:1px; height:40px; background:var(--border-2); }
        .section-title { font-size:1.75rem; font-weight:800; margin-bottom:.4rem; }
        .section-subtitle { color:var(--text-muted); font-size:.95rem; }
        .featured-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(260px,1fr)); gap:1.5rem; }
        @media(max-width:560px){ .featured-grid{ grid-template-columns:1fr; } }
        .fp-card { background:var(--bg-2); border:1px solid var(--border); border-radius:var(--radius-lg);
          overflow:hidden; transition:transform var(--transition),box-shadow var(--transition),border-color var(--transition); display:flex; flex-direction:column; }
        .fp-card:hover { transform:translateY(-6px); box-shadow:0 12px 40px rgba(0,0,0,.35); border-color:var(--green-600); }
        .fp-img-wrap { position:relative; aspect-ratio:4/3; overflow:hidden; background:var(--bg-3); }
        .fp-img { width:100%; height:100%; object-fit:cover; transition:transform .45s ease; }
        .fp-card:hover .fp-img { transform:scale(1.07); }
        .fp-badge { position:absolute; top:.65rem; left:.65rem; background:rgba(16,16,24,.82); backdrop-filter:blur(6px);
          border:1px solid rgba(255,255,255,.1); color:#fff; font-size:.72rem; font-weight:700;
          padding:.25rem .65rem; border-radius:var(--radius-full); }
        .fp-type-badge { position:absolute; bottom:.65rem; right:.65rem; font-size:.68rem; font-weight:700;
          padding:.2rem .55rem; border-radius:var(--radius-sm); text-transform:uppercase; letter-spacing:.06em; }
        .fp-type-hybrid { background:rgba(64,145,108,.85); color:#fff; }
        .fp-type-grafted { background:rgba(230,57,70,.85); color:#fff; }
        .fp-type-open { background:rgba(245,158,11,.85); color:#fff; }
        .fp-body { padding:1.1rem; flex:1; display:flex; flex-direction:column; gap:.4rem; }
        .fp-name { font-size:1.05rem; font-weight:800; color:var(--text-primary); margin:0; }
        .fp-desc { font-size:.82rem; color:var(--text-muted); line-height:1.55; flex:1;
          display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical; overflow:hidden; }
        .fp-footer { display:flex; align-items:center; justify-content:space-between; margin-top:.75rem; }
        .fp-price { font-size:1.3rem; font-weight:900; color:var(--green-300); font-family:var(--font-display); }
        .fp-price span { font-size:.75rem; font-weight:500; color:var(--text-muted); }
        .fp-stock { font-size:.75rem; color:var(--text-muted); margin-top:.1rem; }
        .fp-btn { font-size:.82rem; padding:.5rem 1rem; white-space:nowrap; }
        .steps-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:1.25rem; margin-top:2rem; }
        @media(max-width:900px){ .steps-grid{ grid-template-columns:repeat(2,1fr); } }
        @media(max-width:540px){ .steps-grid{ grid-template-columns:1fr; } }
        .step-card { background:var(--bg-3); border:1px solid var(--border); border-radius:var(--radius-lg);
          padding:1.5rem; text-align:center; transition:transform var(--transition),box-shadow var(--transition); }
        .step-card:hover { transform:translateY(-4px); box-shadow:var(--shadow-glow); }
        .step-icon { font-size:2rem; margin-bottom:.75rem; }
        .step-number { font-size:.75rem; font-weight:700; color:var(--green-400); text-transform:uppercase; letter-spacing:.08em; margin-bottom:.4rem; }
        .step-card h3 { font-size:1rem; font-weight:700; margin-bottom:.4rem; }
        .step-card p { font-size:.85rem; color:var(--text-muted); }
        .feature-card { background:var(--bg-3); border:1px solid var(--border); border-radius:var(--radius-lg);
          padding:2rem 1.5rem; text-align:center; transition:transform var(--transition); }
        .feature-card:hover { transform:translateY(-3px); }
        .feature-icon { font-size:2.5rem; margin-bottom:1rem; }
        .feature-card h3 { font-size:1.1rem; font-weight:700; margin-bottom:.5rem; }
        .feature-card p { font-size:.9rem; color:var(--text-muted); line-height:1.6; }
        .home-cta-banner { background:linear-gradient(135deg,var(--green-800),var(--green-700));
          border-top:1px solid var(--green-600); border-bottom:1px solid var(--green-600); padding:4rem 0; }
        .home-cta-banner h2 { font-size:2rem; font-weight:800; margin-bottom:.75rem; }
        .home-cta-banner p { color:var(--green-100); margin-bottom:2rem; }
        .home-footer { background:var(--bg-2); border-top:1px solid var(--border); padding:3rem 0 1.5rem; }
        .footer-grid { display:grid; grid-template-columns:2fr 1fr; gap:2rem; margin-bottom:1.5rem; }
        @media(max-width:640px){ .footer-grid{ grid-template-columns:1fr; } }
        .footer-link { color:var(--text-muted); font-size:.9rem; transition:color var(--transition); display:block; }
        .footer-link:hover { color:var(--green-300); }
      `}</style>
    </div>
  );
}
