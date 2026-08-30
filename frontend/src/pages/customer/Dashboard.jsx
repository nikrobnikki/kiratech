import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import api from '../../lib/api';
import StatusBadge from '../../components/StatusBadge';
import { PageSpinner } from '../../components/Spinner';

export default function CustomerDashboard() {
  const { user } = useAuthStore();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/user/requests?limit=5').then(r => {
      setRequests(r.data.data || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const stats = {
    total:      requests.length,
    pending:    requests.filter(r => r.status === 'pending').length,
    inProgress: requests.filter(r => ['assigned','accepted','in_progress'].includes(r.status)).length,
    completed:  requests.filter(r => r.status === 'completed').length,
  };

  if (loading) return <PageSpinner />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Welcome, {user?.name?.split(' ')[0]} 👋</h1>
        <p className="text-slate-400 mt-1">Here's a summary of your IT support requests</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Requests', value: stats.total,      color: 'text-blue-400' },
          { label: 'Pending',        value: stats.pending,    color: 'text-yellow-400' },
          { label: 'In Progress',    value: stats.inProgress, color: 'text-purple-400' },
          { label: 'Completed',      value: stats.completed,  color: 'text-green-400' },
        ].map(s => (
          <div key={s.label} className="card text-center">
            <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-sm text-slate-400 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Recent requests */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-white">Recent Requests</h2>
          <Link to="/requests" className="text-sm text-blue-400 hover:text-blue-300">View all →</Link>
        </div>
        {requests.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-4xl mb-3">🎫</p>
            <p className="text-slate-400 mb-4">No requests yet</p>
            <Link to="/requests/new" className="btn-primary text-sm px-4 py-2">Submit your first request</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {requests.map(r => (
              <Link key={r.id} to={`/requests/${r.id}`}
                className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors">
                <div className="min-w-0">
                  <p className="font-medium text-white truncate">{r.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{r.ticketNumber} · {r.service?.name}</p>
                </div>
                <StatusBadge status={r.status} />
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link to="/requests/new" className="card hover:border-blue-600 transition-colors group text-center">
          <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">➕</div>
          <p className="font-semibold text-white">New Request</p>
          <p className="text-xs text-slate-500 mt-1">Submit a new IT support request</p>
        </Link>
        <Link to="/requests" className="card hover:border-purple-600 transition-colors group text-center">
          <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">🎫</div>
          <p className="font-semibold text-white">My Requests</p>
          <p className="text-xs text-slate-500 mt-1">Track and manage your tickets</p>
        </Link>
        <Link to="/profile" className="card hover:border-green-600 transition-colors group text-center">
          <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">👤</div>
          <p className="font-semibold text-white">My Profile</p>
          <p className="text-xs text-slate-500 mt-1">Update your account details</p>
        </Link>
      </div>
    </div>
  );
}
