import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import api from '../../lib/api';
import StatusBadge from '../../components/StatusBadge';
import Pagination from '../../components/Pagination';
import { PageSpinner } from '../../components/Spinner';

export default function AdminPayments() {
  const [payments, setPayments]   = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading]     = useState(true);
  const [filter, setFilter]       = useState('awaiting_confirmation');
  const [page, setPage]           = useState(1);
  const [confirming, setConfirming] = useState(null);

  const fetch = (p = 1, status = filter) => {
    setLoading(true);
    const params = new URLSearchParams({ page: p, limit: 20 });
    if (status) params.append('status', status);
    api.get(`/payments/admin/history?${params}`)
      .then(r => { setPayments(r.data.data || []); setPagination(r.data.pagination); })
      .catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { fetch(1, filter); setPage(1); }, [filter]);

  const confirm = async (paymentId) => {
    setConfirming(paymentId);
    try {
      await api.put(`/payments/admin/confirm/${paymentId}`);
      toast.success('Payment confirmed!');
      fetch(page, filter);
    } catch (err) { toast.error(err.response?.data?.error || 'Failed to confirm'); }
    finally { setConfirming(null); }
  };

  const METHOD_ICONS = { stripe: '💳', mpesa: '📱', airtel_money: '📱', tigo_pesa: '📱', mtn_momo: '📱', binance: '🟡' };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Payments</h1>
        <p className="text-slate-400 mt-1">{pagination?.total ?? 0} records</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {[
          { value: 'awaiting_confirmation', label: 'Pending Confirmation' },
          { value: 'succeeded',             label: 'Confirmed' },
          { value: 'failed',                label: 'Failed' },
          { value: '',                      label: 'All' },
        ].map(f => (
          <button key={f.value} onClick={() => setFilter(f.value)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filter === f.value ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}>
            {f.label}
          </button>
        ))}
      </div>

      {loading ? <PageSpinner /> : (
        <>
          {payments.length === 0 ? (
            <div className="text-center py-16 text-slate-400">No payments found</div>
          ) : (
            <div className="space-y-3">
              {payments.map(p => (
                <div key={p.id} className="card flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{METHOD_ICONS[p.paymentMethod] || '💰'}</span>
                      <span className="font-medium text-white">{p.customer}</span>
                      <StatusBadge status={p.status} />
                    </div>
                    <div className="text-xs text-slate-500 space-y-0.5">
                      <p>Ticket: <span className="font-mono text-slate-400">{p.ticketNumber}</span> · {p.title}</p>
                      <p>Method: <span className="text-slate-300">{p.paymentMethod.replace('_', ' ')}</span> · Amount: <span className="text-white font-semibold">{p.amount.toFixed(2)} {p.currency?.toUpperCase()}</span></p>
                      {p.providerRef && <p>Ref: <span className="font-mono text-slate-400 text-xs break-all">{p.providerRef}</span></p>}
                      {p.cryptoNetwork && <p>Network: <span className="text-yellow-400">{p.cryptoNetwork}</span></p>}
                      <p>{new Date(p.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                  {p.status === 'awaiting_confirmation' && (
                    <button onClick={() => confirm(p.id)} disabled={confirming === p.id}
                      className="btn-success text-sm px-4 py-2 flex-shrink-0">
                      {confirming === p.id ? '…' : '✅ Confirm'}
                    </button>
                  )}
                  {p.receiptUrl && (
                    <a href={p.receiptUrl} target="_blank" rel="noreferrer" className="text-sm text-blue-400 hover:text-blue-300 flex-shrink-0">
                      Receipt
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
          <Pagination pagination={pagination} onPageChange={(p) => { setPage(p); fetch(p, filter); }} />
        </>
      )}
    </div>
  );
}
