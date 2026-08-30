import { useState, useEffect, useRef, useCallback } from 'react';
import { PaperAirplaneIcon, ChatBubbleLeftRightIcon, XMarkIcon } from '@heroicons/react/24/outline';
import api from '../lib/api';
import toast from 'react-hot-toast';

/**
 * RequestChat — embedded chat widget between customer and technician
 * for a specific service request.
 *
 * Props:
 *   requestId   — the service request UUID
 *   ticketNumber — for display purposes
 *   myRole      — 'customer' | 'technician' | 'admin'
 *   otherName   — name of the other party (shown in header)
 *   isAssigned  — bool — disable if no technician assigned yet
 */
export default function RequestChat({ requestId, ticketNumber, myRole, otherName, isAssigned }) {
  const [open, setOpen]         = useState(false);
  const [messages, setMessages] = useState([]);
  const [myUserId, setMyUserId] = useState(null);
  const [input, setInput]       = useState('');
  const [sending, setSending]   = useState(false);
  const [unread, setUnread]     = useState(0);
  const bottomRef = useRef(null);
  const pollRef   = useRef(null);
  const inputRef  = useRef(null);

  // ── Fetch messages ──────────────────────────────────────────────────────────
  const fetchMessages = useCallback(async (silent = false) => {
    try {
      const { data } = await api.get(`/request-chat/${requestId}`);
      setMessages(data.messages || []);
      setMyUserId(data.myUserId);
      if (open) setUnread(0);
    } catch { /* silent */ }
  }, [requestId, open]);

  // ── Fetch unread count (when chat is closed) ────────────────────────────────
  const fetchUnread = useCallback(async () => {
    if (open) return;
    try {
      const { data } = await api.get(`/request-chat/${requestId}/unread`);
      setUnread(data.count || 0);
    } catch { /* silent */ }
  }, [requestId, open]);

  // Initial load + polling
  useEffect(() => {
    fetchMessages();
    fetchUnread();
    pollRef.current = setInterval(() => {
      if (open) fetchMessages(true); else fetchUnread();
    }, 7000);
    return () => clearInterval(pollRef.current);
  }, [fetchMessages, fetchUnread, open]);

  // Auto-scroll when messages update and chat is open
  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  // When chat opens: load + mark read + focus input
  const handleOpen = () => {
    setOpen(true);
    setUnread(0);
    fetchMessages();
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  // ── Send ────────────────────────────────────────────────────────────────────
  const send = async (e) => {
    e?.preventDefault();
    if (!input.trim() || sending) return;
    setSending(true);
    const text = input.trim();
    setInput('');
    try {
      const { data } = await api.post(`/request-chat/${requestId}`, { message: text });
      setMessages(prev => [...prev, data.message]);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to send');
      setInput(text);
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  };

  if (!isAssigned && myRole === 'customer') {
    return (
      <div className="card-cyber p-4 border-dashed">
        <div className="flex items-center gap-2 text-slate-400 text-sm">
          <ChatBubbleLeftRightIcon className="h-5 w-5" />
          Chat will be available once a technician is assigned.
        </div>
      </div>
    );
  }

  const label = myRole === 'customer'
    ? `Chat with Technician${otherName ? ` (${otherName})` : ''}`
    : `Chat with Customer${otherName ? ` (${otherName})` : ''}`;

  return (
    <div className="card-cyber overflow-hidden">
      {/* ── Header / Toggle ─────────────────────────────────────────────────── */}
      <button
        onClick={() => open ? setOpen(false) : handleOpen()}
        className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-blue-50/30 dark:hover:bg-slate-700/30 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <ChatBubbleLeftRightIcon className="h-5 w-5 text-blue-500" />
          <span className="font-bold text-gray-900 dark:text-white text-sm">{label}</span>
          {!open && unread > 0 && (
            <span className="h-5 min-w-5 px-1.5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center font-bold animate-pulse">
              {unread}
            </span>
          )}
          <span className="text-xs text-slate-400 font-mono">#{ticketNumber}</span>
        </div>
        <span className="text-slate-400 text-xs">{open ? '▲ Close' : '▼ Open'}</span>
      </button>

      {/* ── Chat Panel ──────────────────────────────────────────────────────── */}
      {open && (
        <div className="flex flex-col border-t border-blue-100 dark:border-slate-700" style={{ height: '380px' }}>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2.5 bg-slate-50 dark:bg-slate-950">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <ChatBubbleLeftRightIcon className="h-10 w-10 text-slate-300 dark:text-slate-600 mb-2" />
                <p className="text-slate-400 text-sm">No messages yet. Start the conversation!</p>
              </div>
            ) : messages.map((msg) => {
              const isMine = msg.senderId === myUserId;
              const time   = new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              const date   = new Date(msg.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' });
              return (
                <div key={msg.id} className={`flex items-end gap-2 ${isMine ? 'flex-row-reverse' : 'flex-row'}`}>
                  {/* Avatar */}
                  <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                    msg.senderRole === 'customer'
                      ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300'
                      : 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300'
                  }`}>
                    {msg.sender?.name?.[0]?.toUpperCase() || '?'}
                  </div>
                  <div className={`max-w-[75%] flex flex-col ${isMine ? 'items-end' : 'items-start'}`}>
                    {/* Name */}
                    <span className="text-xs text-slate-400 px-1 mb-0.5">
                      {isMine ? 'You' : msg.sender?.name}
                    </span>
                    {/* Bubble */}
                    <div className={`px-3.5 py-2 text-sm leading-relaxed ${
                      isMine
                        ? 'bg-blue-600 text-white rounded-2xl rounded-br-sm'
                        : 'bg-white dark:bg-slate-700 text-gray-800 dark:text-white border border-slate-200 dark:border-slate-600 rounded-2xl rounded-bl-sm'
                    }`}>
                      {msg.message}
                    </div>
                    <span className="text-xs text-slate-400 px-1 mt-0.5">{date} · {time}</span>
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <form onSubmit={send} className="flex items-end gap-2 px-3 py-2.5 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
            <textarea
              ref={inputRef}
              rows={1}
              className="flex-1 px-3.5 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-2xl text-sm text-gray-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Type a message…"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
            />
            <button
              type="submit"
              disabled={!input.trim() || sending}
              className="h-9 w-9 flex-shrink-0 flex items-center justify-center bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white rounded-full transition-all active:scale-95 disabled:opacity-50"
            >
              {sending
                ? <span className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <PaperAirplaneIcon className="h-4 w-4" />
              }
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
