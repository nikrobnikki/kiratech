import { useState } from 'react';
import { toast } from 'react-hot-toast';
import useAuthStore from '../../store/authStore';
import api from '../../lib/api';

export default function CustomerProfile() {
  const { user, refreshUser } = useAuthStore();
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '', address: user?.address || '' });
  const [pwd, setPwd] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [saving, setSaving] = useState(false);
  const [changingPwd, setChangingPwd] = useState(false);

  const handleProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/user/profile', { name: form.name, phone: form.phone || undefined, address: form.address || undefined });
      await refreshUser();
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const handlePassword = async (e) => {
    e.preventDefault();
    if (pwd.newPassword !== pwd.confirm) { toast.error('Passwords do not match'); return; }
    setChangingPwd(true);
    try {
      await api.put('/user/change-password', { currentPassword: pwd.currentPassword, newPassword: pwd.newPassword });
      toast.success('Password changed');
      setPwd({ currentPassword: '', newPassword: '', confirm: '' });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Password change failed');
    } finally {
      setChangingPwd(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">My Profile</h1>
        <p className="text-slate-400 mt-1">Manage your account details</p>
      </div>

      {/* Info */}
      <div className="card flex items-center gap-4">
        <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-2xl flex-shrink-0">
          {user?.name?.[0]}
        </div>
        <div>
          <p className="font-semibold text-white text-lg">{user?.name}</p>
          <p className="text-slate-400">{user?.email}</p>
          <p className="text-xs mt-1 inline-flex items-center gap-1">
            <span className={user?.isVerified ? 'text-green-400' : 'text-yellow-400'}>
              {user?.isVerified ? '✅ Verified' : '⚠️ Not verified'}
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-slate-400 capitalize">{user?.subscriptionType} plan</span>
          </p>
        </div>
      </div>

      {/* Edit profile */}
      <form onSubmit={handleProfile} className="card space-y-4">
        <h2 className="font-semibold text-white">Update Profile</h2>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Full name</label>
          <input className="input-field" required minLength={2} value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Phone</label>
          <input className="input-field" type="tel" value={form.phone}
            onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+255714759884" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Address</label>
          <input className="input-field" value={form.address}
            onChange={e => setForm(f => ({ ...f, address: e.target.value }))} placeholder="Your address" />
        </div>
        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? 'Saving…' : 'Save Changes'}
        </button>
      </form>

      {/* Change password */}
      <form onSubmit={handlePassword} className="card space-y-4">
        <h2 className="font-semibold text-white">Change Password</h2>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Current password</label>
          <input type="password" required className="input-field" value={pwd.currentPassword}
            onChange={e => setPwd(p => ({ ...p, currentPassword: e.target.value }))} />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">New password</label>
          <input type="password" required minLength={8} className="input-field" value={pwd.newPassword}
            onChange={e => setPwd(p => ({ ...p, newPassword: e.target.value }))} />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Confirm new password</label>
          <input type="password" required className="input-field" value={pwd.confirm}
            onChange={e => setPwd(p => ({ ...p, confirm: e.target.value }))} />
        </div>
        <button type="submit" disabled={changingPwd} className="btn-primary">
          {changingPwd ? 'Changing…' : 'Change Password'}
        </button>
      </form>
    </div>
  );
}
