import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../lib/api';
import StatusBadge from '../../components/StatusBadge';
import Pagination from '../../components/Pagination';
import EmptyState from '../../components/EmptyState';
import { PageSpinner } from '../../components/Spinner';

const STATUSES = ['', 'assigned', 'accepted', 'in_progress', 'completed'];

export default function TechnicianTasks() {
  const [tasks, setTasks]         = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading]     = useState(true);
  const [filter, setFilter]       = useState('');
  const [page, setPage]           = useState(1);

  const fetch = (p = 1, status = filter) => {
    setLoading(true);
    const params = new URLSearchParams({ page: p, limit: 10 });
    if (status) params.append('status', status);
    api.get(`/technician/tasks?${params}`)
      .then(r => { setTasks(r.data.data || []); setPagination(r.data.pagination); })
      .catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { fetch(1, filter); setPage(1); }, [filter]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">My Tasks</h1>
        <p className="text-slate-400 mt-1">{pagination?.total ?? 0} total</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {STATUSES.map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filter === s ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}>
            {s === '' ? 'All' : s.replace('_', ' ')}
          </button>
        ))}
      </div>

      {loading ? <PageSpinner /> : (
        <>
          {tasks.length === 0 ? (
            <EmptyState icon="🔧" title="No tasks" description="No tasks match the selected filter" />
          ) : (
            <div className="space-y-3">
              {tasks.map(t => (
                <Link key={t.id} to={`/technician/tasks/${t.id}`}
                  className="card flex items-center justify-between hover:border-slate-600 transition-colors p-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-3">
                      <p className="font-semibold text-white truncate">{t.title}</p>
                      <StatusBadge status={t.status} />
                    </div>
                    <div className="flex gap-4 mt-1 text-xs text-slate-500">
                      <span>{t.ticketNumber}</span>
                      <span>{t.customer?.name}</span>
                      <span>{t.service?.name}</span>
                      <span className="capitalize">{t.priority}</span>
                    </div>
                  </div>
                  <span className="text-slate-500 ml-4">→</span>
                </Link>
              ))}
            </div>
          )}
          <Pagination pagination={pagination} onPageChange={(p) => { setPage(p); fetch(p); }} />
        </>
      )}
    </div>
  );
}
