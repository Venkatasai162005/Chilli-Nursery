import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useLang } from '../context/LanguageContext';
import api from '../api';
import toast from 'react-hot-toast';

const PLACEHOLDER = 'https://images.unsplash.com/photo-1588714477688-cf28a50e94f7?w=200&q=60';

export default function Cart() {
  const { items, updateQty, removeItem, clearCart, totalItems, totalPrice } = useCart();
  const { t } = useLang();
  const navigate = useNavigate();
  const [form, setForm] = useState({ farmerName: '', phone: '', address: '', deliveryType: 'pickup', notes: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (items.length === 0) { toast.error(t('cartEmpty')); return; }
    if (!form.farmerName.trim() || !form.phone.trim() || !form.address.trim()) {
      toast.error('Please fill all required fields'); return;
    }
    setLoading(true);
    try {
      const payload = {
        ...form,
        items: items.map((i) => ({
          plantId: i._id,
          name:    i.name,
          price:   i.price ?? i.pricePerSapling ?? 0,
          qty:     i.qty,
        })),
      };
      const { data } = await api.post('/orders', payload);
      clearCart();
      navigate('/order-confirmation', { state: { order: data } });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order. Try again.');
    } finally { setLoading(false); }
  };

  if (items.length === 0) {
    return (
      <div className="page-wrapper">
        <div className="container section">
          <div className="empty-state" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div className="emoji">🛒</div>
            <h3>{t('cartEmpty')}</h3>
            <p>{t('cartEmptySub')}</p>
            <Link to="/browse" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>{t('browsePlants')}</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="container section">
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>{t('yourCart')}</h1>
        <p className="text-muted" style={{ marginBottom: '2rem' }}>
          {totalItems} {totalItems !== 1 ? t('items') : t('item')}
        </p>

        <div className="cart-layout">
          {/* Left — items */}
          <div>
            <div className="card-elevated" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
              {items.map((item) => (
                <div key={item._id} className="cart-item animate-fade-in">
                  <img src={item.imageUrl || PLACEHOLDER} alt={item.name} className="cart-item-img"
                    onError={(e) => { e.target.src = PLACEHOLDER; }} />
                  <div className="cart-item-info">
                    <h4>{item.name}</h4>
                    <p className="text-muted text-sm">
                      {t({ Seedling:'typeSeedling', Grafted:'typeGrafted', Hybrid:'typeHybrid', 'Open Pollinated':'typeOpenPollinated', Other:'typeOther' }[item.type] || 'typeOther')}
                    </p>
                    <p style={{ color: 'var(--green-300)', fontWeight: 700 }}>
                      ₹{item.price} × {item.qty} = ₹{item.price * item.qty}
                    </p>
                  </div>
                  <div className="cart-item-controls">
                    <div className="qty-box">
                      <label className="qty-box-label">{t('noOfPlants')}</label>
                      <input
                        type="number"
                        className="qty-box-input"
                        value={item.qty}
                        min={1}
                        onChange={(e) => {
                          const val = parseInt(e.target.value, 10);
                          if (!isNaN(val) && val >= 1) {
                            updateQty(item._id, val);
                          }
                        }}
                        placeholder="Enter qty"
                      />
                    </div>
                    <button className="cart-remove-btn" onClick={() => removeItem(item._id)} title="Remove">✕</button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order form */}
            <div className="card-elevated" style={{ padding: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem' }}>{t('yourDetails')}</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>{t('yourName')}</label>
                    <input name="farmerName" value={form.farmerName} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label>{t('phone')}</label>
                    <input name="phone" value={form.phone} onChange={handleChange} type="tel" required />
                  </div>
                </div>
                <div className="form-group">
                  <label>{t('address')}</label>
                  <input name="address" value={form.address} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>{t('deliveryOption')}</label>
                  <div className="delivery-options">
                    {[{ val: 'pickup', labelK: 'pickup' }, { val: 'delivery', labelK: 'delivery' }].map((o) => (
                      <label key={o.val} className={`delivery-option ${form.deliveryType === o.val ? 'selected' : ''}`}>
                        <input type="radio" name="deliveryType" value={o.val} checked={form.deliveryType === o.val} onChange={handleChange} style={{ display: 'none' }} />
                        {t(o.labelK)}
                      </label>
                    ))}
                  </div>
                </div>
                <div className="form-group">
                  <label>{t('notes')}</label>
                  <textarea name="notes" placeholder={t('notesPlaceholder')} rows={2} value={form.notes} onChange={handleChange} />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%', fontSize: '1.05rem', padding: '0.9rem' }} disabled={loading}>
                  {loading ? t('placingOrder') : `${t('placeOrder')}${totalPrice.toFixed(0)}`}
                </button>
              </form>
            </div>
          </div>

          {/* Right — summary */}
          <div>
            <div className="card-elevated" style={{ padding: '1.5rem', position: 'sticky', top: '80px' }}>
              <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>{t('orderSummary')}</h3>
              {items.map((i) => (
                <div key={i._id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem', fontSize: '0.9rem' }}>
                  <span className="text-secondary">{i.name} × {i.qty}</span>
                  <span style={{ fontWeight: 600 }}>₹{i.price * i.qty}</span>
                </div>
              ))}
              <div className="divider" />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.1rem' }}>
                <span>{t('total')}</span>
                <span style={{ color: 'var(--green-300)' }}>₹{totalPrice.toFixed(0)}</span>
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.75rem' }}>
                {form.deliveryType === 'pickup' ? t('pickupNote') : t('deliveryNote')}
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .cart-layout { display:grid; grid-template-columns:1fr 320px; gap:2rem; align-items:start; }
        @media(max-width:900px){ .cart-layout{ grid-template-columns:1fr; } }
        .cart-item { display:flex; align-items:center; gap:1rem; padding:1rem 0; border-bottom:1px solid var(--border); }
        .cart-item:last-child { border-bottom:none; }
        .cart-item-img { width:70px; height:70px; border-radius:var(--radius-md); object-fit:cover; flex-shrink:0; }
        .cart-item-info { flex:1; }
        .cart-item-info h4 { font-weight:700; margin-bottom:.2rem; }
        .cart-item-controls { display:flex; flex-direction:column; align-items:flex-end; gap:.5rem; }
        .cart-remove-btn { background:none; border:1px solid var(--border-2); border-radius:var(--radius-sm);
          color:var(--text-muted); padding:.2rem .5rem; font-size:.8rem; cursor:pointer; transition:all .2s; }
        .cart-remove-btn:hover { background:var(--red-600); color:white; border-color:var(--red-600); }
        .delivery-options { display:flex; gap:.75rem; flex-wrap:wrap; }
        .delivery-option { flex:1; min-width:150px; padding:.75rem 1rem; border:1px solid var(--border-2);
          border-radius:var(--radius-md); cursor:pointer; font-weight:600; font-family:var(--font-display);
          font-size:.9rem; text-align:center; transition:all .2s; color:var(--text-secondary); }
        .delivery-option.selected { border-color:var(--green-400); background:rgba(64,145,108,.12); color:var(--green-200); }
        .qty-box { display:flex; flex-direction:column; gap:.3rem; }
        .qty-box-label { font-size:.72rem; font-weight:600; color:var(--text-muted); letter-spacing:.03em; }
        .qty-box-input { width:140px; padding:.45rem .75rem; border:1px solid var(--border-2);
          border-radius:var(--radius-sm); background:var(--bg-3); color:var(--text-primary);
          font-size:.95rem; font-weight:600; outline:none; transition:border-color .2s, box-shadow .2s; }
        .qty-box-input:focus { border-color:var(--green-400); box-shadow:0 0 0 2px rgba(64,145,108,.18); }
        .qty-box-input::-webkit-inner-spin-button { opacity:1; }
        .qty-box-input[type=number] { -moz-appearance:textfield; }
      `}</style>
    </div>
  );
}
