import { Link } from 'react-router-dom';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import api from '../lib/api';

const services = [
  { icon: '💻', name: 'Computer Maintenance', desc: 'Full diagnosis, cleaning, and performance optimization.' },
  { icon: '🖨️', name: 'Printer Repair',       desc: 'Installation, driver setup, and jam fixes.' },
  { icon: '📱', name: 'Mobile Phone Repair',  desc: 'Screen, battery, charging port, and software.' },
  { icon: '🌐', name: 'Network & WiFi Setup', desc: 'Home and office networking and cabling.' },
  { icon: '☁️', name: 'Data Recovery',        desc: 'Recover lost files from any storage device.' },
  { icon: '⬇️', name: 'Software Installation',desc: 'Windows, Office, drivers, and antivirus.' },
  { icon: '🖥️', name: 'Hardware Upgrades',    desc: 'RAM, SSD, GPU, PSU upgrades and swaps.' },
  { icon: '🔌', name: 'Remote Support',       desc: 'AnyDesk / TeamViewer for Windows & Mac.' },
  { icon: '📞', name: 'On-Call Priority',     desc: 'Dedicated technician on standby for emergencies.' },
];

const steps = [
  { num: '01', title: 'Submit Request',  desc: 'Describe your issue and choose a service.' },
  { num: '02', title: 'Get Assigned',    desc: 'We assign the best technician for the job.' },
  { num: '03', title: 'Track Progress',  desc: 'Follow status updates in real time.' },
  { num: '04', title: 'Pay Securely',    desc: 'Card, mobile money, or crypto.' },
];

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
    <div style={{ background: '#0a0f1e', minHeight: '100vh', color: '#e2e8f0', position: 'relative' }}>
      <div className="stars-bg" style={{ position: 'fixed' }} />

      {/* ── Nav ── */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(10,15,30,0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '0 1.5rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div className="logo-icon" style={{ width: '36px', height: '36px', borderRadius: '10px' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="#fff" strokeWidth="1.5" strokeLinejoin="round"/>
                <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="#fff" strokeWidth="1.5" strokeLinejoin="round"/>
              </svg>
            </div>
            <span style={{ fontWeight: 800, fontSize: '1.1rem', letterSpacing: '0.06em', color: '#fff' }}>KIRATECH</span>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <Link to="/login" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.875rem', padding: '0.4rem 0.75rem', borderRadius: '8px', transition: 'color 0.15s' }}>Login</Link>
            <Link to="/register" className="btn-teal" style={{ padding: '0.45rem 1.1rem', fontSize: '0.875rem', width: 'auto', borderRadius: '8px' }}>Get Started</Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section style={{ position: 'relative', zIndex: 1, maxWidth: '1200px', margin: '0 auto', padding: '6rem 1.5rem 5rem', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '9999px', padding: '0.4rem 1rem', fontSize: '0.8rem', color: '#34d399', marginBottom: '1.75rem', fontWeight: 600 }}>
          🔧 Professional IT Support in Arusha, Tanzania
        </div>
        <h1 style={{ fontSize: 'clamp(2.2rem, 6vw, 4rem)', fontWeight: 900, color: '#fff', lineHeight: 1.15, marginBottom: '1.25rem' }}>
          IT Support,<br />
          <span style={{ background: 'linear-gradient(135deg, #10b981, #0ea5e9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>On Demand</span>
        </h1>
        <p style={{ fontSize: '1.1rem', color: '#64748b', maxWidth: '560px', margin: '0 auto 2.5rem', lineHeight: 1.7 }}>
          Submit a request, track your technician in real time, and pay securely with card, mobile money, or crypto. Expert help is one click away.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/register" className="btn-teal" style={{ width: 'auto', padding: '0.85rem 2rem', fontSize: '1rem' }}>Request a Service</Link>
          <a href="#services" className="btn-secondary" style={{ padding: '0.85rem 2rem', fontSize: '1rem' }}>View Services</a>
        </div>
      </section>

      {/* ── Services ── */}
      <section id="services" style={{ position: 'relative', zIndex: 1, maxWidth: '1200px', margin: '0 auto', padding: '4rem 1.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', marginBottom: '0.75rem' }}>Our Services</h2>
          <p style={{ color: '#64748b' }}>Expert support for all your IT needs</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
          {services.map(s => (
            <div key={s.name} className="glass-card" style={{ padding: '1.5rem', transition: 'border-color 0.2s, transform 0.2s', cursor: 'default' }}
              onMouseOver={e => { e.currentTarget.style.borderColor = 'rgba(16,185,129,0.3)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseOut={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.transform = 'none'; }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{s.icon}</div>
              <h3 style={{ fontWeight: 700, color: '#f1f5f9', marginBottom: '0.4rem', fontSize: '0.95rem' }}>{s.name}</h3>
              <p style={{ fontSize: '0.82rem', color: '#64748b', lineHeight: 1.6 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section style={{ position: 'relative', zIndex: 1, background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.04)', padding: '5rem 1.5rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', marginBottom: '0.75rem' }}>How It Works</h2>
            <p style={{ color: '#64748b' }}>Simple, fast, transparent</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
            {steps.map(s => (
              <div key={s.num} style={{ textAlign: 'center' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '52px', height: '52px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '50%', color: '#34d399', fontWeight: 800, fontSize: '0.85rem', marginBottom: '1rem' }}>{s.num}</div>
                <h3 style={{ fontWeight: 700, color: '#f1f5f9', marginBottom: '0.5rem' }}>{s.title}</h3>
                <p style={{ fontSize: '0.83rem', color: '#64748b', lineHeight: 1.6 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Payment methods ── */}
      <section style={{ position: 'relative', zIndex: 1, maxWidth: '1200px', margin: '0 auto', padding: '5rem 1.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', marginBottom: '0.75rem' }}>Flexible Payment Options</h2>
          <p style={{ color: '#64748b' }}>We accept all major payment methods</p>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.75rem' }}>
          {['💳 Credit / Debit Card', '📱 M-Pesa (TZ/KE)', '📱 Airtel Money', '📱 Tigo Pesa', '📱 MTN MoMo', '🟡 USDT / Binance Pay'].map(m => (
            <div key={m} className="glass-card" style={{ padding: '0.65rem 1.25rem', fontSize: '0.83rem', color: '#cbd5e1', fontWeight: 500 }}>{m}</div>
          ))}
        </div>
      </section>

      {/* ── Contact ── */}
      <section id="contact" style={{ position: 'relative', zIndex: 1, background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.04)', padding: '5rem 1.5rem' }}>
        <div style={{ maxWidth: '560px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', marginBottom: '0.75rem' }}>Contact Us</h2>
            <p style={{ color: '#64748b' }}>Questions? We typically respond within 24 hours.</p>
          </div>
          <form className="glass-card" style={{ padding: '2rem' }} onSubmit={handleContact}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              {[{ k: 'name', label: 'Name', type: 'text', ph: 'Your name' }, { k: 'email', label: 'Email', type: 'email', ph: 'you@example.com' }].map(f => (
                <div key={f.k}>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>{f.label}</label>
                  <input required type={f.type} className="input-field" placeholder={f.ph} value={contact[f.k]} onChange={e => setContact(c => ({ ...c, [f.k]: e.target.value }))} />
                </div>
              ))}
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Subject</label>
              <input required className="input-field" placeholder="How can we help?" value={contact.subject} onChange={e => setContact(c => ({ ...c, subject: e.target.value }))} />
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Message</label>
              <textarea required rows={4} className="input-field" style={{ resize: 'none' }} placeholder="Describe your issue or question…" value={contact.message} onChange={e => setContact(c => ({ ...c, message: e.target.value }))} />
            </div>
            <button type="submit" disabled={sending} className="btn-teal">
              {sending ? 'Sending…' : 'Send Message'}
            </button>
          </form>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ position: 'relative', zIndex: 1, borderTop: '1px solid rgba(255,255,255,0.06)', padding: '2.5rem 1.5rem', textAlign: 'center' }}>
        <p style={{ fontWeight: 700, color: '#94a3b8', marginBottom: '0.35rem' }}>KIRATECH IT Support</p>
        <p style={{ fontSize: '0.82rem', color: '#475569' }}>Njiro Road, Arusha, Tanzania · robertcharles088@gmail.com</p>
        <p style={{ fontSize: '0.78rem', color: '#334155', marginTop: '1rem' }}>© {new Date().getFullYear()} KIRATECH. All rights reserved.</p>
      </footer>
    </div>
  );
}
