import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import api from '../../lib/api';
import { PageSpinner } from '../../components/Spinner';
import EmptyState from '../../components/EmptyState';

export default function CustomerNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = () => {
    api.get('/user/notifications').then(r => setNotifications(r.data.notifications || []))
      .catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, []);

  const markAllRead = async () => {
    try {
      await api.put('/user/notifications/read-all');
      fetch();
    } catch {
      toast.error('Failed to mark as read');
    }
  };

  const unread = notifications.filter(n => !n.isRead).length;

  if (loading) return <PageSpinner />;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Notifications</h1>
          <p className="text-slate-400 mt-1">{unread} unread</p>
        </div>
        {unread > 0 && (
          <button onClick={markAllRead} className="btn-secondary text-sm px-4 py-2">
            Mark all read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <EmptyState icon="🔔" title="No notifications" description="We'll notify you when something happens with your requests." />
      ) : (
        <div className="space-y-2">
          {notifications.map(n => (
            <div key={n.id} className={`p-4 rounded-xl border transition-colors ${
              n.isRead ? 'bg-slate-900 border-slate-800' : 'bg-slate-900 border-blue-700/50 bg-blue-500/5'
            }`}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className={`font-medium text-sm ${n.isRead ? 'text-slate-300' : 'text-white'}`}>{n.title}</p>
                  <p className="text-sm text-slate-400 mt-0.5">{n.message}</p>
                </div>
                {!n.isRead && <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-1" />}
              </div>
              <p className="text-xs text-slate-600 mt-2">{new Date(n.createdAt).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
