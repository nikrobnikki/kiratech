import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../../lib/api';
import StatusBadge from '../../components/StatusBadge';
import { PageSpinner } from '../../components/Spinner';

export default function TechnicianTaskDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes]   = useState('');
  const [working, setWorking] = useState(false);

  const fetch = () => {
    api.get(`/technician/tasks/${id}`)
      .then(r => { setTask(r.data.request); setNotes(r.data.request.technicianNotes || ''); })
      .catch(() => toast.error('Task not found'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, [id]);

  const doAccept = async () => {
    setWorking(true);
    try {
      await api.put(`/technician/tasks/${id}/accept`);
      toast.success('Task accepted!');
      fetch();
    } catch (err) { toast.error(err.response?.data?.error || 'Failed'); }
    finally { setWorking(false); }
  };

  const doReject = async () => {
    if (!window.confirm('Reject this task? Admin will reassign it.')) return;
    setWorking(true);
    try {
      await api.put(`/technician/tasks/${id}/reject`);
      toast.success('Task rejected');
      navigate('/technician/tasks');
    } catch (err) { toast.error(err.response?.data?.error || 'Failed'); }
    finally { setWorking(false); }
  };

  const updateStatus = async (status) => {
    setWorking(true);
    try {
      await api.put(`/technician/tasks/${id}/status`, { status, notes: notes || undefined });
      toast.success(`Status updated to ${status.replace('_', ' ')}`);
      fetch();
    } catch (err) { toast.error(err.response?.data?.error || 'Failed to update status'); }
    finally { setWorking(false); }
  };

  if (loading) return <PageSpinner />;
  if (!task)   return <div className="text-center text-slate-400 py-20">Task not found</div>;

  const canChat = ['assigned','accepted','in_progress','completed'].includes(task.status);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <Link to="/technician/tasks" className="text-sm text-slate-400 hover:text-white mb-2 inline-block">← Back to tasks</Link>
          <h1 className="text-xl font-bold text-white">{task.title}</h1>
          <p className="text-slate-400 text-sm mt-1">{task.ticketNumber}</p>
        </div>
        <StatusBadge status={task.status} />
      </div>

      {/* Customer */}
      {task.customer && (
        <div className="card">
          <h2 className="font-semibold text-white mb-3">Customer</h2>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
              {task.customer.name?.[0]}
            </div>
            <div>
              <p className="font-medium text-white">{task.customer.name}</p>
              <p className="text-sm text-slate-400">{task.customer.phone || task.customer.email}</p>
              {task.location && <p className="text-xs text-slate-500 mt-0.5">📍 {task.location}</p>}
            </div>
          </div>
        </div>
      )}

      {/* Details */}
      <div className="card space-y-3">
        <h2 className="font-semibold text-white">Task Details</h2>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div><span className="text-slate-500">Service</span><p className="text-white font-medium">{task.service?.name}</p></div>
          <div><span className="text-slate-500">Priority</span><p className="text-white font-medium capitalize">{task.priority}</p></div>
          {task.preferredDate && <div><span className="text-slate-500">Preferred Date</span><p className="text-white font-medium">{new Date(task.preferredDate).toLocaleDateString()}</p></div>}
          {task.preferredTime && <div><span className="text-slate-500">Preferred Time</span><p className="text-white font-medium">{task.preferredTime}</p></div>}
        </div>
        <div>
          <p className="text-slate-500 text-sm mb-1">Description</p>
          <p className="text-slate-200 text-sm whitespace-pre-wrap">{task.description}</p>
        </div>
      </div>

      {/* Technician notes */}
      {['accepted','in_progress'].includes(task.status) && (
        <div className="card">
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Your Notes (optional)</label>
          <textarea rows={3} className="input-field resize-none" value={notes}
            onChange={e => setNotes(e.target.value)} placeholder="Add work notes, findings, or updates…" />
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        {task.status === 'assigned' && <>
          <button onClick={doAccept} disabled={working} className="btn-success flex-1 py-2.5">✅ Accept Task</button>
          <button onClick={doReject} disabled={working} className="btn-danger px-6 py-2.5">✖ Reject</button>
        </>}
        {task.status === 'accepted' && (
          <button onClick={() => updateStatus('in_progress')} disabled={working} className="btn-primary flex-1 py-2.5">
            {working ? 'Updating…' : '▶ Start Work'}
          </button>
        )}
        {task.status === 'in_progress' && (
          <button onClick={() => updateStatus('completed')} disabled={working} className="btn-success flex-1 py-2.5">
            {working ? 'Updating…' : '✅ Mark Completed'}
          </button>
        )}
        {canChat && (
          <Link to={`/technician/tasks/${id}/chat`} className="btn-secondary flex-1 text-center py-2.5">
            💬 Chat with Customer
          </Link>
        )}
      </div>
    </div>
  );
}
