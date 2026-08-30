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
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      await api.post('/auth/resend-otp', { email });
      toast.success('New code sent to your email.');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to resend code');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">📧</div>
          <h1 className="text-2xl font-bold text-white">Check your email</h1>
          <p className="text-slate-400 mt-1">Enter the 6-digit code we sent to your email</p>
        </div>

        <div className="card">
          <form onSubmit={handleVerify} className="space-y-4">
            {!state?.email && (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Email address</label>
                <input
                  type="email" required value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="input-field"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Verification code</label>
              <input
                type="text" required pattern="\d{6}" maxLength={6}
                value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="input-field text-center text-2xl tracking-[0.5em] font-mono"
                placeholder="000000"
              />
            </div>

            <button type="submit" disabled={loading || otp.length !== 6} className="btn-primary w-full py-2.5">
              {loading ? 'Verifying…' : 'Verify email'}
            </button>
          </form>

          <div className="text-center mt-6 space-y-2">
            <button onClick={handleResend} disabled={resending} className="text-sm text-blue-400 hover:text-blue-300 disabled:opacity-50">
              {resending ? 'Sending…' : "Didn't receive it? Resend code"}
            </button>
            <br />
            <Link to="/login" className="text-sm text-slate-500 hover:text-slate-400">Back to login</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
