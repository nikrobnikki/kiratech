import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../../lib/api';
import StatusBadge from '../../components/StatusBadge';
import Pagination from '../../components/Pagination';
import { PageSpinner } from '../../components/Spinner';
import EmptyState from '../../components/EmptyState';

const STATUSES = ['', 'pending', 'assigned', 'accepted', 'in_progress', 'completed', 'cancelled', 'rejected'];

export default function AdminRequests() {
  const [searchParams] = useSearchParams();
  const initialStatus = searchParams.get('status') || '';
  const [requests, setRequests]   = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading]     = useState(true);
  const [filter, setFilter]       = useState(initialStatus);
  const [page, setPage]           = useState(1);

  const fetch = (p = 1, status = filter) => {
    setLoading(true);
    const params = new URLSearchParams({ page: p, limit: 15 });
    if (status) params.append('status', status);
    api.get(`/admin/requests?${params}`)
      .then(r => { setRequests(r.data.data || []); setPagination(r.data.pagination); })
      .catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { fetch(1, filter); setPage(1); }, [filter]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Service Requests</h1>
        <p className="text-slate-400 mt-1">{pagination?.total ?? 0} total</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {STATUSES.map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filter === s ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}>
            {s === '' ? 'All' : s.replace('_', ' ')}
          </button>
        ))}
      </div>

      {loading ? <PageSpinner /> : (
        <>
          {requests.length === 0 ? (
            <EmptyState icon="🎫" title="No requests" description="No requests match this filter" />
          ) : (
            <div className="card overflow-x-auto p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-slate-500 text-xs uppercase border-b border-slate-800">
                    {['Ticket','Customer','Service','Status','Priority','Technician','Date'].map(h => (
                      <th key={h} className="text-left px-4 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {requests.map(r => (
                    <tr key={r.id} className="hover:bg-slate-800/40">
                      <td className="px-4 py-3">
                        <Link to={`/admin/requests/${r.id}`} className="text-blue-400 hover:text-blue-300 font-mono text-xs">{r.ticketNumber}</Link>
                      </td>
                      <td className="px-4 py-3 text-slate-300">{r.customer?.name}</td>
                      <td className="px-4 py-3 text-slate-400 max-w-[150px] truncate">{r.service?.name}</td>
                      <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                      <td className="px-4 py-3 text-slate-400 capitalize">{r.priority}</td>
                      <td className="px-4 py-3 text-slate-400">{r.technician?.user?.name || <span className="text-slate-600">—</span>}</td>
                      <td className="px-4 py-3 text-slate-500 text-xs">{new Date(r.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <Pagination pagination={pagination} onPageChange={(p) => { setPage(p); fetch(p); }} />
        </>
      )}
    </div>
  );
}
