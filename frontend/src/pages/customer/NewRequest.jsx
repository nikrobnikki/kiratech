import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../../lib/api';
import { PageSpinner } from '../../components/Spinner';

export default function NewRequest() {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    serviceId: '', title: '', description: '',
    priority: 'medium', location: '', preferredDate: '', preferredTime: '',
  });

  useEffect(() => {
    api.get('/services').then(r => setServices(r.data.services || []))
      .catch(() => toast.error('Failed to load services'))
      .finally(() => setLoadingServices(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = { ...form };
      if (!payload.preferredDate) delete payload.preferredDate;
      if (!payload.preferredTime) delete payload.preferredTime;
      if (!payload.location)      delete payload.location;
      const { data } = await api.post('/user/requests', payload);
      toast.success(`Request submitted! Ticket: ${data.request.ticketNumber}`);
      navigate(`/requests/${data.request.id}`);
    } catch (err) {
      toast.error(err.response?.data?.error || err.response?.data?.errors?.[0]?.msg || 'Failed to submit request');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingServices) return <PageSpinner />;

  const standard = services.filter(s => s.category === 'standard');
  const premium  = services.filter(s => s.category === 'premium');

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">New Service Request</h1>
        <p className="text-slate-400 mt-1">Describe your IT problem — we'll assign the best technician</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Service */}
        <div className="card">
          <h2 className="font-semibold text-white mb-4">Select a Service</h2>
          {[{ label: 'Standard Services', items: standard }, { label: 'Premium Services', items: premium }].map(group => (
            <div key={group.label} className="mb-4">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">{group.label}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {group.items.map(s => (
                  <label key={s.id}
                    className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                      form.serviceId === s.id
                        ? 'border-blue-500 bg-blue-500/10'
                        : 'border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    <input type="radio" name="serviceId" value={s.id} required
                      className="mt-0.5 accent-blue-500"
                      checked={form.serviceId === s.id}
                      onChange={e => setForm(f => ({ ...f, serviceId: e.target.value }))} />
                    <div className="min-w-0">
                      <p className="font-medium text-sm text-white">{s.name}</p>
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{s.description}</p>
                      {s.basePrice > 0 && (
                        <p className="text-xs text-blue-400 mt-1">From TZS {s.basePrice.toLocaleString()}</p>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Details */}
        <div className="card space-y-4">
          <h2 className="font-semibold text-white">Request Details</h2>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Title / Problem Summary *</label>
            <input required minLength={5} maxLength={200}
              className="input-field"
              placeholder="e.g. Laptop won't turn on after Windows update"
              value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Full Description *</label>
            <textarea required minLength={10} rows={4} className="input-field resize-none"
              placeholder="Describe the problem in detail — what happened, when it started, what you've tried…"
              value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Priority</label>
              <select className="input-field" value={form.priority}
                onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Preferred Date (optional)</label>
              <input type="date" className="input-field"
                value={form.preferredDate} onChange={e => setForm(f => ({ ...f, preferredDate: e.target.value }))} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Location (optional)</label>
            <input className="input-field" placeholder="e.g. Njiro Road, Arusha"
              value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} />
          </div>
        </div>

        <div className="flex gap-3">
          <button type="submit" disabled={submitting} className="btn-primary flex-1 py-2.5">
            {submitting ? 'Submitting…' : 'Submit Request'}
          </button>
          <Link to="/requests" className="btn-secondary px-6 py-2.5">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
