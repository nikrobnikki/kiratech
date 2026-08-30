import { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../../lib/api';

export default function ResetPasswordPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const token = params.get('token') || '';
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) { toast.error('Passwords do not match'); return; }
    setLoading(true);
    try {
      await api.post('/auth/reset-password', { token, password });
      toast.success('Password reset successfully.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Reset failed');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
      <div className="stars-bg" />
      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🔒</div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#fff' }}>Set new password</h1>
        </div>
        <div className="glass-card" style={{ padding: '2rem' }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1.1rem' }}>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>New Password</label>
              <input type="password" required minLength={8} className="input-field" placeholder="Min 8 chars"
                value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Confirm Password</label>
              <input type="password" required className="input-field" placeholder="Repeat password"
                value={confirm} onChange={e => setConfirm(e.target.value)} />
            </div>
            <button type="submit" disabled={loading} className="btn-teal">
              {loading ? 'Resetting…' : 'Reset Password'}
            </button>
          </form>
          <p style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.83rem' }}>
            <Link to="/login" style={{ color: '#34d399', textDecoration: 'none' }}>Back to login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
