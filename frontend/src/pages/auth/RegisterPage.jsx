import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../../lib/api';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { name: form.name.trim(), email: form.email, password: form.password };
      if (form.phone.trim()) payload.phone = form.phone.trim();
      const { data } = await api.post('/auth/register', payload);
      toast.success('Account created! Check your email for the verification code.');
      navigate('/verify-otp', { state: { email: data.email } });
    } catch (err) {
      toast.error(err.response?.data?.error || err.response?.data?.errors?.[0]?.msg || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
      <div className="stars-bg" />
      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '420px' }}>

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
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f1f5f9', marginBottom: '0.35rem' }}>Create account</h2>
          <p style={{ fontSize: '0.83rem', color: '#64748b', marginBottom: '1.75rem' }}>Join KIRATECH IT Support today.</p>

          <form onSubmit={handleSubmit}>
            {[
              { label: 'Full Name', key: 'name', type: 'text', placeholder: 'John Doe' },
              { label: 'Email Address', key: 'email', type: 'email', placeholder: 'you@example.com' },
              { label: 'Phone Number (optional)', key: 'phone', type: 'tel', placeholder: '+255714759884' },
              { label: 'Password', key: 'password', type: 'password', placeholder: 'Min 8 chars, upper + lower + number' },
            ].map(f => (
              <div key={f.key} style={{ marginBottom: '1.1rem' }}>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>{f.label}</label>
                <input type={f.type} className="input-field" placeholder={f.placeholder}
                  required={f.key !== 'phone'} minLength={f.key === 'password' ? 8 : undefined}
                  value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} />
              </div>
            ))}

            <div style={{ marginTop: '0.5rem' }}>
              <button type="submit" disabled={loading} className="btn-teal">
                {loading ? 'Creating account…' : 'Create Account'}
              </button>
            </div>
          </form>

          <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.83rem', color: '#475569' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#34d399', textDecoration: 'none', fontWeight: 600 }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
