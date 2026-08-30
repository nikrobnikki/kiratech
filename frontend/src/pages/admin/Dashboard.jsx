import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../lib/api';
import StatusBadge from '../../components/StatusBadge';
import { PageSpinner } from '../../components/Spinner';

export default function AdminDashboard() {
  const [data, setData]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/dashboard-stats').then(r => setData(r.data))
      .catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <PageSpinner />;

  const s = data?.stats || {};

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
        <p className="text-slate-400 mt-1">System overview</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {[
          { label: 'Customers',     value: s.totalUsers,        color: 'text-blue-400',   to: '/admin/users' },
          { label: 'Technicians',   value: s.totalTechnicians,  color: 'text-purple-400', to: '/admin/technicians' },
          { label: 'Total Requests',value: s.totalRequests,     color: 'text-slate-300',  to: '/admin/requests' },
          { label: 'Pending',       value: s.pendingRequests,   color: 'text-yellow-400', to: '/admin/requests?status=pending' },
          { label: 'In Progress',   value: s.inProgressRequests,color: 'text-purple-400', to: '/admin/requests?status=in_progress' },
          { label: 'Completed',     value: s.completedRequests, color: 'text-green-400',  to: '/admin/requests?status=completed' },
        ].map(card => (
          <Link key={card.label} to={card.to} className="card text-center hover:border-slate-600 transition-colors">
            <p className={`text-3xl font-bold ${card.color}`}>{card.value ?? 0}</p>
            <p className="text-xs text-slate-400 mt-1">{card.label}</p>
          </Link>
        ))}
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-white">Recent Requests</h2>
          <Link to="/admin/requests" className="text-sm text-red-400 hover:text-red-300">View all →</Link>
        </div>
        {!data?.recentRequests?.length ? (
          <p className="text-slate-400 text-center py-8">No requests yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-slate-500 text-xs uppercase border-b border-slate-800">
                  <th className="text-left py-2 pr-4">Ticket</th>
                  <th className="text-left py-2 pr-4">Customer</th>
                  <th className="text-left py-2 pr-4">Service</th>
                  <th className="text-left py-2 pr-4">Status</th>
                  <th className="text-left py-2">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {data.recentRequests.map(r => (
                  <tr key={r.id} className="hover:bg-slate-800/40">
                    <td className="py-3 pr-4">
                      <Link to={`/admin/requests/${r.id}`} className="text-blue-400 hover:text-blue-300 font-mono text-xs">{r.ticketNumber}</Link>
                    </td>
                    <td className="py-3 pr-4 text-slate-300">{r.customer?.name}</td>
                    <td className="py-3 pr-4 text-slate-400">{r.service?.name}</td>
                    <td className="py-3 pr-4"><StatusBadge status={r.status} /></td>
                    <td className="py-3 text-slate-500">{new Date(r.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { to: '/admin/requests?status=pending', label: 'Review Pending', icon: '⏳', color: 'yellow' },
          { to: '/admin/technicians',             label: 'Add Technician', icon: '🔧', color: 'purple' },
          { to: '/admin/payments',                label: 'View Payments',  icon: '💳', color: 'green' },
          { to: '/admin/services',                label: 'Manage Services',icon: '⚙️', color: 'blue' },
        ].map(a => (
          <Link key={a.to} to={a.to} className="card hover:border-slate-600 transition-colors text-center group">
            <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">{a.icon}</div>
            <p className="text-sm font-medium text-slate-300">{a.label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
