import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import api from '../../lib/api';
import { PageSpinner } from '../../components/Spinner';

const defaultForm = { name: '', description: '', category: 'standard', basePrice: '', estimatedDuration: '', icon: '', sortOrder: '' };

export default function AdminServices() {
  const [services, setServices]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [showForm, setShowForm]   = useState(false);
  const [form, setForm]           = useState(defaultForm);
  const [saving, setSaving]       = useState(false);

  const fetch = () => {
    api.get('/services').then(r => setServices(r.data.services || []))
      .catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        basePrice:  form.basePrice  ? parseFloat(form.basePrice)  : 0,
        sortOrder:  form.sortOrder  ? parseInt(form.sortOrder)     : 99,
      };
      await api.post('/services', payload);
      toast.success('Service created!');
      setForm(defaultForm);
      setShowForm(false);
      fetch();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to create service');
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (svc) => {
    try {
      if (svc.isActive) {
        await api.delete(`/services/${svc.id}`);
        toast.success('Service deactivated');
      } else {
        await api.put(`/services/${svc.id}`, { isActive: true });
        toast.success('Service activated');
      }
      fetch();
    } catch (err) { toast.error('Failed to update service'); }
  };

  if (loading) return <PageSpinner />;

  const standard = services.filter(s => s.category === 'standard');
  const premium  = services.filter(s => s.category === 'premium');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Services</h1>
          <p className="text-slate-400 mt-1">{services.length} active services</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary text-sm">
          {showForm ? 'Cancel' : '+ Add Service'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="card space-y-4">
          <h2 className="font-semibold text-white">New Service</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Name *</label>
              <input required className="input-field" value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Description</label>
              <textarea rows={2} className="input-field resize-none" value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Category *</label>
              <select className="input-field" value={form.category}
                onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                <option value="standard">Standard</option>
                <option value="premium">Premium</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Base Price (TZS)</label>
              <input type="number" min={0} className="input-field" value={form.basePrice}
                onChange={e => setForm(f => ({ ...f, basePrice: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Duration</label>
              <input className="input-field" placeholder="e.g. 1-3 hours" value={form.estimatedDuration}
                onChange={e => setForm(f => ({ ...f, estimatedDuration: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Icon (name)</label>
              <input className="input-field" placeholder="e.g. computer" value={form.icon}
                onChange={e => setForm(f => ({ ...f, icon: e.target.value }))} />
            </div>
          </div>
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? 'Creating…' : 'Create Service'}
          </button>
        </form>
      )}

      {[{ label: 'Standard Services', items: standard }, { label: 'Premium Services', items: premium }].map(group => (
        <div key={group.label}>
          <h2 className="font-semibold text-slate-400 text-sm uppercase tracking-wider mb-3">{group.label}</h2>
          <div className="space-y-3">
            {group.items.map(s => (
              <div key={s.id} className="card flex items-center justify-between">
                <div className="min-w-0">
                  <p className="font-medium text-white">{s.name}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{s.description?.slice(0, 80)}</p>
                  <div className="flex gap-3 text-xs text-slate-500 mt-1">
                    {s.basePrice > 0 && <span>TZS {s.basePrice.toLocaleString()}</span>}
                    {s.estimatedDuration && <span>{s.estimatedDuration}</span>}
                    <span className={s.isActive ? 'text-green-400' : 'text-slate-600'}>{s.isActive ? 'Active' : 'Inactive'}</span>
                  </div>
                </div>
                <button onClick={() => toggleActive(s)}
                  className={`text-xs px-3 py-1.5 rounded-lg ml-4 flex-shrink-0 ${
                    s.isActive
                      ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                      : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                  }`}>
                  {s.isActive ? 'Deactivate' : 'Activate'}
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
