import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../../lib/api';
import StatusBadge from '../../components/StatusBadge';
import { PageSpinner } from '../../components/Spinner';

export default function AdminRequestDetail() {
  const { id } = useParams();
  const [request, setRequest]   = useState(null);
  const [technicians, setTechs] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [selectedTech, setSelectedTech] = useState('');
  const [adminNotes, setAdminNotes]     = useState('');
  const [assigning, setAssigning]       = useState(false);
  const [finalCost, setFinalCost]       = useState('');
  const [settingCost, setSettingCost]   = useState(false);
  const [cancelling, setCancelling]     = useState(false);

  const fetch = () => {
    Promise.all([
      api.get(`/admin/requests/${id}`),
      api.get('/admin/technicians?limit=100'),
    ]).then(([reqRes, techRes]) => {
      setRequest(reqRes.data.request);
      setTechs(techRes.data.data || []);
      setFinalCost(reqRes.data.request.finalCost || '');
    }).catch(() => toast.error('Failed to load'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, [id]);

  const assign = async () => {
    if (!selectedTech) { toast.error('Select a technician'); return; }
    setAssigning(true);
    try {
      await api.put(`/admin/requests/${id}/assign`, { technicianId: selectedTech, adminNotes: adminNotes || undefined });
      toast.success('Technician assigned!');
      fetch();
    } catch (err) { toast.error(err.response?.data?.error || 'Failed'); }
    finally { setAssigning(false); }
  };

  const setCost = async (e) => {
    e.preventDefault();
    setSettingCost(true);
    try {
      await api.put(`/payments/admin/set-cost/${id}`, { finalCost: parseFloat(finalCost) });
      toast.success('Final cost set!');
      fetch();
    } catch (err) { toast.error(err.response?.data?.error || 'Failed'); }
    finally { setSettingCost(false); }
  };

  const cancel = async () => {
    if (!window.confirm('Cancel this request?')) return;
    setCancelling(true);
    try {
      await api.put(`/admin/requests/${id}/cancel`);
      toast.success('Request cancelled');
      fetch();
    } catch (err) { toast.error(err.response?.data?.error || 'Failed'); }
    finally { setCancelling(false); }
  };

  if (loading) return <PageSpinner />;
  if (!request) return <div className="text-center text-slate-400 py-20">Request not found</div>;

  const canAssign  = ['pending', 'rejected'].includes(request.status);
  const canCancel  = !['completed', 'cancelled'].includes(request.status);
  const canSetCost = request.status === 'completed' && request.paymentStatus !== 'paid';

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <Link to="/admin/requests" className="text-sm text-slate-400 hover:text-white mb-2 inline-block">← Back</Link>
          <h1 className="text-xl font-bold text-white">{request.title}</h1>
          <p className="text-slate-400 text-sm font-mono mt-1">{request.ticketNumber}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <StatusBadge status={request.status} />
          <StatusBadge status={request.paymentStatus} />
        </div>
      </div>

      {/* Customer */}
      {request.customer && (
        <div className="card">
          <h2 className="font-semibold text-white mb-3">Customer</h2>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div><span className="text-slate-500">Name</span><p className="text-white">{request.customer.name}</p></div>
            <div><span className="text-slate-500">Email</span><p className="text-white">{request.customer.email}</p></div>
            {request.customer.phone && <div><span className="text-slate-500">Phone</span><p className="text-white">{request.customer.phone}</p></div>}
          </div>
        </div>
      )}

      {/* Details */}
      <div className="card space-y-3">
        <h2 className="font-semibold text-white">Request Details</h2>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div><span className="text-slate-500">Service</span><p className="text-white">{request.service?.name}</p></div>
          <div><span className="text-slate-500">Priority</span><p className="text-white capitalize">{request.priority}</p></div>
          <div><span className="text-slate-500">Submitted</span><p className="text-white">{new Date(request.createdAt).toLocaleString()}</p></div>
          {request.location && <div><span className="text-slate-500">Location</span><p className="text-white">{request.location}</p></div>}
        </div>
        <div><p className="text-slate-500 text-sm mb-1">Description</p>
          <p className="text-slate-200 text-sm whitespace-pre-wrap">{request.description}</p>
        </div>
        {request.technicianNotes && (
          <div className="bg-slate-800 rounded-lg p-3">
            <p className="text-xs text-slate-500 mb-1">Technician notes</p>
            <p className="text-slate-200 text-sm">{request.technicianNotes}</p>
          </div>
        )}
      </div>

      {/* Assigned technician */}
      {request.technician && (
        <div className="card">
          <h2 className="font-semibold text-white mb-3">Assigned Technician</h2>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
              {request.technician.user?.name?.[0]}
            </div>
            <div>
              <p className="font-medium text-white">{request.technician.user?.name}</p>
              <p className="text-sm text-slate-400">{request.technician.user?.phone}</p>
            </div>
          </div>
        </div>
      )}

      {/* Assign */}
      {canAssign && (
        <div className="card">
          <h2 className="font-semibold text-white mb-4">Assign Technician</h2>
          <div className="space-y-3">
            <select className="input-field" value={selectedTech} onChange={e => setSelectedTech(e.target.value)}>
              <option value="">— Select technician —</option>
              {technicians.map(t => (
                <option key={t.id} value={t.id}>
                  {t.user?.name} ({t.availability}) — {t.specialization || 'General'}
                </option>
              ))}
            </select>
            <textarea rows={2} className="input-field resize-none" value={adminNotes}
              onChange={e => setAdminNotes(e.target.value)} placeholder="Admin notes for the technician (optional)" />
            <button onClick={assign} disabled={assigning || !selectedTech} className="btn-primary w-full py-2.5">
              {assigning ? 'Assigning…' : 'Assign Technician'}
            </button>
          </div>
        </div>
      )}

      {/* Set final cost */}
      {canSetCost && (
        <form onSubmit={setCost} className="card space-y-3">
          <h2 className="font-semibold text-white">Set Final Cost</h2>
          <div className="flex gap-3">
            <input type="number" min={0} step="0.01" required className="input-field flex-1"
              placeholder="Amount in USD" value={finalCost} onChange={e => setFinalCost(e.target.value)} />
            <button type="submit" disabled={settingCost} className="btn-success px-6">
              {settingCost ? '…' : 'Set Cost'}
            </button>
          </div>
        </form>
      )}

      {/* Confirm payment */}
      {request.paymentStatus === 'unpaid' && request.status === 'completed' && (
        <div className="card">
          <h2 className="font-semibold text-white mb-3">Pending Payments</h2>
          <p className="text-slate-400 text-sm">Check the payments section to confirm mobile money / crypto payments.</p>
          <Link to="/admin/payments" className="mt-3 inline-block text-sm text-blue-400 hover:text-blue-300">Go to Payments →</Link>
        </div>
      )}

      {/* Review */}
      {request.review && (
        <div className="card">
          <h2 className="font-semibold text-white mb-2">Customer Review</h2>
          <div className="flex gap-1 mb-1">{Array.from({ length: 5 }, (_, i) => (
            <span key={i} className={i < request.review.rating ? 'text-yellow-400' : 'text-slate-700'}>⭐</span>
          ))}</div>
          {request.review.comment && <p className="text-slate-300 text-sm">{request.review.comment}</p>}
        </div>
      )}

      {/* Cancel */}
      {canCancel && (
        <button onClick={cancel} disabled={cancelling} className="btn-danger w-full py-2.5">
          {cancelling ? 'Cancelling…' : '✖ Cancel Request'}
        </button>
      )}
    </div>
  );
}
