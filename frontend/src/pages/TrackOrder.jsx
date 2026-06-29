import { useState } from 'react';
import api from '../api';
import toast from 'react-hot-toast';
import { useLang } from '../context/LanguageContext';

const STATUS_STEPS = ['Pending', 'Confirmed', 'Ready', 'Delivered'];

const STATUS_META = {
  Pending:   { icon: '⏳', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)',  border: 'rgba(245,158,11,0.3)',  key: 'statusPending'   },
  Confirmed: { icon: '✅', color: '#3b82f6', bg: 'rgba(59,130,246,0.12)',  border: 'rgba(59,130,246,0.3)',  key: 'statusConfirmed' },
  Ready:     { icon: '📦', color: '#8b5cf6', bg: 'rgba(139,92,246,0.12)', border: 'rgba(139,92,246,0.3)', key: 'statusReady'     },
  Delivered: { icon: '🎉', color: '#10b981', bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.3)', key: 'statusDelivered' },
};

function OrderCard({ order, t }) {
  const [open, setOpen] = useState(false);
  const stepIdx = STATUS_STEPS.indexOf(order.status);
  const meta    = STATUS_META[order.status] || STATUS_META.Pending;

  return (
    <div className="tro-card">
      {/* Header row */}
      <div className="tro-card-head" onClick={() => setOpen((o) => !o)}>
        <div className="tro-head-left">
          <span className="tro-status-badge" style={{ background: meta.bg, color: meta.color, border: `1px solid ${meta.border}` }}>
            {meta.icon} {t(meta.key)}
          </span>
          <span className="tro-order-id">{order.orderId}</span>
        </div>
        <div className="tro-head-right">
          <span className="tro-total">₹{order.total}</span>
          <span className="tro-date">
            {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
          </span>
          <span className="tro-chevron">{open ? '▲' : '▼'}</span>
        </div>
      </div>

      {/* Progress timeline */}
      <div className="tro-progress">
        {STATUS_STEPS.map((s, i) => (
          <div key={s} className="tro-step-wrap">
            <div className="tro-step" style={{
              background:   i <= stepIdx ? 'var(--green-600)' : 'var(--bg-3)',
              border:       `2px solid ${i <= stepIdx ? 'var(--green-400)' : 'var(--border-2)'}`,
              color:        i <= stepIdx ? '#fff' : 'var(--text-muted)',
              boxShadow:    i === stepIdx ? '0 0 0 4px rgba(64,145,108,0.25)' : 'none',
              fontWeight:   i === stepIdx ? 900 : 400,
            }}>
              {i <= stepIdx ? '✓' : i + 1}
            </div>
            <span className="tro-step-label" style={{
              color:      i <= stepIdx ? 'var(--green-300)' : 'var(--text-muted)',
              fontWeight: i === stepIdx ? 700 : 400,
            }}>
              {s}
            </span>
            {i < STATUS_STEPS.length - 1 && (
              <div className="tro-step-line" style={{ background: i < stepIdx ? 'var(--green-500)' : 'var(--border-2)' }} />
            )}
          </div>
        ))}
      </div>

      {/* Expandable detail */}
      {open && (
        <div className="tro-detail animate-fade-up">
          <div className="tro-detail-row">
            <span>{t('name')}</span>
            <strong>{order.farmerName}</strong>
          </div>
          <div className="tro-detail-row">
            <span>📍</span>
            <strong>{order.address}</strong>
          </div>
          <div className="tro-detail-row">
            <span>🚚</span>
            <strong>{order.deliveryType === 'pickup' ? t('deliveryPickup') : t('deliveryHome')}</strong>
          </div>

          <div className="tro-items">
            {order.items.map((item, idx) => (
              <div key={idx} className="tro-item-row">
                <span>🌱 {item.plantName}</span>
                <span>{item.qty} × ₹{item.priceEach}</span>
                <strong style={{ color: 'var(--green-300)' }}>₹{item.qty * item.priceEach}</strong>
              </div>
            ))}
          </div>

          <div className="tro-total-row">
            <span>{t('totalLabel')}</span>
            <strong style={{ color: 'var(--green-300)', fontSize: '1.1rem' }}>₹{order.total}</strong>
          </div>

          {order.notes && (
            <div className="tro-notes">💬 {order.notes}</div>
          )}
        </div>
      )}
    </div>
  );
}

export default function TrackOrder() {
  const { t } = useLang();
  const [phone, setPhone]     = useState('');
  const [orders, setOrders]   = useState(null);
  const [loading, setLoading] = useState(false);

  const handleTrack = async (e) => {
    e.preventDefault();
    const p = phone.trim();
    if (!p || p.length < 6) {
      toast.error('Please enter a valid mobile number');
      return;
    }
    setLoading(true);
    setOrders(null);
    try {
      const { data } = await api.get(`/orders/by-phone/${encodeURIComponent(p)}`);
      setOrders(data);
    } catch (err) {
      const msg = err.response?.data?.message;
      if (err.response?.status === 404) {
        setOrders([]);
        toast(msg || t('noOrdersFound'), { icon: '📭' });
      } else {
        toast.error(msg || 'Something went wrong');
      }
    } finally { setLoading(false); }
  };

  return (
    <div className="page-wrapper">
      <div className="container section">
        <div style={{ maxWidth: 660, margin: '0 auto' }}>

          {/* Page header */}
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>📱</div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.4rem' }}>{t('trackTitle')}</h1>
            <p className="text-muted">{t('trackSub')}</p>
          </div>

          {/* Info chips */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '2rem' }}>
            {['✅ No login needed', '✅ No Order ID', '✅ Just your phone number'].map((tip) => (
              <span key={tip} style={{
                background: 'rgba(64,145,108,0.12)', color: 'var(--green-300)',
                border: '1px solid rgba(64,145,108,0.25)', borderRadius: '999px',
                padding: '0.3rem 0.9rem', fontSize: '0.78rem', fontWeight: 600,
              }}>{tip}</span>
            ))}
          </div>

          {/* Search form */}
          <form onSubmit={handleTrack} style={{ display: 'flex', gap: '0.75rem', marginBottom: '2.5rem' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <span style={{
                position: 'absolute', left: '1rem', top: '50%',
                transform: 'translateY(-50%)', fontSize: '1.1rem', pointerEvents: 'none',
              }}>📞</span>
              <input
                id="phone-track-input"
                type="tel"
                placeholder={t('trackPlaceholder')}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={{ paddingLeft: '2.75rem', fontSize: '1.05rem', fontWeight: 600, width: '100%' }}
                maxLength={15}
              />
            </div>
            <button
              type="submit"
              id="track-orders-btn"
              className="btn btn-primary"
              disabled={loading}
              style={{ whiteSpace: 'nowrap', padding: '0 1.5rem' }}
            >
              {loading ? '…' : t('track')}
            </button>
          </form>

          {/* Results */}
          {orders !== null && (
            <div>
              {orders.length === 0 ? (
                <div className="empty-state">
                  <div className="emoji">📭</div>
                  <h3>{t('noOrdersFound')}</h3>
                  <p>Please check the number and try again</p>
                </div>
              ) : (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                    <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>{t('yourOrders')}</h2>
                    <span style={{
                      background: 'rgba(64,145,108,0.15)', color: 'var(--green-300)',
                      border: '1px solid rgba(64,145,108,0.3)', borderRadius: '999px',
                      padding: '0.15rem 0.6rem', fontSize: '0.8rem', fontWeight: 700,
                    }}>{orders.length}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {orders.map((o) => (
                      <OrderCard key={o.orderId} order={o} t={t} />
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <style>{`
        .tro-card {
          background: var(--bg-2);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          overflow: hidden;
          transition: box-shadow 0.2s, border-color 0.2s;
        }
        .tro-card:hover { border-color: var(--green-600); box-shadow: 0 4px 20px rgba(0,0,0,0.25); }
        .tro-card-head {
          display: flex; align-items: center; justify-content: space-between;
          padding: 1rem 1.25rem; cursor: pointer; gap: 1rem; flex-wrap: wrap;
          user-select: none;
        }
        .tro-head-left  { display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap; }
        .tro-head-right { display: flex; align-items: center; gap: 1rem; flex-wrap: wrap; }
        .tro-status-badge {
          padding: 0.3rem 0.8rem; border-radius: 999px;
          font-size: 0.78rem; font-weight: 700; font-family: var(--font-display);
          white-space: nowrap;
        }
        .tro-order-id {
          font-size: 0.85rem; font-weight: 700; color: var(--text-secondary);
          font-family: var(--font-display); letter-spacing: 0.05em;
        }
        .tro-total { font-size: 1.1rem; font-weight: 800; color: var(--green-300); font-family: var(--font-display); }
        .tro-date   { font-size: 0.78rem; color: var(--text-muted); }
        .tro-chevron { font-size: 0.7rem; color: var(--text-muted); }

        .tro-progress {
          display: flex; align-items: flex-start;
          padding: 0.75rem 1.25rem 1rem;
          border-top: 1px solid var(--border); background: var(--bg-3);
        }
        .tro-step-wrap {
          flex: 1; display: flex; flex-direction: column;
          align-items: center; gap: 0.35rem; position: relative;
        }
        .tro-step {
          width: 28px; height: 28px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.72rem; z-index: 1; transition: all 0.25s;
        }
        .tro-step-label {
          font-size: 0.62rem; text-align: center; line-height: 1.2;
          max-width: 64px; transition: color 0.2s;
        }
        .tro-step-line {
          position: absolute; top: 14px;
          left: calc(50% + 14px); width: calc(100% - 28px);
          height: 2px; transition: background 0.3s;
        }

        .tro-detail {
          padding: 1rem 1.25rem 1.25rem;
          border-top: 1px solid var(--border);
          display: flex; flex-direction: column; gap: 0.6rem;
        }
        .tro-detail-row {
          display: flex; gap: 0.75rem; font-size: 0.88rem; align-items: flex-start;
        }
        .tro-detail-row > span { color: var(--text-muted); min-width: 28px; flex-shrink: 0; }
        .tro-detail-row > strong { color: var(--text-primary); }
        .tro-items {
          background: var(--bg-3); border-radius: var(--radius-md);
          padding: 0.75rem; display: flex; flex-direction: column; gap: 0.4rem;
          margin: 0.25rem 0;
        }
        .tro-item-row {
          display: flex; justify-content: space-between; align-items: center;
          font-size: 0.85rem; gap: 0.5rem; flex-wrap: wrap;
        }
        .tro-total-row {
          display: flex; justify-content: space-between; align-items: center;
          padding-top: 0.5rem; border-top: 1px solid var(--border);
          font-size: 0.9rem; font-weight: 600; color: var(--text-secondary);
        }
        .tro-notes {
          background: rgba(64,145,108,0.08); border: 1px solid rgba(64,145,108,0.2);
          border-radius: var(--radius-sm); padding: 0.6rem 0.8rem;
          font-size: 0.82rem; color: var(--text-secondary);
        }
      `}</style>
    </div>
  );
}
