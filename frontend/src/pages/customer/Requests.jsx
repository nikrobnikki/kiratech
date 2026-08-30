import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../lib/api';
import StatusBadge from '../../components/StatusBadge';
import Pagination from '../../components/Pagination';
import EmptyState from '../../components/EmptyState';
import { PageSpinner } from '../../components/Spinner';

const STATUSES = ['', 'pending', 'assigned', 'accepted', 'in_progress', 'completed', 'cancelled', 'rejected'];

export default function CustomerRequests() {
  const [requests, setRequests] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [page, setPage] = useState(1);

  const fetchRequests = (p = 1, status = filter) => {
    setLoading(true);
    const params = new URLSearchParams({ page: p, limit: 10 });
    if (status) params.append('status', status);
    api.get(`/user/requests?${params}`)
      .then(r => { setRequests(r.data.data || []); setPagination(r.data.pagination); })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchRequests(1, filter); setPage(1); }, [filter]);

  const handlePage = (p) => { setPage(p); fetchRequests(p, filter); };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">My Requests</h1>
          <p className="text-slate-400 mt-1">{pagination?.total ?? 0} total tickets</p>
        </div>
        <Link to="/requests/new" className="btn-primary text-sm">+ New Request</Link>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {STATUSES.map(s => (
          <button key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filter === s ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {s === '' ? 'All' : s.replace('_', ' ')}
          </button>
        ))}
      </div>

      {loading ? <PageSpinner /> : (
        <>
          {requests.length === 0 ? (
            <EmptyState
              icon="🎫"
              title="No requests found"
              description="Submit your first IT support request"
              action={<Link to="/requests/new" className="btn-primary text-sm px-4 py-2">New Request</Link>}
            />
          ) : (
            <div className="space-y-3">
              {requests.map(r => (
                <Link key={r.id} to={`/requests/${r.id}`}
                  className="card flex items-center justify-between hover:border-slate-600 transition-colors p-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-3">
                      <p className="font-semibold text-white truncate">{r.title}</p>
                      <StatusBadge status={r.status} />
                    </div>
                    <div className="flex gap-4 mt-1 text-xs text-slate-500">
                      <span>{r.ticketNumber}</span>
                      <span>{r.service?.name}</span>
                      <span>{new Date(r.createdAt).toLocaleDateString()}</span>
                      {r.paymentStatus && r.paymentStatus !== 'unpaid' && <StatusBadge status={r.paymentStatus} />}
                    </div>
                    {r.technician && (
                      <p className="text-xs text-slate-500 mt-0.5">
                        Technician: {r.technician.user?.name}
                      </p>
                    )}
                  </div>
                  <span className="text-slate-500 ml-4">→</span>
                </Link>
              ))}
            </div>
          )}
          <Pagination pagination={pagination} onPageChange={handlePage} />
        </>
      )}
    </div>
  );
}
