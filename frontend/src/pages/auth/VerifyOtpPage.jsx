import { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../../lib/api';

export default function VerifyOtpPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState(state?.email || '');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/verify-otp', { email, otp });
      toast.success('Email verified! You can now log in.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Verification failed');
    } finally { setLoading(false); }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      await api.post('/auth/resend-otp', { email });
      toast.success('New code sent to your email.');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to resend code');
    } finally { setResending(false); }
  };

  return (
    <div style={{ minHeight: '100vh', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
      <div className="stars-bg" />
      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '400px' }}>

        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>📧</div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#fff', marginBottom: '0.35rem' }}>Check your email</h1>
          <p style={{ fontSize: '0.83rem', color: '#64748b' }}>Enter the 6-digit code we sent to {email}</p>
        </div>

        <div className="glass-card" style={{ padding: '2rem' }}>
          <form onSubmit={handleVerify}>
            {!state?.email && (
              <div style={{ marginBottom: '1.1rem' }}>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Email Address</label>
                <input type="email" required className="input-field" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
            )}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Verification Code</label>
              <input
                type="text" required maxLength={6} pattern="\d{6}"
                value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="input-field"
                style={{ textAlign: 'center', fontSize: '2rem', letterSpacing: '0.5em', fontFamily: 'monospace' }}
                placeholder="000000"
              />
            </div>
            <button type="submit" disabled={loading || otp.length !== 6} className="btn-teal">
              {loading ? 'Verifying…' : 'Verify Email'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <button onClick={handleResend} disabled={resending} style={{ background: 'none', border: 'none', color: '#34d399', cursor: 'pointer', fontSize: '0.83rem' }}>
              {resending ? 'Sending…' : "Didn't receive it? Resend code"}
            </button>
            <br />
            <Link to="/login" style={{ color: '#475569', fontSize: '0.8rem', textDecoration: 'none', marginTop: '0.5rem', display: 'inline-block' }}>Back to login</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
