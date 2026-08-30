import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import useAuthStore from '../../store/authStore';

export default function AdminLogin() {
  const { login, loading } = useAuthStore();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await login(form.email, form.password);
      if (user.role !== 'admin') {
        toast.error('Access denied. Admin accounts only.');
        useAuthStore.getState().logout();
        return;
      }
      toast.success('Welcome back, Admin!');
      navigate('/admin/dashboard');
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div style={{ minHeight: '100vh', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
      {/* Star background */}
      <div className="stars-bg" />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '420px' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', marginBottom: '1rem' }} className="logo-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="#fff" strokeWidth="1.5" strokeLinejoin="round"/>
              <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="#fff" strokeWidth="1.5" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', letterSpacing: '0.1em', marginBottom: '0.25rem' }}>KIRATECH</h1>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', color: '#34d399', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/></svg>
            Admin Portal
          </div>
        </div>

        {/* Card */}
        <div className="glass-card" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f1f5f9', marginBottom: '0.4rem' }}>Administrator Sign In</h2>
          <p style={{ fontSize: '0.83rem', color: '#64748b', marginBottom: '1.75rem' }}>Restricted access — authorised personnel only.</p>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                Admin Email
              </label>
              <input
                type="email" required autoComplete="email"
                value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                className="input-field" placeholder="admin@kiratech.com"
              />
            </div>

            <div style={{ marginBottom: '1.75rem' }}>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                Password
              </label>
              <input
                type="password" required autoComplete="current-password"
                value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                className="input-field" placeholder="••••••••••••"
              />
            </div>

            <button type="submit" disabled={loading} className="btn-teal" style={{ fontSize: '0.95rem' }}>
              {loading ? (
                <><span style={{ display: 'inline-block', width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} /> Signing in…</>
              ) : (
                <><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/></svg> Sign In to Admin Portal</>
              )}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.82rem', color: '#475569' }}>
          Not an admin?{' '}
          <Link to="/login" style={{ color: '#94a3b8', textDecoration: 'none' }} onMouseOver={e => e.target.style.color='#cbd5e1'} onMouseOut={e => e.target.style.color='#94a3b8'}>
            Customer Login
          </Link>
        </p>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
