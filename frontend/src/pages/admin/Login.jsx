import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import useAuthStore from '../../store/authStore';

const LogoIcon = () => (
  <svg width="30" height="30" viewBox="0 0 32 32" fill="none">
    <path d="M16 4 L28 10 L28 22 L16 28 L4 22 L4 10 Z" stroke="url(#lg1)" strokeWidth="1.5" fill="none"/>
    <path d="M16 4 L16 16 M16 16 L28 10 M16 16 L4 10 M16 16 L16 28 M16 16 L28 22 M16 16 L4 22" stroke="url(#lg2)" strokeWidth="1.2" opacity="0.7"/>
    <circle cx="16" cy="16" r="3" fill="url(#lg1)"/>
    <defs>
      <linearGradient id="lg1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#60a5fa"/>
        <stop offset="100%" stopColor="#22d3ee"/>
      </linearGradient>
      <linearGradient id="lg2" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3b82f6"/>
        <stop offset="100%" stopColor="#06b6d4"/>
      </linearGradient>
    </defs>
  </svg>
);

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
    <div style={{ minHeight: '100vh', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', overflow: 'hidden' }}>
      <div className="stars-bg" />

      {/* Radial glow behind card */}
      <div style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%,-50%)', width: '600px', height: '400px', background: 'radial-gradient(ellipse, rgba(37,99,235,0.12) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '420px' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div className="logo-icon" style={{ width: '68px', height: '68px', borderRadius: '18px', margin: '0 auto 1.1rem' }}>
            <LogoIcon />
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#fff', letterSpacing: '0.12em', marginBottom: '0.35rem' }}>KIRATECH</h1>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#60a5fa" strokeWidth="2" strokeLinejoin="round"/></svg>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', background: 'linear-gradient(90deg, #60a5fa, #22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Admin Portal</span>
          </div>
        </div>

        {/* Card */}
        <div className="glass-card" style={{ padding: '2rem 2.25rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f1f5f9', marginBottom: '0.4rem' }}>Administrator Sign In</h2>
          <p style={{ fontSize: '0.82rem', color: '#475569', marginBottom: '2rem' }}>Restricted access — authorised personnel only.</p>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: '#64748b', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Admin Email</label>
              <input type="email" required autoComplete="email" className="input-field" placeholder="admin@kiratech.com"
                value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: '#64748b', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Password</label>
              <input type="password" required autoComplete="current-password" className="input-field" placeholder="••••••••••••"
                value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
            </div>

            <button type="submit" disabled={loading} className="btn-teal">
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ display: 'inline-block', width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin .7s linear infinite' }} />
                  Signing in…
                </span>
              ) : (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2"/></svg>
                  Sign In to Admin Portal
                </span>
              )}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.8rem', color: '#334155' }}>
          Not an admin?{' '}
          <Link to="/login" style={{ color: '#60a5fa', textDecoration: 'none' }}>Customer Login</Link>
        </p>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
