import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import useAuthStore from '../../store/authStore';

const LogoIcon = () => (
  <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
    <path d="M16 4 L28 10 L28 22 L16 28 L4 22 L4 10 Z" stroke="url(#lg1)" strokeWidth="1.5" fill="none"/>
    <path d="M16 4 L16 16 M16 16 L28 10 M16 16 L4 10 M16 16 L16 28 M16 16 L28 22 M16 16 L4 22" stroke="url(#lg2)" strokeWidth="1.2" opacity="0.7"/>
    <circle cx="16" cy="16" r="3" fill="url(#lg1)"/>
    <defs>
      <linearGradient id="lg1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#60a5fa"/><stop offset="100%" stopColor="#22d3ee"/></linearGradient>
      <linearGradient id="lg2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#3b82f6"/><stop offset="100%" stopColor="#06b6d4"/></linearGradient>
    </defs>
  </svg>
);

export default function LoginPage() {
  const { login, loading } = useAuthStore();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await login(form.email, form.password);
      toast.success('Welcome back!');
      if (user.role === 'admin')           navigate('/admin/dashboard');
      else if (user.role === 'technician') navigate('/technician/dashboard');
      else                                 navigate('/dashboard');
    } catch (err) { toast.error(err.message); }
  };

  return (
    <div style={{ minHeight: '100vh', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', overflow: 'hidden' }}>
      <div className="stars-bg" />
      <div style={{ position: 'absolute', top: '35%', left: '50%', transform: 'translate(-50%,-50%)', width: '500px', height: '350px', background: 'radial-gradient(ellipse, rgba(37,99,235,0.1) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div className="logo-icon" style={{ width: '60px', height: '60px', borderRadius: '16px', margin: '0 auto 1rem' }}>
            <LogoIcon />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#fff', letterSpacing: '0.1em', marginBottom: '0.2rem' }}>KIRATECH</h1>
          <p style={{ fontSize: '0.78rem', color: '#475569', letterSpacing: '0.04em' }}>IT Support Management System</p>
        </div>

        <div className="glass-card" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f1f5f9', marginBottom: '0.35rem' }}>Welcome back</h2>
          <p style={{ fontSize: '0.8rem', color: '#475569', marginBottom: '1.75rem' }}>Sign in to your account to continue.</p>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1.1rem' }}>
              <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: '#64748b', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Email Address</label>
              <input type="email" required className="input-field" placeholder="you@example.com"
                value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
            </div>
            <div style={{ marginBottom: '0.75rem' }}>
              <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: '#64748b', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Password</label>
              <input type="password" required className="input-field" placeholder="••••••••"
                value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
            </div>
            <div style={{ textAlign: 'right', marginBottom: '1.5rem' }}>
              <Link to="/forgot-password" style={{ fontSize: '0.8rem', color: '#60a5fa', textDecoration: 'none' }}>Forgot password?</Link>
            </div>
            <button type="submit" disabled={loading} className="btn-teal">
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.82rem', color: '#475569' }}>
            No account?{' '}
            <Link to="/register" style={{ color: '#60a5fa', fontWeight: 600, textDecoration: 'none' }}>Create one</Link>
          </p>
        </div>

        <p style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.75rem', color: '#1e293b' }}>
          <Link to="/admin/login" style={{ color: '#334155', textDecoration: 'none' }}>Admin login →</Link>
        </p>
      </div>
    </div>
  );
}
