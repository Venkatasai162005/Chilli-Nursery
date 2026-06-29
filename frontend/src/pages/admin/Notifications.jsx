import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api';

const TYPE_ICON   = { order: '📦', lowstock: '⚠️', delivered: '✅', system: '🔔' };
const TYPE_COLOR  = {
  order:     { bg: 'rgba(59,130,246,0.08)',  border: 'rgba(59,130,246,0.2)',  dot: '#3b82f6' },
  lowstock:  { bg: 'rgba(245,158,11,0.08)',  border: 'rgba(245,158,11,0.2)',  dot: '#f59e0b' },
  delivered: { bg: 'rgba(16,185,129,0.08)',  border: 'rgba(16,185,129,0.2)',  dot: '#10b981' },
  system:    { bg: 'rgba(107,114,128,0.08)', border: 'rgba(107,114,128,0.2)', dot: '#9ca3af' },
};

function timeAgo(date) {
  const secs = Math.floor((Date.now() - new Date(date)) / 1000);
  if (secs < 60)   return `${secs}s ago`;
  if (secs < 3600) return `${Math.floor(secs / 60)}m ago`;
  if (secs < 86400)return `${Math.floor(secs / 3600)}h ago`;
  return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

export default function Notifications() {
  const [orders,   setOrders]   = useState([]);
  const [plants,   setPlants]   = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [filter,   setFilter]   = useState('all');
  const [readIds,  setReadIds]  = useState(() => {
    try { return JSON.parse(localStorage.getItem('nf_read') || '[]'); } catch { return []; }
  });

  const load = useCallback(async () => {
    try {
      const [oRes, pRes] = await Promise.all([
        api.get('/orders'),
        api.get('/plants/admin/all'),
      ]);
      setOrders(oRes.data);
      setPlants(pRes.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  // Auto-refresh every 30s
  useEffect(() => {
    const iv = setInterval(load, 30000);
    return () => clearInterval(iv);
  }, [load]);

  // Build notifications from live data
  const notifications = [];

  // Recent orders (last 72h) as order notifications
  const cutoff72 = Date.now() - 72 * 3600000;
  orders
    .filter((o) => new Date(o.createdAt) >= cutoff72)
    .forEach((o) => {
      const isDelivered = o.status === 'Delivered';
      notifications.push({
        id:      `ord-${o._id}`,
        type:    isDelivered ? 'delivered' : 'order',
        title:   isDelivered ? `Order ${o.orderId} Delivered` : `New Order — ${o.orderId}`,
        desc:    `${o.farmerName} · ${o.items.length} item${o.items.length !== 1 ? 's' : ''} · ₹${o.total}`,
        time:    o.createdAt,
        link:    '/admin/orders',
      });
    });

  // Low-stock plants
  plants.filter((p) => p.stock > 0 && p.stock <= 10).forEach((p) => {
    notifications.push({
      id:   `ls-${p._id}`,
      type: 'lowstock',
      title:`Low Stock: ${p.name}`,
      desc: `Only ${p.stock} sapling${p.stock !== 1 ? 's' : ''} remaining`,
      time: p.updatedAt || p.createdAt,
      link: '/admin/plants',
    });
  });

  // Out-of-stock plants
  plants.filter((p) => p.stock === 0).forEach((p) => {
    notifications.push({
      id:   `oos-${p._id}`,
      type: 'lowstock',
      title:`Out of Stock: ${p.name}`,
      desc: 'No saplings available — restock needed',
      time: p.updatedAt || p.createdAt,
      link: '/admin/plants',
    });
  });

  // Sort by time descending
  notifications.sort((a, b) => new Date(b.time) - new Date(a.time));

  const markRead = (id) => {
    const updated = [...new Set([...readIds, id])];
    setReadIds(updated);
    localStorage.setItem('nf_read', JSON.stringify(updated));
  };
  const markAllRead = () => {
    const all = notifications.map((n) => n.id);
    setReadIds(all);
    localStorage.setItem('nf_read', JSON.stringify(all));
  };

  const unreadCount = notifications.filter((n) => !readIds.includes(n.id)).length;

  const filtered = filter === 'all'
    ? notifications
    : filter === 'unread'
    ? notifications.filter((n) => !readIds.includes(n.id))
    : notifications.filter((n) => n.type === filter || (filter === 'lowstock' && n.type === 'lowstock'));

  return (
    <div className="page-wrapper">
      <div className="container section">
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.3rem' }}>
              🔔 Notifications
              {unreadCount > 0 && (
                <span style={{
                  marginLeft: '0.75rem', background: '#e63946', color: '#fff',
                  borderRadius: '999px', fontSize: '0.8rem', fontWeight: 700,
                  padding: '0.2rem 0.65rem', verticalAlign: 'middle',
                }}>
                  {unreadCount} new
                </span>
              )}
            </h1>
            <p className="text-muted">Order alerts, stock warnings, and system updates</p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <button className="btn btn-ghost btn-sm" onClick={load}>↻ Refresh</button>
            {unreadCount > 0 && (
              <button className="btn btn-outline btn-sm" onClick={markAllRead}>✓ Mark All Read</button>
            )}
          </div>
        </div>

        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          {[
            { key: 'all',      label: `All (${notifications.length})` },
            { key: 'unread',   label: `Unread (${unreadCount})` },
            { key: 'order',    label: '📦 Orders' },
            { key: 'lowstock', label: '⚠️ Stock' },
            { key: 'delivered',label: '✅ Delivered' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              style={{
                padding: '0.4rem 0.9rem', borderRadius: '999px', fontSize: '0.82rem',
                fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
                background: filter === tab.key ? 'rgba(45,134,83,0.12)' : 'var(--bg-3)',
                border: `1.5px solid ${filter === tab.key ? 'var(--green-500)' : 'var(--border-2)'}`,
                color: filter === tab.key ? 'var(--green-800)' : 'var(--text-secondary)',
                fontFamily: 'var(--font-display)',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="loading-center"><div className="spinner" /></div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="emoji">🔔</div>
            <h3>No notifications</h3>
            <p>You're all caught up! Check back later.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {filtered.map((n) => {
              const col    = TYPE_COLOR[n.type] || TYPE_COLOR.system;
              const isRead = readIds.includes(n.id);
              return (
                <div
                  key={n.id}
                  onClick={() => markRead(n.id)}
                  style={{
                    display: 'flex', alignItems: 'flex-start', gap: '1rem',
                    padding: '1.1rem 1.25rem',
                    background: isRead ? '#fff' : col.bg,
                    border: `1px solid ${isRead ? 'var(--border)' : col.border}`,
                    borderRadius: 'var(--radius-lg)',
                    transition: 'all 0.2s', cursor: 'pointer',
                    position: 'relative',
                  }}
                  className="nf-item"
                >
                  {/* Unread dot */}
                  {!isRead && (
                    <span style={{
                      position: 'absolute', top: '1.1rem', right: '1.25rem',
                      width: 8, height: 8, borderRadius: '50%', background: col.dot,
                      flexShrink: 0,
                    }} />
                  )}

                  {/* Icon */}
                  <div style={{
                    width: 44, height: 44, borderRadius: 'var(--radius-md)',
                    background: col.bg, border: `1px solid ${col.border}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.3rem', flexShrink: 0,
                  }}>
                    {TYPE_ICON[n.type]}
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontWeight: isRead ? 600 : 700, fontSize: '0.92rem',
                      color: 'var(--text-primary)', marginBottom: '0.2rem',
                    }}>
                      {n.title}
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                      {n.desc}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {timeAgo(n.time)}
                      </span>
                      {n.link && (
                        <Link
                          to={n.link}
                          onClick={(e) => e.stopPropagation()}
                          style={{
                            fontSize: '0.75rem', color: 'var(--green-800)',
                            fontWeight: 700, textDecoration: 'underline',
                          }}
                        >
                          View →
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Stats summary */}
        {!loading && notifications.length > 0 && (
          <div style={{
            marginTop: '2rem', padding: '1.25rem', background: 'var(--bg-3)',
            borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)',
            display: 'flex', gap: '2rem', flexWrap: 'wrap',
          }}>
            {[
              { label: 'Total Alerts',   val: notifications.length,                                              icon: '🔔' },
              { label: 'New Orders',     val: notifications.filter((n) => n.type === 'order').length,            icon: '📦' },
              { label: 'Stock Warnings', val: notifications.filter((n) => n.type === 'lowstock').length,         icon: '⚠️' },
              { label: 'Delivered',      val: notifications.filter((n) => n.type === 'delivered').length,        icon: '✅' },
            ].map((s) => (
              <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span style={{ fontSize: '1.2rem' }}>{s.icon}</span>
                <div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>{s.val}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .nf-item:hover { transform: translateY(-1px); box-shadow: var(--shadow-sm); }
      `}</style>
    </div>
  );
}
