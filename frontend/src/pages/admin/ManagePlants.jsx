import { useEffect, useState, useRef } from 'react';
import api from '../../api';
import toast from 'react-hot-toast';

const TYPES = ['Seedling', 'Grafted', 'Hybrid', 'Open Pollinated', 'Other'];
const EMPTY_FORM = { name: '', type: 'Seedling', description: '', growingTips: '', price: '', stock: '', hidden: false };

export default function ManagePlants() {
  const [plants, setPlants]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal]     = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm]       = useState(EMPTY_FORM);
  const [imgFile, setImgFile] = useState(null);
  const [imgPreview, setImgPreview] = useState('');
  const [saving, setSaving]   = useState(false);
  const fileRef = useRef();

  const loadPlants = () => {
    api.get('/plants/admin/all')
      .then((r) => setPlants(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };
  useEffect(loadPlants, []);

  const openAdd = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setImgFile(null);
    setImgPreview('');
    setModal(true);
  };

  const openEdit = (p) => {
    setEditing(p);
    setForm({ name: p.name, type: p.type, description: p.description || '', growingTips: p.growingTips || '', price: p.price, stock: p.stock, hidden: p.hidden });
    setImgPreview(p.imageUrl || '');
    setImgFile(null);
    setModal(true);
  };

  const handleImgChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImgFile(file);
    setImgPreview(URL.createObjectURL(file));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (imgFile) fd.append('image', imgFile);

      if (editing) {
        await api.put(`/plants/${editing._id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Plant updated!');
      } else {
        await api.post('/plants', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Plant added!');
      }
      setModal(false);
      loadPlants();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/plants/${id}`);
      toast.success('Plant deleted');
      loadPlants();
    } catch { toast.error('Delete failed'); }
  };

  const toggleHidden = async (p) => {
    const fd = new FormData();
    fd.append('hidden', (!p.hidden).toString());
    await api.put(`/plants/${p._id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
    loadPlants();
  };

  return (
    <div className="page-wrapper">
      <div className="container section">
        <div className="flex items-center justify-between" style={{ marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.3rem' }}>🌱 Manage Plants</h1>
            <p className="text-muted">{plants.length} varieties in catalog</p>
          </div>
          <button className="btn btn-primary" onClick={openAdd}>+ Add Plant</button>
        </div>

        {loading ? (
          <div className="loading-center"><div className="spinner" /></div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Plant</th>
                  <th>Type</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {plants.map((p) => (
                  <tr key={p._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <img src={p.imageUrl || 'https://images.unsplash.com/photo-1588714477688-cf28a50e94f7?w=60&q=60'}
                          alt={p.name} style={{ width: 44, height: 44, borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
                          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1588714477688-cf28a50e94f7?w=60&q=60'; }} />
                        <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{p.name}</span>
                      </div>
                    </td>
                    <td><span style={{ background: 'rgba(64,145,108,0.12)', color: 'var(--green-300)', padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: '0.78rem', fontWeight: 700 }}>{p.type}</span></td>
                    <td style={{ fontWeight: 700, color: 'var(--green-300)' }}>₹{p.price}</td>
                    <td>
                      <span style={{ color: p.stock === 0 ? 'var(--red-500)' : p.stock <= 10 ? '#f59e0b' : 'var(--text-secondary)', fontWeight: 600 }}>
                        {p.stock === 0 ? '❌ Out' : p.stock <= 10 ? `⚠️ ${p.stock}` : p.stock}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => toggleHidden(p)}
                        title={p.hidden ? 'Click to make VISIBLE to farmers' : 'Click to HIDE from farmers'}
                        style={{
                          padding: '0.3rem 0.8rem', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer',
                          background: p.hidden ? 'rgba(220,38,38,0.18)' : 'rgba(16,185,129,0.18)',
                          color: p.hidden ? '#f87171' : '#34d399',
                          border: `2px solid ${p.hidden ? 'rgba(220,38,38,0.5)' : 'rgba(16,185,129,0.4)'}`,
                          transition: 'all 0.2s',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {p.hidden ? '🔴 Hidden (click → show)' : '🟢 Visible to farmers'}
                      </button>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="btn btn-ghost btn-sm" onClick={() => openEdit(p)}>✏️ Edit</button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p._id, p.name)}>🗑</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {modal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setModal(false)}>
          <div className="modal">
            <div className="modal-header">
              <span className="modal-title">{editing ? '✏️ Edit Plant' : '🌱 Add New Plant'}</span>
              <button className="modal-close" onClick={() => setModal(false)}>✕</button>
            </div>

            <form onSubmit={handleSave}>
              {/* Image upload */}
              <div className="img-upload-area" style={{ marginBottom: '1.25rem' }}>
                {imgPreview ? (
                  <img src={imgPreview} alt="preview" style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 'var(--radius-md)' }} />
                ) : (
                  <>
                    <div style={{ fontSize: '2rem', marginBottom: '0.4rem' }}>📷</div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                      Click to upload plant photo <span style={{ color: 'var(--green-500)' }}>(optional)</span>
                    </p>
                  </>
                )}
                <input type="file" accept="image/*" ref={fileRef} onChange={handleImgChange} />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Plant Name *</label>
                  <input required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. Jwala Chilli" />
                </div>
                <div className="form-group">
                  <label>Type *</label>
                  <select value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}>
                    {TYPES.map((t) => <option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea rows={2} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="Short description of the plant variety…" />
              </div>

              <div className="form-group">
                <label>Growing Tips</label>
                <textarea rows={2} value={form.growingTips} onChange={(e) => setForm((f) => ({ ...f, growingTips: e.target.value }))} placeholder="Watering, sunlight, spacing tips…" />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Price (₹) *</label>
                  <input type="number" required min={0} value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} placeholder="e.g. 25" />
                </div>
                <div className="form-group">
                  <label>Stock Count *</label>
                  <input type="number" required min={0} value={form.stock} onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))} placeholder="e.g. 200" />
                </div>
              </div>

              <div style={{ background: form.hidden ? 'rgba(220,38,38,0.08)' : 'rgba(16,185,129,0.08)', border: `1px solid ${form.hidden ? 'rgba(220,38,38,0.3)' : 'rgba(16,185,129,0.25)'}`, borderRadius: 'var(--radius-md)', padding: '0.75rem 1rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <input type="checkbox" id="hidden" checked={form.hidden} onChange={(e) => setForm((f) => ({ ...f, hidden: e.target.checked }))} style={{ width: 'auto', accentColor: form.hidden ? '#ef4444' : '#10b981' }} />
                  <label htmlFor="hidden" style={{ margin: 0, cursor: 'pointer', fontWeight: 700, color: form.hidden ? '#f87171' : '#34d399' }}>
                    {form.hidden ? '🔴 Hidden — farmers CANNOT see this plant' : '🟢 Visible — farmers CAN see and order this plant'}
                  </label>
                </div>
                {form.hidden && (
                  <p style={{ margin: '0.4rem 0 0 1.8rem', fontSize: '0.8rem', color: '#f87171' }}>
                    ⚠️ Uncheck this to make the plant appear on the Browse page for farmers.
                  </p>
                )}
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button type="button" className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 2 }} disabled={saving}>
                  {saving ? 'Saving…' : editing ? 'Save Changes' : 'Add Plant'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
