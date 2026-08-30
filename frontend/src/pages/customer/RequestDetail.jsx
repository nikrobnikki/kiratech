import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../../lib/api';
import StatusBadge from '../../components/StatusBadge';
import { PageSpinner } from '../../components/Spinner';

export default function RequestDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetch = () => {
    api.get(`/user/requests/${id}`)
      .then(r => setRequest(r.data.request))
      .catch(() => toast.error('Request not found'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, [id]);

  const handleReview = async (e) => {
    e.preventDefault();
    setSubmittingReview(true);
    try {
      await api.post(`/user/requests/${id}/review`, { rating, comment });
      toast.success('Review submitted!');
      fetch();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this request? This cannot be undone.')) return;
    setDeleting(true);
    try {
      await api.delete(`/user/requests/${id}`);
      toast.success('Request deleted');
      navigate('/requests');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Cannot delete');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <PageSpinner />;
  if (!request)  return <div className="text-center text-slate-400 py-20">Request not found</div>;

  const canChat    = ['assigned', 'accepted', 'in_progress', 'completed'].includes(request.status) && request.technician;
  const canPay     = request.status === 'completed' && request.paymentStatus === 'unpaid' && request.finalCost;
  const canDelete  = ['completed', 'cancelled'].includes(request.status);
  const canReview  = request.status === 'completed' && !request.review;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <Link to="/requests" className="text-sm text-slate-400 hover:text-white mb-2 inline-block">← Back to requests</Link>
          <h1 className="text-xl font-bold text-white">{request.title}</h1>
          <p className="text-slate-400 text-sm mt-1">Ticket: {request.ticketNumber}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <StatusBadge status={request.status} />
          <StatusBadge status={request.paymentStatus} />
        </div>
      </div>

      {/* Details */}
      <div className="card space-y-3">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div><span className="text-slate-500">Service</span><p className="text-white font-medium">{request.service?.name}</p></div>
          <div><span className="text-slate-500">Priority</span><p className="text-white font-medium capitalize">{request.priority}</p></div>
          <div><span className="text-slate-500">Submitted</span><p className="text-white font-medium">{new Date(request.createdAt).toLocaleString()}</p></div>
          {request.location && <div><span className="text-slate-500">Location</span><p className="text-white font-medium">{request.location}</p></div>}
          {request.finalCost && <div><span className="text-slate-500">Final Cost</span><p className="text-white font-medium">${parseFloat(request.finalCost).toFixed(2)}</p></div>}
        </div>

        <div>
          <p className="text-slate-500 text-sm mb-1">Description</p>
          <p className="text-slate-200 text-sm whitespace-pre-wrap">{request.description}</p>
        </div>

        {request.technicianNotes && (
          <div className="bg-slate-800 rounded-lg p-3">
            <p className="text-xs text-slate-500 mb-1">Technician notes</p>
            <p className="text-slate-200 text-sm">{request.technicianNotes}</p>
          </div>
        )}
      </div>

      {/* Technician */}
      {request.technician && (
        <div className="card">
          <h2 className="font-semibold text-white mb-3">Assigned Technician</h2>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
              {request.technician.user?.name?.[0]}
            </div>
            <div>
              <p className="font-medium text-white">{request.technician.user?.name}</p>
              <p className="text-sm text-slate-400">{request.technician.user?.phone}</p>
              {request.technician.specialization && <p className="text-xs text-slate-500">{request.technician.specialization}</p>}
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        {canChat && <Link to={`/requests/${id}/chat`} className="btn-primary flex-1 text-center py-2.5">💬 Open Chat</Link>}
        {canPay  && <Link to={`/requests/${id}/pay`}  className="btn-success flex-1 text-center py-2.5">💳 Pay Now — ${parseFloat(request.finalCost).toFixed(2)}</Link>}
        {canDelete && (
          <button onClick={handleDelete} disabled={deleting} className="btn-danger text-sm px-4 py-2.5">
            {deleting ? 'Deleting…' : '🗑 Delete'}
          </button>
        )}
      </div>

      {/* Review */}
      {canReview && (
        <div className="card">
          <h2 className="font-semibold text-white mb-4">Leave a Review</h2>
          <form onSubmit={handleReview} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Rating</label>
              <div className="flex gap-2">
                {[1,2,3,4,5].map(n => (
                  <button key={n} type="button"
                    onClick={() => setRating(n)}
                    className={`text-2xl transition-transform hover:scale-110 ${n <= rating ? 'opacity-100' : 'opacity-30'}`}>
                    ⭐
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Comment (optional)</label>
              <textarea rows={3} className="input-field resize-none" value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder="How was the service?" />
            </div>
            <button type="submit" disabled={submittingReview} className="btn-primary">
              {submittingReview ? 'Submitting…' : 'Submit Review'}
            </button>
          </form>
        </div>
      )}

      {request.review && (
        <div className="card">
          <h2 className="font-semibold text-white mb-2">Your Review</h2>
          <div className="flex gap-1 mb-2">{Array.from({ length: 5 }, (_, i) => (
            <span key={i} className={i < request.review.rating ? 'text-yellow-400' : 'text-slate-700'}>⭐</span>
          ))}</div>
          {request.review.comment && <p className="text-slate-300 text-sm">{request.review.comment}</p>}
        </div>
      )}
    </div>
  );
}
