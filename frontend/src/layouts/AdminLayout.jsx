import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import useAuthStore from '../store/authStore';

const nav = [
  { to: '/admin/dashboard',   label: 'Dashboard',   icon: '📊' },
  { to: '/admin/requests',    label: 'Requests',     icon: '🎫' },
  { to: '/admin/users',       label: 'Users',        icon: '👥' },
  { to: '/admin/technicians', label: 'Technicians',  icon: '🔧' },
  { to: '/admin/services',    label: 'Services',     icon: '⚙️' },
  { to: '/admin/payments',    label: 'Payments',     icon: '💳' },
];

export default function AdminLayout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/admin/login'); };

  const Sidebar = () => (
    <div className="sidebar" style={{ width: '240px', minHeight: '100vh', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
      {/* Brand */}
      <div style={{ padding: '1.25rem 1.25rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        <div className="logo-icon" style={{ width: '34px', height: '34px', borderRadius: '9px', flexShrink: 0 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="#fff" strokeWidth="1.5" strokeLinejoin="round"/>
            <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="#fff" strokeWidth="1.5" strokeLinejoin="round"/>
          </svg>
        </div>
        <div>
          <p style={{ fontWeight: 800, fontSize: '0.9rem', letterSpacing: '0.06em', color: '#fff', margin: 0 }}>KIRATECH</p>
          <p style={{ fontSize: '0.68rem', color: '#ef4444', margin: 0, fontWeight: 600 }}>Admin Panel</p>
        </div>
      </div>

      {/* User info */}
      <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <p style={{ fontSize: '0.68rem', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.25rem' }}>Administrator</p>
        <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#e2e8f0', margin: 0 }}>{user?.name}</p>
        <p style={{ fontSize: '0.72rem', color: '#475569', margin: 0 }}>{user?.email}</p>
      </div>

      {/* Nav */}
      <nav style={{ padding: '0.75rem', flex: 1 }}>
        {nav.map(item => (
          <NavLink key={item.to} to={item.to} onClick={() => setOpen(false)}
            className={({ isActive }) => isActive ? 'nav-link active-red' : 'nav-link'}
            style={{ marginBottom: '2px' }}>
            <span style={{ fontSize: '1rem' }}>{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div style={{ padding: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <button onClick={handleLogout} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.65rem 0.875rem', borderRadius: '10px', background: 'none', border: 'none', cursor: 'pointer', color: '#f87171', fontSize: '0.875rem', fontWeight: 500, transition: 'background 0.15s' }}
          onMouseOver={e => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}
          onMouseOut={e => e.currentTarget.style.background = 'none'}>
          <span>🚪</span><span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0f1e' }}>
      {/* Desktop sidebar */}
      <div style={{ display: 'none' }} className="lg-sidebar">
        <Sidebar />
      </div>
      <div style={{ display: 'flex', minHeight: '100vh', width: '100%' }}>
        {/* Sidebar always visible on large screens */}
        <div style={{ flexShrink: 0 }}>
          <Sidebar />
        </div>

        {/* Mobile overlay */}
        {open && <div style={{ position: 'fixed', inset: 0, zIndex: 40, background: 'rgba(0,0,0,0.6)' }} onClick={() => setOpen(false)} />}

        {/* Mobile sidebar */}
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, transform: open ? 'translateX(0)' : 'translateX(-100%)', transition: 'transform 0.3s', width: '240px', display: 'none' }}>
          <Sidebar />
        </div>

        {/* Main */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <main style={{ flex: 1, padding: '1.5rem', overflowAuto: 'auto' }}>
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
