import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function AdminLogin() {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const [form, setForm]     = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/admin');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials');
    } finally { setLoading(false); }
  };

  return (
    <div className="page-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <div className="login-card animate-scale-in">
        {/* Header */}
        <div className="login-header">
          <div style={{ marginBottom: '1rem' }}>
            <img src="/logo.png" alt="Sri Devi Chilli Nursery" style={{ height: 90, width: 'auto', objectFit: 'contain', filter: 'drop-shadow(0 4px 16px rgba(0,0,0,0.5))' }} />
          </div>
          <h1>Admin Login</h1>
          <p>Sri Devi Chilli Nursery — Dashboard</p>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '2rem' }}>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email" placeholder="bava@chilli.com"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              required autoFocus
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPass ? 'text' : 'password'}
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                required style={{ paddingRight: '3rem' }}
              />
              <button type="button"
                onClick={() => setShowPass((s) => !s)}
                style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1rem' }}>
                {showPass ? '🙈' : '👁️'}
              </button>
            </div>
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.9rem', fontSize: '1rem' }} disabled={loading}>
            {loading ? 'Logging in…' : '🔐 Login to Dashboard'}
          </button>
        </form>

        <div style={{ textAlign: 'center', padding: '1rem 2rem 2rem', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
          This area is restricted to nursery administrators only.
        </div>
      </div>

      <style>{`
        .login-card {
          width: 100%; max-width: 420px;
          background: var(--bg-2); border: 1px solid var(--border-2);
          border-radius: var(--radius-xl); overflow: hidden;
          box-shadow: var(--shadow-lg);
        }
        .login-header {
          background: linear-gradient(135deg, var(--green-900), var(--green-800));
          padding: 2.5rem 2rem; text-align: center;
          border-bottom: 1px solid var(--green-700);
        }
        .login-logo {
          font-size: 3rem; margin-bottom: 0.75rem;
          filter: drop-shadow(0 0 12px rgba(64,145,108,0.5));
        }
        .login-header h1 { font-size: 1.5rem; font-weight: 800; color: white; margin-bottom: 0.3rem; }
        .login-header p { color: var(--green-200); font-size: 0.88rem; }
      `}</style>
    </div>
  );
}
