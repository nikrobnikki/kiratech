import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import useAuthStore from '../../store/authStore';
import api from '../../lib/api';
import { PageSpinner } from '../../components/Spinner';

export default function TechnicianProfile() {
  const { user, refreshUser } = useAuthStore();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [form, setForm]       = useState({ specialization: '', bio: '', experience: '', availability: 'available', skills: '' });

  useEffect(() => {
    api.get('/technician/profile').then(r => {
      const p = r.data.profile;
      setProfile(p);
      setForm({
        specialization: p.specialization || '',
        bio:            p.bio || '',
        experience:     p.experience ?? '',
        availability:   p.availability || 'available',
        skills:         Array.isArray(p.skills) ? p.skills.join(', ') : '',
      });
    }).catch(() => toast.error('Failed to load profile')).finally(() => setLoading(false));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        specialization: form.specialization || undefined,
        bio:            form.bio || undefined,
        experience:     form.experience !== '' ? parseInt(form.experience, 10) : undefined,
        availability:   form.availability,
        skills:         form.skills ? form.skills.split(',').map(s => s.trim()).filter(Boolean) : [],
      };
      await api.put('/technician/profile', payload);
      await refreshUser();
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <PageSpinner />;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">My Profile</h1>
        <p className="text-slate-400 mt-1">Manage your technician profile</p>
      </div>

      <div className="card flex items-center gap-4">
        <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-2xl flex-shrink-0">
          {user?.name?.[0]}
        </div>
        <div>
          <p className="font-semibold text-white text-lg">{user?.name}</p>
          <p className="text-slate-400 text-sm">{user?.email}</p>
          {profile?.employeeId && <p className="text-xs text-slate-500 mt-0.5">ID: {profile.employeeId}</p>}
          {profile?.rating > 0 && <p className="text-xs text-yellow-400 mt-0.5">⭐ {parseFloat(profile.rating).toFixed(1)} · {profile.totalJobsDone} jobs</p>}
        </div>
      </div>

      <form onSubmit={handleSave} className="card space-y-4">
        <h2 className="font-semibold text-white">Update Profile</h2>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Availability</label>
          <select className="input-field" value={form.availability}
            onChange={e => setForm(f => ({ ...f, availability: e.target.value }))}>
            <option value="available">Available</option>
            <option value="busy">Busy</option>
            <option value="offline">Offline</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Specialization</label>
          <input className="input-field" value={form.specialization}
            onChange={e => setForm(f => ({ ...f, specialization: e.target.value }))}
            placeholder="e.g. Networking & Hardware" />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Years of Experience</label>
          <input type="number" min={0} max={50} className="input-field" value={form.experience}
            onChange={e => setForm(f => ({ ...f, experience: e.target.value }))} />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Skills (comma-separated)</label>
          <input className="input-field" value={form.skills}
            onChange={e => setForm(f => ({ ...f, skills: e.target.value }))}
            placeholder="Windows, Linux, Networking, Hardware" />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Bio</label>
          <textarea rows={3} className="input-field resize-none" value={form.bio}
            onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
            placeholder="Brief description of your experience and expertise" />
        </div>

        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? 'Saving…' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}
