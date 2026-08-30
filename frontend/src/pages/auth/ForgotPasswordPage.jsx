import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../../lib/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setSent(true);
    } catch { toast.error('Something went wrong.'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
      <div className="stars-bg" />
      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🔑</div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#fff', marginBottom: '0.35rem' }}>Reset your password</h1>
          <p style={{ fontSize: '0.83rem', color: '#64748b' }}>We'll send a reset link to your email</p>
        </div>

        <div className="glass-card" style={{ padding: '2rem' }}>
          {sent ? (
            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>✅</div>
              <p style={{ color: '#cbd5e1', marginBottom: '1rem' }}>Check your inbox for a password reset link.</p>
              <Link to="/login" style={{ color: '#34d399', textDecoration: 'none', fontSize: '0.85rem' }}>Back to login</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Email Address</label>
                <input type="email" required className="input-field" placeholder="you@example.com"
                  value={email} onChange={e => setEmail(e.target.value)} />
              </div>
              <button type="submit" disabled={loading} className="btn-teal">
                {loading ? 'Sending…' : 'Send Reset Link'}
              </button>
              <p style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.83rem' }}>
                <Link to="/login" style={{ color: '#34d399', textDecoration: 'none' }}>Back to login</Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
