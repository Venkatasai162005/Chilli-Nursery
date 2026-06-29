import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { useCart } from '../context/CartContext';
import { useLang } from '../context/LanguageContext';
import { useTranslate } from '../context/useTranslate';

const PLACEHOLDER = 'https://images.unsplash.com/photo-1588714477688-cf28a50e94f7?w=800&q=80';

export default function PlantDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { t } = useLang();
  const [plant, setPlant]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty]       = useState(1);
  const [added, setAdded]   = useState(false);

  useEffect(() => {
    api.get(`/plants/${id}`)
      .then((r) => setPlant(r.data))
      .catch(() => navigate('/browse'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleAdd = () => {
    addItem(plant, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  // Auto-translate description and growingTips
  const translatedDesc = useTranslate(plant?.description || '');
  const translatedTips = useTranslate(plant?.growingTips || '');

  if (loading) return <div className="loading-center"><div className="spinner" /></div>;
  if (!plant)  return null;

  return (
    <div className="page-wrapper">
      <div className="container section">
        <button className="btn btn-ghost btn-sm" style={{ marginBottom: '1.5rem' }} onClick={() => navigate(-1)}>
          {t('back')}
        </button>

        <div className="detail-grid">
          {/* Image */}
          <div className="detail-img-wrap">
            <img
              src={plant.imageUrl || PLACEHOLDER}
              alt={plant.name}
              className="detail-img"
              onError={(e) => { e.target.src = PLACEHOLDER; }}
            />
            {plant.stock === 0 && <div className="detail-out-badge">{t('outOfStockBadge')}</div>}
          </div>

          {/* Info */}
          <div className="detail-info animate-fade-up">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <span className="detail-type-badge">
                {t({ Seedling:'typeSeedling', Grafted:'typeGrafted', Hybrid:'typeHybrid', 'Open Pollinated':'typeOpenPollinated', Other:'typeOther' }[plant.type] || 'typeOther')}
              </span>
              {plant.stock > 0 && plant.stock <= 10 && (
                <span style={{ fontSize: '0.78rem', color: '#f59e0b', fontWeight: 600 }}>
                  ⚠️ {t('onlyLeft')} {plant.stock} {t('leftBadge')}
                </span>
              )}
            </div>

            <h1 className="detail-name">{plant.name}</h1>

            <div className="detail-price">
              ₹{plant.price}
              <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 400 }}> {t('perPlant')}</span>
            </div>

            {plant.description && (
              <div className="detail-section">
                <h3>{t('aboutVariety')}</h3>
                <p>{translatedDesc}</p>
              </div>
            )}

            {plant.growingTips && (
              <div className="detail-section tips">
                <h3>{t('growingTipsLabel')}</h3>
                <p>{translatedTips}</p>
              </div>
            )}

            {/* Stock info */}
            <div className="detail-stock-row">
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                {t('inStockCount')}: <strong style={{ color: plant.stock > 0 ? 'var(--green-300)' : 'var(--red-500)' }}>
                  {plant.stock > 0 ? `${plant.stock} ${t('plants')}` : t('soldOutLabel')}
                </strong>
              </span>
            </div>

            {/* Qty selector + Add to cart */}
            {plant.stock > 0 && (
              <div className="detail-actions">
                <div className="qty-selector">
                  <button onClick={() => setQty((q) => Math.max(1, q - 10))} title="−10">−</button>
                  <input
                    type="number"
                    value={qty}
                    min={1}
                    max={plant.stock}
                    onChange={(e) => {
                      const v = parseInt(e.target.value, 10);
                      if (!isNaN(v) && v >= 1) setQty(Math.min(v, plant.stock));
                    }}
                    className="qty-detail-input"
                  />
                  <button onClick={() => setQty((q) => Math.min(plant.stock, q + 10))} title="+10">+</button>
                </div>
                <button className={`btn btn-primary detail-add-btn ${added ? 'added' : ''}`} onClick={handleAdd}>
                  {added ? t('addedToCart') : t('addToCartFull')}
                </button>
              </div>
            )}

            <div style={{ marginTop: '1rem' }}>
              <button className="btn btn-ghost btn-sm" onClick={() => navigate('/cart')}>
                {t('viewCart')}
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .detail-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
          align-items: start;
        }
        @media(max-width:768px){ .detail-grid{ grid-template-columns: 1fr; gap: 1.5rem; } }
        .detail-img-wrap {
          position: relative;
          border-radius: var(--radius-xl);
          overflow: hidden;
          aspect-ratio: 1;
          background: var(--bg-2);
          border: 1px solid var(--border);
        }
        .detail-img { width: 100%; height: 100%; object-fit: cover; }
        .detail-out-badge {
          position: absolute; top: 1rem; left: 1rem;
          background: rgba(230,57,70,0.9); color: white;
          padding: 0.4rem 0.8rem; border-radius: var(--radius-sm);
          font-weight: 700; font-size: 0.85rem;
        }
        .detail-type-badge {
          background: rgba(64,145,108,0.15);
          color: var(--green-300);
          border: 1px solid rgba(64,145,108,0.3);
          padding: 0.25rem 0.75rem;
          border-radius: 999px;
          font-size: 0.8rem;
          font-weight: 700;
          font-family: var(--font-display);
        }
        .detail-name {
          font-size: 2rem; font-weight: 900;
          margin-bottom: 0.5rem; line-height: 1.15;
        }
        .detail-price {
          font-size: 2rem; font-weight: 800;
          color: var(--green-300); font-family: var(--font-display);
          margin-bottom: 1.5rem;
        }
        .detail-section { margin-bottom: 1.25rem; }
        .detail-section h3 {
          font-size: 0.85rem; font-weight: 700; text-transform: uppercase;
          letter-spacing: 0.06em; color: var(--text-muted); margin-bottom: 0.4rem;
        }
        .detail-section p { color: var(--text-secondary); line-height: 1.7; font-size: 0.95rem; }
        .detail-section.tips {
          background: rgba(64,145,108,0.08);
          border: 1px solid rgba(64,145,108,0.2);
          border-radius: var(--radius-md);
          padding: 1rem;
        }
        .detail-stock-row { margin-bottom: 1.5rem; }
        .detail-actions { display: flex; align-items: center; gap: 1rem; margin-bottom: 0.75rem; flex-wrap: wrap; }
        .qty-selector {
          display: flex; align-items: center;
          background: var(--bg-3);
          border: 1px solid var(--border-2);
          border-radius: var(--radius-md);
          overflow: hidden;
        }
        .qty-selector button {
          width: 40px; height: 44px;
          background: none; border: none;
          color: var(--text-primary); font-size: 1.2rem; font-weight: 700;
          cursor: pointer; transition: background var(--transition);
        }
        .qty-selector button:hover:not(:disabled) { background: var(--surface-2); }
        .qty-selector button:disabled { opacity: 0.3; cursor: not-allowed; }
        .qty-selector span {
          min-width: 44px; text-align: center;
          font-weight: 700; font-size: 1.05rem;
          font-family: var(--font-display);
          border-left: 1px solid var(--border-2);
          border-right: 1px solid var(--border-2);
          padding: 0 0.5rem; line-height: 44px;
        }
        .qty-detail-input {
          width: 72px; text-align: center; font-weight: 700; font-size: 1rem;
          border: none; border-left: 1px solid var(--border-2); border-right: 1px solid var(--border-2);
          border-radius: 0; height: 44px; background: #fff; padding: 0 0.25rem;
          box-shadow: none !important;
        }
        .qty-detail-input:focus { outline: none; box-shadow: none !important; border-color: var(--border-2) !important; }
        .qty-detail-input::-webkit-inner-spin-button { opacity: 1; }
        .detail-add-btn { flex: 1; min-width: 180px; }
        .detail-add-btn.added {
          background: linear-gradient(135deg, #10b981, #34d399);
          box-shadow: 0 4px 14px rgba(16,185,129,0.4);
        }
      `}</style>
    </div>
  );
}
