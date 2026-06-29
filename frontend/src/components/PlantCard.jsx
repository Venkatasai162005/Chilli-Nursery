import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useLang } from '../context/LanguageContext';
import { useTranslate } from '../context/useTranslate';

const PLACEHOLDER = 'https://images.unsplash.com/photo-1588714477688-cf28a50e94f7?w=400&q=80';

const TYPE_COLORS = {
  Seedling:          { bg: 'rgba(64,145,108,0.15)',  color: '#52b788' },
  Grafted:           { bg: 'rgba(245,158,11,0.15)',  color: '#fbbf24' },
  Hybrid:            { bg: 'rgba(59,130,246,0.15)',  color: '#60a5fa' },
  'Open Pollinated': { bg: 'rgba(168,85,247,0.15)', color: '#c084fc' },
  Other:             { bg: 'rgba(107,114,128,0.15)', color: '#9ca3af' },
};

export default function PlantCard({ plant }) {
  const { addItem } = useCart();
  const { t } = useLang();
  const [qty, setQty] = useState(100);
  const [added, setAdded] = useState(false);

  // Auto-translate admin-entered description to user's selected language
  const translatedDesc = useTranslate(plant.description || '');

  const typeStyle = TYPE_COLORS[plant.type] || TYPE_COLORS.Other;
  const price     = plant.price ?? plant.pricePerSapling ?? 0;
  const imgSrc    = plant.imageUrl || plant.image || PLACEHOLDER;
  const isOutOfStock = plant.stock === 0;

  const handleQtyChange = (e) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val) && val >= 1) setQty(val);
  };

  const handleAdd = () => {
    if (isOutOfStock) return;
    addItem(plant, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="plant-card animate-fade-up">
      {/* Image */}
      <Link to={`/plants/${plant._id}`} className="plant-card-img-wrap">
        <img
          src={imgSrc}
          alt={plant.name}
          className="plant-card-img"
          loading="lazy"
          onError={(e) => { e.target.src = PLACEHOLDER; }}
        />
        {plant.stock === 0 && (
          <div className="plant-card-out-badge">{t('outOfStock')}</div>
        )}
        {plant.stock > 0 && plant.stock <= 10 && (
          <div className="plant-card-low-badge">{t('onlyLeft')} {plant.stock} {t('left')}</div>
        )}
      </Link>

      {/* Info */}
      <div className="plant-card-body">
        <span className="plant-type-badge" style={{ background: typeStyle.bg, color: typeStyle.color }}>
          {t({ Seedling:'typeSeedling', Grafted:'typeGrafted', Hybrid:'typeHybrid', 'Open Pollinated':'typeOpenPollinated', Other:'typeOther' }[plant.type] || 'typeOther')}
        </span>

        <Link to={`/plants/${plant._id}`}>
          <h3 className="plant-card-name">{plant.name}</h3>
        </Link>

        {plant.description && (
          <p className="plant-card-desc">{translatedDesc}</p>
        )}

        {/* Price row */}
        <div className="plant-card-footer">
          <div>
            <span className="plant-price">₹{price}</span>
            <span className="plant-price-label"> {t('perSapling')}</span>
          </div>
        </div>

        {/* Quantity + Add to Cart */}
        {!isOutOfStock && (
          <div className="pc-qty-row">
            <div className="pc-qty-ctrl">
              <button
                className="pc-qty-btn"
                onClick={() => setQty((q) => Math.max(1, q - 10))}
                title="−10"
              >−</button>
              <input
                type="number"
                className="pc-qty-input"
                value={qty}
                min={1}
                onChange={handleQtyChange}
                title="Quantity"
              />
              <button
                className="pc-qty-btn"
                onClick={() => setQty((q) => q + 10)}
                title="+10"
              >+</button>
            </div>
            <button
              className={`btn btn-sm pc-add-btn ${added ? 'pc-add-btn--added' : 'btn-primary'}`}
              onClick={handleAdd}
            >
              {added ? t('addedToCart') : t('addToCart')}
            </button>
          </div>
        )}

        {isOutOfStock && (
          <div style={{ marginTop: '0.75rem' }}>
            <button className="btn btn-sm btn-ghost" disabled style={{ width: '100%' }}>
              {t('soldOut')}
            </button>
          </div>
        )}
      </div>

      <style>{`
        .pc-qty-row {
          display: flex; align-items: center; gap: 0.5rem; margin-top: 0.75rem; flex-wrap: wrap;
        }
        .pc-qty-ctrl {
          display: flex; align-items: center; border: 1.5px solid var(--border-2);
          border-radius: var(--radius-sm); overflow: hidden; background: #fff; flex-shrink: 0;
        }
        .pc-qty-btn {
          width: 28px; height: 32px; display: flex; align-items: center; justify-content: center;
          background: var(--bg-3); border: none; font-size: 1rem; font-weight: 700;
          color: var(--text-secondary); cursor: pointer; transition: background 0.15s;
          font-family: var(--font-display); flex-shrink: 0;
        }
        .pc-qty-btn:hover { background: var(--green-100); color: var(--green-800); }
        .pc-qty-input {
          width: 52px; border: none; border-left: 1px solid var(--border-2); border-right: 1px solid var(--border-2);
          border-radius: 0; text-align: center; padding: 0.25rem 0.2rem;
          font-size: 0.82rem; font-weight: 700; height: 32px; background: #fff;
          box-shadow: none !important;
        }
        .pc-qty-input:focus { outline: none; box-shadow: none !important; border-color: var(--border-2) !important; }
        .pc-qty-input::-webkit-inner-spin-button { opacity: 1; }
        .pc-add-btn { flex: 1; min-width: 80px; white-space: nowrap; transition: all 0.2s; }
        .pc-add-btn--added {
          background: var(--green-600) !important; color: #fff;
          border-color: var(--green-600) !important;
        }
      `}</style>
    </div>
  );
}
