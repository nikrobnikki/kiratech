import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import useAuthStore from '../store/authStore';

const nav = [
  { to: '/technician/dashboard', label: 'Dashboard', icon: '🏠' },
  { to: '/technician/tasks',     label: 'My Tasks',   icon: '🔧' },
  { to: '/technician/profile',   label: 'Profile',    icon: '👤' },
];

export default function TechnicianLayout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };

  const Sidebar = () => (
    <div className="sidebar" style={{ width: '240px', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '1.25rem 1.25rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        <div className="logo-icon" style={{ width: '34px', height: '34px', borderRadius: '9px', flexShrink: 0 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="#fff" strokeWidth="1.5" strokeLinejoin="round"/>
            <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="#fff" strokeWidth="1.5" strokeLinejoin="round"/>
          </svg>
        </div>
        <div>
          <p style={{ fontWeight: 800, fontSize: '0.9rem', letterSpacing: '0.06em', color: '#fff', margin: 0 }}>KIRATECH</p>
          <p style={{ fontSize: '0.68rem', color: '#a78bfa', margin: 0, fontWeight: 600 }}>Technician Portal</p>
        </div>
      </div>

      <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <p style={{ fontSize: '0.72rem', color: '#475569', marginBottom: '0.2rem' }}>Logged in as</p>
        <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#e2e8f0', margin: 0 }}>{user?.name}</p>
      </div>

      <nav style={{ padding: '0.75rem', flex: 1 }}>
        {nav.map(item => (
          <NavLink key={item.to} to={item.to} onClick={() => setOpen(false)}
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
            style={{ marginBottom: '2px' }}>
            <span style={{ fontSize: '1rem' }}>{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div style={{ padding: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <button onClick={handleLogout} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.65rem 0.875rem', borderRadius: '10px', background: 'none', border: 'none', cursor: 'pointer', color: '#f87171', fontSize: '0.875rem', fontWeight: 500 }}
          onMouseOver={e => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}
          onMouseOut={e => e.currentTarget.style.background = 'none'}>
          <span>🚪</span><span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0f1e' }}>
      <div style={{ flexShrink: 0 }}><Sidebar /></div>
      {open && <div style={{ position: 'fixed', inset: 0, zIndex: 40, background: 'rgba(0,0,0,0.6)' }} onClick={() => setOpen(false)} />}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <header style={{ background: 'rgba(10,15,30,0.95)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button onClick={() => setOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: '0.35rem' }}>
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span style={{ fontWeight: 700, color: '#fff', fontSize: '0.95rem' }}>KIRATECH Technician</span>
        </header>
        <main style={{ flex: 1, padding: '1.5rem', overflow: 'auto' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
