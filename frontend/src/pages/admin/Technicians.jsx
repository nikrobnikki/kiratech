import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import api from '../../lib/api';
import Pagination from '../../components/Pagination';
import { PageSpinner } from '../../components/Spinner';

const defaultForm = { name: '', email: '', password: '', phone: '', specialization: '', experience: '', skills: '' };

export default function AdminTechnicians() {
  const [techs, setTechs]         = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading]     = useState(true);
  const [showForm, setShowForm]   = useState(false);
  const [form, setForm]           = useState(defaultForm);
  const [creating, setCreating]   = useState(false);
  const [page, setPage]           = useState(1);

  const fetch = (p = 1) => {
    setLoading(true);
    api.get(`/admin/technicians?page=${p}&limit=15`)
      .then(r => { setTechs(r.data.data || []); setPagination(r.data.pagination); })
      .catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      const payload = {
        name: form.name, email: form.email, password: form.password,
        phone: form.phone || undefined,
        specialization: form.specialization || undefined,
        experience: form.experience ? parseInt(form.experience) : undefined,
        skills: form.skills ? form.skills.split(',').map(s => s.trim()).filter(Boolean) : [],
      };
      await api.post('/admin/technicians', payload);
      toast.success('Technician created!');
      setForm(defaultForm);
      setShowForm(false);
      fetch();
    } catch (err) {
      toast.error(err.response?.data?.error || err.response?.data?.errors?.[0]?.msg || 'Failed');
    } finally {
      setCreating(false);
    }
  };

  const removeTech = async (id) => {
    if (!window.confirm('Remove this technician?')) return;
    try {
      await api.delete(`/admin/technicians/${id}`);
      toast.success('Technician removed');
      fetch(page);
    } catch (err) { toast.error(err.response?.data?.error || 'Failed'); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Technicians</h1>
          <p className="text-slate-400 mt-1">{pagination?.total ?? 0} active</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary text-sm">
          {showForm ? 'Cancel' : '+ Add Technician'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="card space-y-4">
          <h2 className="font-semibold text-white">New Technician Account</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Full Name *</label>
              <input required className="input-field" value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Email *</label>
              <input required type="email" className="input-field" value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Password *</label>
              <input required type="password" minLength={8} className="input-field" value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))} placeholder="Min 8 chars + upper + number" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Phone</label>
              <input type="tel" className="input-field" value={form.phone}
                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Specialization</label>
              <input className="input-field" value={form.specialization}
                onChange={e => setForm(f => ({ ...f, specialization: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Experience (years)</label>
              <input type="number" min={0} className="input-field" value={form.experience}
                onChange={e => setForm(f => ({ ...f, experience: e.target.value }))} />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Skills (comma-separated)</label>
              <input className="input-field" value={form.skills}
                onChange={e => setForm(f => ({ ...f, skills: e.target.value }))}
                placeholder="Windows, Linux, Networking" />
            </div>
          </div>
          <button type="submit" disabled={creating} className="btn-primary">
            {creating ? 'Creating…' : 'Create Technician'}
          </button>
        </form>
      )}

      {loading ? <PageSpinner /> : (
        <>
          <div className="card overflow-x-auto p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-slate-500 text-xs uppercase border-b border-slate-800">
                  {['Name','Email','Specialization','Availability','Rating','Jobs','Action'].map(h => (
                    <th key={h} className="text-left px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {techs.map(t => (
                  <tr key={t.id} className="hover:bg-slate-800/40">
                    <td className="px-4 py-3 font-medium text-white">{t.user?.name}</td>
                    <td className="px-4 py-3 text-slate-400 text-xs">{t.user?.email}</td>
                    <td className="px-4 py-3 text-slate-400">{t.specialization || '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs capitalize ${t.availability === 'available' ? 'text-green-400' : t.availability === 'busy' ? 'text-yellow-400' : 'text-slate-500'}`}>
                        {t.availability}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-yellow-400">{t.rating > 0 ? `⭐ ${parseFloat(t.rating).toFixed(1)}` : '—'}</td>
                    <td className="px-4 py-3 text-slate-400">{t.totalJobsDone}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => removeTech(t.id)}
                        className="text-xs px-2 py-1 rounded bg-red-500/20 text-red-400 hover:bg-red-500/30">
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination pagination={pagination} onPageChange={(p) => { setPage(p); fetch(p); }} />
        </>
      )}
    </div>
  );
}
