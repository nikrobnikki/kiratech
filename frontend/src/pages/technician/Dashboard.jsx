import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../lib/api';
import { PageSpinner } from '../../components/Spinner';
import StatusBadge from '../../components/StatusBadge';

export default function TechnicianDashboard() {
  const [stats, setStats]   = useState(null);
  const [tasks, setTasks]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/technician/dashboard-stats'),
      api.get('/technician/tasks?limit=5'),
    ]).then(([sRes, tRes]) => {
      setStats(sRes.data.stats);
      setTasks(tRes.data.data || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <PageSpinner />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Technician Dashboard</h1>
        <p className="text-slate-400 mt-1">Overview of your assigned tasks</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Tasks',   value: stats?.total,       color: 'text-blue-400' },
          { label: 'Assigned',      value: stats?.pending,     color: 'text-yellow-400' },
          { label: 'In Progress',   value: stats?.inProgress,  color: 'text-purple-400' },
          { label: 'Completed',     value: stats?.completed,   color: 'text-green-400' },
        ].map(s => (
          <div key={s.label} className="card text-center">
            <p className={`text-3xl font-bold ${s.color}`}>{s.value ?? 0}</p>
            <p className="text-sm text-slate-400 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {stats?.rating > 0 && (
        <div className="card flex items-center gap-4">
          <div className="text-4xl">⭐</div>
          <div>
            <p className="text-2xl font-bold text-white">{parseFloat(stats.rating).toFixed(1)}</p>
            <p className="text-slate-400 text-sm">Average rating</p>
          </div>
        </div>
      )}

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-white">Recent Tasks</h2>
          <Link to="/technician/tasks" className="text-sm text-purple-400 hover:text-purple-300">View all →</Link>
        </div>
        {tasks.length === 0 ? (
          <p className="text-slate-400 text-center py-10">No tasks assigned yet</p>
        ) : (
          <div className="space-y-3">
            {tasks.map(t => (
              <Link key={t.id} to={`/technician/tasks/${t.id}`}
                className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors">
                <div className="min-w-0">
                  <p className="font-medium text-white truncate">{t.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{t.ticketNumber} · {t.customer?.name}</p>
                </div>
                <StatusBadge status={t.status} />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
