import { Link } from 'react-router-dom';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import api from '../lib/api';

const services = [
  { icon: '💻', name: 'Computer Maintenance', desc: 'Full diagnosis, cleaning, and performance optimization.' },
  { icon: '🖨️', name: 'Printer Repair',        desc: 'Installation, driver setup, and jam fixes.' },
  { icon: '📱', name: 'Mobile Phone Repair',   desc: 'Screen, battery, charging port, and software.' },
  { icon: '🌐', name: 'Network & WiFi Setup',  desc: 'Home and office networking and cabling.' },
  { icon: '☁️', name: 'Data Recovery',          desc: 'Recover lost files from any storage device.' },
  { icon: '⬇️', name: 'Software Installation', desc: 'Windows, Office, drivers, and antivirus.' },
  { icon: '🖥️', name: 'Hardware Upgrades',     desc: 'RAM, SSD, GPU, PSU upgrades and swaps.' },
  { icon: '🔌', name: 'Remote Support',        desc: 'AnyDesk / TeamViewer support for Windows & Mac.' },
  { icon: '📞', name: 'On-Call Priority',      desc: 'Dedicated technician on standby for emergencies.' },
];

export default function LandingPage() {
  const [contact, setContact] = useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);

  const handleContact = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await api.post('/contact', contact);
      toast.success('Message sent! We\'ll get back to you within 24 hours.');
      setContact({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Nav */}
      <nav className="border-b border-slate-800 sticky top-0 z-50 bg-slate-950/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-sm">K</div>
            <span className="font-bold text-lg">KIRATECH</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login"    className="text-sm text-slate-400 hover:text-white transition-colors px-3 py-1.5">Login</Link>
            <Link to="/register" className="btn-primary text-sm px-4 py-1.5">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 text-blue-400 text-sm mb-6">
          🔧 Professional IT Support in Arusha, Tanzania
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
          IT Support,<br />
          <span className="text-blue-500">On Demand</span>
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10">
          Submit a request, track your technician in real time, and pay securely with card,
          mobile money, or crypto. Expert help is one click away.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/register" className="btn-primary px-8 py-3 text-base">Request a Service</Link>
          <a href="#services" className="btn-secondary px-8 py-3 text-base">View Services</a>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-3">Our Services</h2>
          <p className="text-slate-400">Expert support for all your IT needs</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map(s => (
            <div key={s.name} className="card hover:border-blue-700 transition-colors group">
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform inline-block">{s.icon}</div>
              <h3 className="font-semibold text-white mb-1">{s.name}</h3>
              <p className="text-sm text-slate-400">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-slate-900/50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-3">How It Works</h2>
            <p className="text-slate-400">Simple, fast, transparent</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Submit Request', desc: 'Describe your issue and choose a service.' },
              { step: '02', title: 'Get Assigned',   desc: 'We assign the best technician for your job.' },
              { step: '03', title: 'Track Progress', desc: 'Follow status updates in real time.' },
              { step: '04', title: 'Pay Securely',   desc: 'Pay via card, mobile money, or crypto.' },
            ].map(s => (
              <div key={s.step} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600/20 border border-blue-500/30 rounded-full text-blue-400 font-bold mb-4">{s.step}</div>
                <h3 className="font-semibold text-white mb-1">{s.title}</h3>
                <p className="text-sm text-slate-400">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Payment methods */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-white mb-3">Flexible Payment Options</h2>
          <p className="text-slate-400">We accept all major payment methods</p>
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          {['💳 Credit / Debit Card', '📱 M-Pesa (TZ/KE)', '📱 Airtel Money', '📱 Tigo Pesa', '📱 MTN MoMo', '🟡 USDT / Binance Pay'].map(m => (
            <div key={m} className="card py-3 px-5 text-sm text-slate-300 font-medium">{m}</div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="bg-slate-900/50 py-20">
        <div className="max-w-xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-white mb-3">Contact Us</h2>
            <p className="text-slate-400">Questions? We typically respond within 24 hours.</p>
          </div>
          <form onSubmit={handleContact} className="card space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Name</label>
                <input required className="input-field" value={contact.name}
                  onChange={e => setContact(c => ({ ...c, name: e.target.value }))} placeholder="Your name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Email</label>
                <input required type="email" className="input-field" value={contact.email}
                  onChange={e => setContact(c => ({ ...c, email: e.target.value }))} placeholder="you@example.com" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Subject</label>
              <input required className="input-field" value={contact.subject}
                onChange={e => setContact(c => ({ ...c, subject: e.target.value }))} placeholder="How can we help?" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Message</label>
              <textarea required rows={4} className="input-field resize-none" value={contact.message}
                onChange={e => setContact(c => ({ ...c, message: e.target.value }))} placeholder="Describe your issue or question…" />
            </div>
            <button type="submit" disabled={sending} className="btn-primary w-full py-2.5">
              {sending ? 'Sending…' : 'Send message'}
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-10 text-center text-slate-500 text-sm">
        <p className="font-semibold text-slate-400 mb-1">KIRATECH IT Support</p>
        <p>Njiro Road, Arusha, Tanzania · robertcharles088@gmail.com</p>
        <p className="mt-4">© {new Date().getFullYear()} KIRATECH. All rights reserved.</p>
      </footer>
    </div>
  );
}
