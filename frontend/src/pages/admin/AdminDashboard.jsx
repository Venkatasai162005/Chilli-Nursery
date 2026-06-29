import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api';

export default function AdminDashboard() {
  const [stats, setStats]   = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lowStock, setLowStock] = useState([]);

  useEffect(() => {
    Promise.all([
      api.get('/orders/admin/stats'),
      api.get('/orders?status=Pending'),
      api.get('/plants/admin/all'),
    ]).then(([s, o, p]) => {
      setStats(s.data);
      setOrders(o.data.slice(0, 5));
      setLowStock(p.data.filter((pl) => pl.stock > 0 && pl.stock <= 10).slice(0, 5));
    }).catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-center"><div className="spinner" /></div>;

  const statCards = [
    { label: "Today's Orders", value: stats?.todayOrders ?? 0,  icon: '📦', color: '' },
    { label: 'Pending',        value: stats?.pendingOrders ?? 0, icon: '⏳', color: 'orange' },
    { label: 'Total Orders',   value: stats?.totalOrders ?? 0,   icon: '📋', color: 'blue' },
    { label: 'Total Revenue',  value: `₹${(stats?.totalRevenue ?? 0).toLocaleString('en-IN')}`, icon: '💰', color: '' },
  ];

  return (
    <div className="page-wrapper">
      <div className="container section">
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.3rem' }}>📊 Dashboard</h1>
          <p className="text-muted">Welcome back, Bava! Here's what's happening today.</p>
        </div>

        {/* Stat cards */}
        <div className="grid-4" style={{ marginBottom: '2.5rem' }}>
          {statCards.map((c) => (
            <div key={c.label} className={`stat-card ${c.color}`}>
              <span className="stat-label">{c.label}</span>
              <span className="stat-value">{c.value}</span>
              <span className="stat-icon">{c.icon}</span>
            </div>
          ))}
        </div>

        <div className="dash-grid">
          {/* Recent pending orders */}
          <div className="card-elevated" style={{ padding: '1.5rem' }}>
            <div className="flex items-center justify-between" style={{ marginBottom: '1.25rem' }}>
              <h2 style={{ fontWeight: 700, fontSize: '1.05rem' }}>⏳ Pending Orders</h2>
              <Link to="/admin/orders" className="btn btn-ghost btn-sm">View All →</Link>
            </div>
            {orders.length === 0 ? (
              <div className="empty-state" style={{ padding: '1.5rem' }}>
                <div className="emoji" style={{ fontSize: '2rem' }}>✅</div>
                <p style={{ color: 'var(--text-muted)' }}>No pending orders</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {orders.map((o) => (
                  <div key={o._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'var(--bg-3)', borderRadius: 'var(--radius-md)' }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{o.orderId}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{o.farmerName} · {o.phone}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 700, color: 'var(--green-300)', fontSize: '0.9rem' }}>₹{o.total}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(o.createdAt).toLocaleDateString('en-IN')}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Low stock alerts */}
            <div className="card-elevated" style={{ padding: '1.5rem' }}>
              <div className="flex items-center justify-between" style={{ marginBottom: '1.25rem' }}>
                <h2 style={{ fontWeight: 700, fontSize: '1.05rem' }}>⚠️ Low Stock Alerts</h2>
                <Link to="/admin/plants" className="btn btn-ghost btn-sm">Manage →</Link>
              </div>
              {lowStock.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>All plants have healthy stock levels ✅</p>
              ) : (
                lowStock.map((p) => (
                  <div key={p._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem 0', borderBottom: '1px solid var(--border)' }}>
                    <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>{p.name}</span>
                    <span style={{ background: 'rgba(245,158,11,0.15)', color: '#f59e0b', padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700 }}>
                      {p.stock} left
                    </span>
                  </div>
                ))
              )}
            </div>

            {/* Top plants */}
            {stats?.topPlants?.length > 0 && (
              <div className="card-elevated" style={{ padding: '1.5rem' }}>
                <h2 style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: '1.25rem' }}>🏆 Top Ordered Plants</h2>
                {stats.topPlants.map((p, i) => (
                  <div key={p.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem 0', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, minWidth: 16 }}>#{i + 1}</span>
                      <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>{p.name}</span>
                    </div>
                    <span style={{ fontSize: '0.88rem', color: 'var(--green-300)', fontWeight: 700 }}>{p.qty} plants</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick actions */}
        <div className="grid-4" style={{ marginTop: '2rem' }}>
          {[
            { to: '/admin/plants',        icon: '🌱', label: 'Manage Plants',   desc: 'Add, edit, or hide plant listings' },
            { to: '/admin/orders',         icon: '📦', label: 'View Orders',     desc: 'See all orders and update status' },
            { to: '/admin/reports',        icon: '📊', label: 'Reports',         desc: 'Sales totals and export data' },
            { to: '/admin/notifications',  icon: '🔔', label: 'Notifications',   desc: 'Order alerts and stock warnings' },
          ].map((a) => (
            <Link key={a.to} to={a.to} className="dash-action-card">
              <div style={{ fontSize: '2rem', marginBottom: '0.6rem' }}>{a.icon}</div>
              <h3>{a.label}</h3>
              <p>{a.desc}</p>
            </Link>
          ))}
        </div>
      </div>

      <style>{`
        .dash-grid { display: grid; grid-template-columns: 1.2fr 1fr; gap: 1.5rem; }
        @media(max-width:900px){ .dash-grid{ grid-template-columns: 1fr; } }
        .dash-action-card {
          display: flex; flex-direction: column;
          background: var(--bg-2); border: 1px solid var(--border);
          border-radius: var(--radius-lg); padding: 1.5rem;
          text-decoration: none; color: inherit;
          transition: border-color 0.2s, transform 0.2s, box-shadow 0.2s;
        }
        .dash-action-card:hover { border-color: var(--green-500); transform: translateY(-3px); box-shadow: var(--shadow-glow); }
        .dash-action-card h3 { font-size: 1rem; font-weight: 700; margin-bottom: 0.3rem; }
        .dash-action-card p { font-size: 0.83rem; color: var(--text-muted); }
      `}</style>
    </div>
  );
}
