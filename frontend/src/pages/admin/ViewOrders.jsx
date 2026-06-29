import { useEffect, useState } from 'react';
import api from '../../api';
import toast from 'react-hot-toast';

const STATUSES = ['Pending', 'Confirmed', 'Ready', 'Delivered'];
const STATUS_NEXT = { Pending: 'Confirmed', Confirmed: 'Ready', Ready: 'Delivered' };

const BADGE = { Pending: 'badge-pending', Confirmed: 'badge-confirmed', Ready: 'badge-ready', Delivered: 'badge-delivered' };

export default function ViewOrders() {
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');
  const [statusF, setStatusF] = useState('');
  const [selected, setSelected] = useState(null);
  const [updating, setUpdating] = useState(null);

  const loadOrders = () => {
    const params = {};
    if (search)  params.search = search;
    if (statusF) params.status = statusF;
    api.get('/orders', { params })
      .then((r) => setOrders(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { const t = setTimeout(loadOrders, 350); return () => clearTimeout(t); }, [search, statusF]);

  const updateStatus = async (id, status) => {
    setUpdating(id);
    try {
      const { data } = await api.put(`/orders/${id}/status`, { status });
      toast.success(`Status → ${status}`);
      setOrders((prev) => prev.map((o) => (o._id === id ? data : o)));
      if (selected?._id === id) setSelected(data);
    } catch { toast.error('Update failed'); }
    finally { setUpdating(null); }
  };

  return (
    <div className="page-wrapper">
      <div className="container section">
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.3rem' }}>📦 All Orders</h1>
          <p className="text-muted">{orders.length} order{orders.length !== 1 ? 's' : ''} found</p>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <input type="text" placeholder="🔍 Search by name, phone or order ID…" value={search}
            onChange={(e) => setSearch(e.target.value)} style={{ flex: 1, minWidth: 220 }} />
          <select value={statusF} onChange={(e) => setStatusF(e.target.value)} style={{ minWidth: 160 }}>
            <option value="">All Statuses</option>
            {STATUSES.map((s) => <option key={s}>{s}</option>)}
          </select>
          {(search || statusF) && (
            <button className="btn btn-ghost btn-sm" onClick={() => { setSearch(''); setStatusF(''); }}>✕ Clear</button>
          )}
        </div>

        {loading ? (
          <div className="loading-center"><div className="spinner" /></div>
        ) : orders.length === 0 ? (
          <div className="empty-state">
            <div className="emoji">📭</div>
            <h3>No orders found</h3>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Farmer</th>
                  <th>Phone</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o._id} style={{ cursor: 'pointer' }} onClick={() => setSelected(o)}>
                    <td style={{ fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>{o.orderId}</td>
                    <td style={{ fontWeight: 600 }}>{o.farmerName}</td>
                    <td>{o.phone}</td>
                    <td>{o.items.length} item{o.items.length !== 1 ? 's' : ''}</td>
                    <td style={{ fontWeight: 700, color: 'var(--green-300)' }}>₹{o.total}</td>
                    <td>{new Date(o.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <span className={`badge ${BADGE[o.status]}`}>{o.status}</span>
                    </td>
                    <td onClick={(e) => e.stopPropagation()}>
                      {STATUS_NEXT[o.status] && (
                        <button
                          className="btn btn-outline btn-sm"
                          disabled={updating === o._id}
                          onClick={() => updateStatus(o._id, STATUS_NEXT[o.status])}
                        >
                          {updating === o._id ? '…' : `→ ${STATUS_NEXT[o.status]}`}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order detail modal */}
      {selected && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setSelected(null)}>
          <div className="modal">
            <div className="modal-header">
              <span className="modal-title">Order — {selected.orderId}</span>
              <button className="modal-close" onClick={() => setSelected(null)}>✕</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.25rem', fontSize: '0.9rem' }}>
              {[['Farmer', selected.farmerName],['Phone', selected.phone],['Address', selected.address],['Delivery', selected.deliveryType]].map(([k,v]) => (
                <div key={k} style={{ display: 'flex', gap: '1rem' }}>
                  <span style={{ color: 'var(--text-muted)', minWidth: 70 }}>{k}</span>
                  <strong style={{ textTransform: 'capitalize' }}>{v}</strong>
                </div>
              ))}
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>Items</div>
              {selected.items.map((i, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border)', fontSize: '0.9rem' }}>
                  <span>{i.plantName}</span>
                  <span>{i.qty} × ₹{i.priceEach}</span>
                  <strong style={{ color: 'var(--green-300)' }}>₹{i.qty * i.priceEach}</strong>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.05rem', marginTop: '0.75rem' }}>
                <span>Total</span>
                <span style={{ color: 'var(--green-300)' }}>₹{selected.total}</span>
              </div>
            </div>

            {selected.notes && (
              <div style={{ background: 'var(--bg-3)', borderRadius: 'var(--radius-md)', padding: '0.75rem', marginBottom: '1.25rem', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                💬 {selected.notes}
              </div>
            )}

            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.6rem' }}>Update Status</div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {STATUSES.map((s) => (
                  <button key={s}
                    className={`btn btn-sm ${selected.status === s ? 'btn-primary' : 'btn-ghost'}`}
                    disabled={updating === selected._id}
                    onClick={() => updateStatus(selected._id, s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
