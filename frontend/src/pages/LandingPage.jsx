import { Link } from 'react-router-dom';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import api from '../lib/api';

const services = [
  { icon: '💻', name: 'Computer Maintenance',   desc: 'Full diagnosis, cleaning, and performance optimization.' },
  { icon: '🖨️', name: 'Printer Repair',          desc: 'Installation, driver setup, and jam fixes.' },
  { icon: '📱', name: 'Mobile Phone Repair',     desc: 'Screen, battery, charging port, and software.' },
  { icon: '🌐', name: 'Network & WiFi Setup',    desc: 'Home and office networking and cabling.' },
  { icon: '☁️', name: 'Data Recovery',            desc: 'Recover lost files from any storage device.' },
  { icon: '⬇️', name: 'Software Installation',   desc: 'Windows, Office, drivers, and antivirus.' },
  { icon: '🖥️', name: 'Hardware Upgrades',       desc: 'RAM, SSD, GPU, PSU upgrades and swaps.' },
  { icon: '🔌', name: 'Remote Support',          desc: 'AnyDesk / TeamViewer for Windows & Mac.' },
  { icon: '📞', name: 'On-Call Priority',        desc: 'Dedicated technician on standby for emergencies.' },
];

const steps = [
  { num: '01', title: 'Submit Request', desc: 'Describe your issue and choose a service.' },
  { num: '02', title: 'Get Assigned',   desc: 'We assign the best technician for the job.' },
  { num: '03', title: 'Track Progress', desc: 'Follow status updates in real time.' },
  { num: '04', title: 'Pay Securely',   desc: 'Card, mobile money, or crypto.' },
];

const LogoSVG = () => (
  <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
    <path d="M16 4 L28 10 L28 22 L16 28 L4 22 L4 10 Z" stroke="url(#lgl)" strokeWidth="1.5" fill="none"/>
    <path d="M16 4 L16 16 M16 16 L28 10 M16 16 L4 10 M16 16 L16 28 M16 16 L28 22 M16 16 L4 22" stroke="url(#lgl2)" strokeWidth="1.2" opacity="0.7"/>
    <circle cx="16" cy="16" r="3" fill="url(#lgl)"/>
    <defs>
      <linearGradient id="lgl" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#60a5fa"/><stop offset="100%" stopColor="#22d3ee"/></linearGradient>
      <linearGradient id="lgl2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#3b82f6"/><stop offset="100%" stopColor="#06b6d4"/></linearGradient>
    </defs>
  </svg>
);

export default function LandingPage() {
  const [contact, setContact] = useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);

  const handleContact = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await api.post('/contact', contact);
      toast.success("Message sent! We'll get back to you within 24 hours.");
      setContact({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to send message');
    } finally { setSending(false); }
  };

  return (
    <div style={{ background: '#070d1a', minHeight: '100vh', color: '#cbd5e1', position: 'relative' }}>
      <div className="stars-bg" style={{ position: 'fixed' }} />

      {/* ── Nav ── */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(4,8,15,0.9)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(59,130,246,0.08)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div className="logo-icon" style={{ width: '36px', height: '36px', borderRadius: '10px' }}><LogoSVG /></div>
            <span style={{ fontWeight: 900, fontSize: '1.05rem', letterSpacing: '0.1em', color: '#fff' }}>KIRATECH</span>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <Link to="/login" style={{ color: '#64748b', textDecoration: 'none', fontSize: '0.875rem', padding: '0.4rem 0.75rem', borderRadius: '8px' }}>Login</Link>
            <Link to="/register" className="btn-teal" style={{ width: 'auto', padding: '0.45rem 1.1rem', fontSize: '0.875rem' }}>Get Started</Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section style={{ position: 'relative', zIndex: 1, maxWidth: '1200px', margin: '0 auto', padding: '7rem 1.5rem 5rem', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(37,99,235,0.1)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: '9999px', padding: '0.4rem 1rem', fontSize: '0.78rem', color: '#60a5fa', marginBottom: '2rem', fontWeight: 600, letterSpacing: '0.04em' }}>
          🔧 Professional IT Support in Arusha, Tanzania
        </div>
        <h1 style={{ fontSize: 'clamp(2.4rem,6vw,4.2rem)', fontWeight: 900, color: '#fff', lineHeight: 1.1, marginBottom: '1.5rem' }}>
          IT Support,{' '}
          <span style={{ background: 'linear-gradient(90deg, #60a5fa, #22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>On Demand</span>
        </h1>
        <p style={{ fontSize: '1.05rem', color: '#64748b', maxWidth: '520px', margin: '0 auto 2.5rem', lineHeight: 1.75 }}>
          Submit a request, track your technician in real time, and pay securely with card, mobile money, or crypto.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/register" className="btn-teal" style={{ width: 'auto', padding: '0.85rem 2rem', fontSize: '0.95rem' }}>Request a Service</Link>
          <a href="#services" className="btn-secondary" style={{ padding: '0.85rem 2rem', fontSize: '0.95rem' }}>View Services</a>
        </div>
      </section>

      {/* ── Services ── */}
      <section id="services" style={{ position: 'relative', zIndex: 1, maxWidth: '1200px', margin: '0 auto', padding: '3rem 1.5rem 5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', marginBottom: '0.6rem' }}>Our Services</h2>
          <p style={{ color: '#475569', fontSize: '0.9rem' }}>Expert support for all your IT needs</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: '1rem' }}>
          {services.map(s => (
            <div key={s.name} className="card" style={{ cursor: 'default', transition: 'border-color 0.2s, transform 0.2s' }}
              onMouseOver={e => { e.currentTarget.style.borderColor = 'rgba(59,130,246,0.3)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
              onMouseOut={e => { e.currentTarget.style.borderColor = 'rgba(59,130,246,0.1)'; e.currentTarget.style.transform = 'none'; }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{s.icon}</div>
              <h3 style={{ fontWeight: 700, color: '#e2e8f0', marginBottom: '0.4rem', fontSize: '0.95rem' }}>{s.name}</h3>
              <p style={{ fontSize: '0.8rem', color: '#475569', lineHeight: 1.6 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section style={{ position: 'relative', zIndex: 1, background: 'rgba(37,99,235,0.03)', borderTop: '1px solid rgba(59,130,246,0.06)', borderBottom: '1px solid rgba(59,130,246,0.06)', padding: '5rem 1.5rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', marginBottom: '0.6rem' }}>How It Works</h2>
            <p style={{ color: '#475569', fontSize: '0.9rem' }}>Simple, fast, transparent</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
            {steps.map(s => (
              <div key={s.num} style={{ textAlign: 'center' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '52px', height: '52px', background: 'rgba(37,99,235,0.12)', border: '1px solid rgba(59,130,246,0.25)', borderRadius: '50%', color: '#60a5fa', fontWeight: 800, fontSize: '0.82rem', marginBottom: '1rem', boxShadow: '0 0 16px rgba(37,99,235,0.15)' }}>{s.num}</div>
                <h3 style={{ fontWeight: 700, color: '#e2e8f0', marginBottom: '0.5rem', fontSize: '0.95rem' }}>{s.title}</h3>
                <p style={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.6 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Payment methods ── */}
      <section style={{ position: 'relative', zIndex: 1, maxWidth: '1200px', margin: '0 auto', padding: '5rem 1.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', marginBottom: '0.6rem' }}>Flexible Payment Options</h2>
          <p style={{ color: '#475569', fontSize: '0.9rem' }}>We accept all major payment methods</p>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.75rem' }}>
          {['💳 Credit / Debit Card', '📱 M-Pesa (TZ/KE)', '📱 Airtel Money', '📱 Tigo Pesa', '📱 MTN MoMo', '🟡 USDT / Binance Pay'].map(m => (
            <div key={m} className="card" style={{ padding: '0.6rem 1.1rem', fontSize: '0.82rem', color: '#94a3b8', fontWeight: 500 }}>{m}</div>
          ))}
        </div>
      </section>

      {/* ── Contact ── */}
      <section id="contact" style={{ position: 'relative', zIndex: 1, background: 'rgba(37,99,235,0.03)', borderTop: '1px solid rgba(59,130,246,0.06)', padding: '5rem 1.5rem' }}>
        <div style={{ maxWidth: '540px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', marginBottom: '0.6rem' }}>Contact Us</h2>
            <p style={{ color: '#475569', fontSize: '0.9rem' }}>Questions? We typically respond within 24 hours.</p>
          </div>
          <form className="glass-card" style={{ padding: '2rem' }} onSubmit={handleContact}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              {[{ k: 'name', label: 'Name', type: 'text', ph: 'Your name' }, { k: 'email', label: 'Email', type: 'email', ph: 'you@example.com' }].map(f => (
                <div key={f.k}>
                  <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: '#64748b', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>{f.label}</label>
                  <input required type={f.type} className="input-field" placeholder={f.ph} value={contact[f.k]} onChange={e => setContact(c => ({ ...c, [f.k]: e.target.value }))} />
                </div>
              ))}
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: '#64748b', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Subject</label>
              <input required className="input-field" placeholder="How can we help?" value={contact.subject} onChange={e => setContact(c => ({ ...c, subject: e.target.value }))} />
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: '#64748b', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Message</label>
              <textarea required rows={4} className="input-field" style={{ resize: 'none' }} placeholder="Describe your issue…" value={contact.message} onChange={e => setContact(c => ({ ...c, message: e.target.value }))} />
            </div>
            <button type="submit" disabled={sending} className="btn-teal">{sending ? 'Sending…' : 'Send Message'}</button>
          </form>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ position: 'relative', zIndex: 1, borderTop: '1px solid rgba(59,130,246,0.07)', padding: '2.5rem 1.5rem', textAlign: 'center' }}>
        <p style={{ fontWeight: 700, color: '#64748b', marginBottom: '0.35rem', letterSpacing: '0.06em' }}>KIRATECH IT SUPPORT</p>
        <p style={{ fontSize: '0.8rem', color: '#334155' }}>Njiro Road, Arusha, Tanzania · robertcharles088@gmail.com</p>
        <p style={{ fontSize: '0.75rem', color: '#1e293b', marginTop: '1rem' }}>© {new Date().getFullYear()} KIRATECH. All rights reserved.</p>
      </footer>
    </div>
  );
}
