import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import useAuthStore from '../../store/authStore';

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
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div style={{ minHeight: '100vh', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
      <div className="stars-bg" />
      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '420px' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '60px', height: '60px', marginBottom: '1rem' }} className="logo-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="#fff" strokeWidth="1.5" strokeLinejoin="round"/>
              <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="#fff" strokeWidth="1.5" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', letterSpacing: '0.08em', marginBottom: '0.2rem' }}>KIRATECH</h1>
          <p style={{ fontSize: '0.8rem', color: '#64748b' }}>IT Support Management System</p>
        </div>

        <div className="glass-card" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f1f5f9', marginBottom: '0.35rem' }}>Welcome back</h2>
          <p style={{ fontSize: '0.83rem', color: '#64748b', marginBottom: '1.75rem' }}>Sign in to your account to continue.</p>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1.1rem' }}>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Email Address</label>
              <input type="email" required className="input-field" placeholder="you@example.com"
                value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
            </div>
            <div style={{ marginBottom: '0.75rem' }}>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Password</label>
              <input type="password" required className="input-field" placeholder="••••••••"
                value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
            </div>
            <div style={{ textAlign: 'right', marginBottom: '1.5rem' }}>
              <Link to="/forgot-password" style={{ fontSize: '0.82rem', color: '#34d399', textDecoration: 'none' }}>Forgot password?</Link>
            </div>
            <button type="submit" disabled={loading} className="btn-teal">
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.83rem', color: '#475569' }}>
            No account?{' '}
            <Link to="/register" style={{ color: '#34d399', textDecoration: 'none', fontWeight: 600 }}>Create one</Link>
          </p>
        </div>

        <p style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.78rem', color: '#334155' }}>
          <Link to="/admin/login" style={{ color: '#475569', textDecoration: 'none' }}>Admin login →</Link>
        </p>
      </div>
    </div>
  );
}
