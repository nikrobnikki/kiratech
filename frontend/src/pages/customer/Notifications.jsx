import { useState, useEffect } from 'react';
import api from '../../lib/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import RequestChat from '../../components/RequestChat';
import { BellIcon, CheckIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';

const typeIcon = {
  request_submitted:   '📤',
  request_assigned:    '👷',
  request_accepted:    '✅',
  request_in_progress: '🔧',
  request_completed:   '🎉',
  request_cancelled:   '❌',
  new_registration:    '👤',
  general:             '💬',
};

const typeLabel = {
  request_submitted:   'Submitted',
  request_assigned:    'Assigned',
  request_accepted:    'Accepted',
  request_in_progress: 'In Progress',
  request_completed:   'Completed',
  request_cancelled:   'Cancelled',
  new_registration:    'Registration',
  general:             'General',
};

const CHART_COLORS = [
  '#3b82f6', '#10b981', '#f59e0b', '#ef4444',
  '#8b5cf6', '#06b6d4', '#ec4899', '#64748b',
];

// Custom tooltip for BarChart
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-slate-800 border border-slate-600 rounded-xl px-3 py-2 text-xs text-white shadow-xl">
        <p className="font-bold mb-1">{label}</p>
        <p className="text-blue-300">{payload[0]?.value} notification{payload[0]?.value !== 1 ? 's' : ''}</p>
      </div>
    );
  }
  return null;
};

export default function CustomerNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount]     = useState(0);
  const [loading, setLoading]             = useState(true);

  const fetchNotifications = () => {
    api.get('/notifications')
      .then(({ data }) => {
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchNotifications(); }, []);

  const markAllRead = async () => {
    await api.put('/notifications/read-all');
    toast.success('All notifications marked as read');
    fetchNotifications();
  };

  const markRead = async (id) => {
    await api.put(`/notifications/${id}/read`);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    setUnreadCount(c => Math.max(0, c - 1));
  };

  // ── Chart data ──────────────────────────────────────────────────────────────
  // Bar chart: notifications per day (last 7 days)
  const barData = (() => {
    const days = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const key = d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
      days[key] = 0;
    }
    notifications.forEach(n => {
      const key = new Date(n.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
      if (key in days) days[key]++;
    });
    return Object.entries(days).map(([date, count]) => ({ date, count }));
  })();

  // Pie chart: notifications by type
  const pieData = (() => {
    const counts = {};
    notifications.forEach(n => {
      const label = typeLabel[n.type] || 'Other';
      counts[label] = (counts[label] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  })();

  const latestAssignedNotification = notifications
    .filter(n => n.type === 'request_assigned' && n.relatedId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];

  if (loading) return <LoadingSpinner text="Loading notifications..." />;

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <BellIcon className="h-6 w-6 text-blue-500" />
            Notifications
          </h1>
          {unreadCount > 0 && (
            <p className="text-sm text-blue-600 dark:text-blue-400 mt-0.5">
              {unreadCount} unread notification{unreadCount > 1 ? 's' : ''}
            </p>
          )}
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="btn-secondary text-sm gap-2">
            <CheckIcon className="h-4 w-4" />
            Mark All Read
          </button>
        )}
      </div>

      {/* Notification list */}
      {notifications.length === 0 ? (
        <div className="card-cyber p-12 text-center">
          <BellIcon className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <p className="text-slate-500 dark:text-slate-400">No notifications yet.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => (
            <div key={n.id}
              onClick={() => !n.isRead && markRead(n.id)}
              className={`card-cyber p-4 cursor-pointer transition-all duration-200 hover:shadow-cyber ${
                !n.isRead
                  ? 'border-l-4 border-blue-500 dark:border-blue-400'
                  : 'opacity-80 hover:opacity-100'
              }`}>
              <div className="flex items-start gap-3">
                <span className="text-xl flex-shrink-0 mt-0.5">{typeIcon[n.type] || '💬'}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-sm text-gray-900 dark:text-white ${!n.isRead ? 'font-bold' : 'font-medium'}`}>
                      {n.title}
                    </p>
                    {!n.isRead && <span className="h-2 w-2 rounded-full bg-blue-500 flex-shrink-0 mt-1.5" />}
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">{n.message}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">{new Date(n.createdAt).toLocaleString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Activity Charts ─────────────────────────────────────────────────── */}
      {notifications.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

          {/* Bar chart — last 7 days */}
          <div className="card-cyber p-5">
            <h2 className="font-bold text-gray-900 dark:text-white mb-1 text-sm">
              📊 Activity — Last 7 Days
            </h2>
            <p className="text-xs text-slate-400 mb-4">Notifications received per day</p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={barData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10, fill: '#94a3b8' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 10, fill: '#94a3b8' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} maxBarSize={36} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie chart — by type */}
          <div className="card-cyber p-5">
            <h2 className="font-bold text-gray-900 dark:text-white mb-1 text-sm">
              🥧 Notifications by Type
            </h2>
            <p className="text-xs text-slate-400 mb-2">Breakdown of all your notifications</p>
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="45%"
                    innerRadius={45}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend
                    formatter={(value) => (
                      <span style={{ fontSize: 11, color: '#94a3b8' }}>{value}</span>
                    )}
                    iconSize={8}
                    iconType="circle"
                  />
                  <Tooltip
                    formatter={(value, name) => [`${value} notifications`, name]}
                    contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 12, fontSize: 12 }}
                    labelStyle={{ color: '#fff' }}
                    itemStyle={{ color: '#94a3b8' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-48 flex items-center justify-center text-slate-400 text-sm">No data</div>
            )}
          </div>

          {/* Summary stats row */}
          <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Total',  value: notifications.length,                                  color: 'text-blue-600 dark:text-blue-400',   bg: '' },
              { label: 'Unread', value: unreadCount,                                           color: 'text-amber-600 dark:text-amber-400', bg: 'border-amber-200 dark:border-amber-800/40' },
              { label: 'Requests', value: notifications.filter(n => n.type.startsWith('request')).length, color: 'text-green-600 dark:text-green-400', bg: 'border-green-200 dark:border-green-800/40' },
              { label: 'Messages', value: notifications.filter(n => n.type === 'general').length, color: 'text-purple-600 dark:text-purple-400', bg: 'border-purple-200 dark:border-purple-800/40' },
            ].map(s => (
              <div key={s.label} className={`card-cyber p-4 ${s.bg}`}>
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">{s.label}</p>
                <p className={`text-3xl font-black mt-1 ${s.color}`}>{s.value}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick chat */}
      <div className="card-cyber p-5 border-t border-slate-200 dark:border-slate-700">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1">💬 Quick Chat</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
          Chat directly with your assigned technician about your latest request.
        </p>
        {latestAssignedNotification ? (
          <RequestChat
            requestId={latestAssignedNotification.relatedId}
            ticketNumber="Recent"
            myRole="customer"
            otherName="Technician"
            isAssigned={true}
          />
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 p-6 text-sm text-slate-500 dark:text-slate-400 text-center">
            Chat will appear here once a technician is assigned to your request.
          </div>
        )}
      </div>
    </div>
  );
}
