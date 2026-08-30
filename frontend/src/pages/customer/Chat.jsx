import { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../../lib/api';
import { PageSpinner } from '../../components/Spinner';

export default function CustomerChat() {
  const { id } = useParams();
  const [messages, setMessages] = useState([]);
  const [meta, setMeta] = useState(null);
  const [myId, setMyId] = useState(null);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  const fetchMessages = async (silent = false) => {
    try {
      const { data } = await api.get(`/chat/${id}`);
      setMessages(data.messages);
      setMeta(data.request);
      setMyId(data.myId);
      if (!silent) setLoading(false);
    } catch (err) {
      if (!silent) { toast.error(err.response?.data?.error || 'Cannot load chat'); setLoading(false); }
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(() => fetchMessages(true), 5000);
    return () => clearInterval(interval);
  }, [id]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setSending(true);
    try {
      await api.post(`/chat/${id}`, { message: text.trim() });
      setText('');
      fetchMessages(true);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to send');
    } finally {
      setSending(false);
    }
  };

  if (loading) return <PageSpinner />;

  return (
    <div className="max-w-2xl mx-auto flex flex-col h-[calc(100vh-6rem)]">
      {/* Header */}
      <div className="flex items-center gap-4 mb-4">
        <Link to={`/requests/${id}`} className="text-slate-400 hover:text-white">←</Link>
        <div>
          <h1 className="font-bold text-white">Chat — {meta?.ticketNumber}</h1>
          <p className="text-xs text-slate-400">
            {meta?.technician ? `Technician: ${meta.technician.name}` : 'Waiting for technician'}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 bg-slate-900 rounded-xl border border-slate-800 p-4">
        {messages.length === 0 && (
          <p className="text-center text-slate-500 py-10">No messages yet. Say hello! 👋</p>
        )}
        {messages.map(m => {
          const isMe = m.senderId === myId;
          return (
            <div key={m.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                isMe ? 'bg-blue-600 text-white rounded-br-sm' : 'bg-slate-800 text-slate-100 rounded-bl-sm'
              }`}>
                {!isMe && <p className="text-xs font-medium mb-1 text-slate-400">{m.sender?.name}</p>}
                <p className="text-sm">{m.message}</p>
                <p className={`text-xs mt-1 ${isMe ? 'text-blue-200' : 'text-slate-500'}`}>
                  {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={sendMessage} className="flex gap-3 mt-4">
        <input
          value={text} onChange={e => setText(e.target.value)}
          className="input-field flex-1"
          placeholder="Type a message…"
          disabled={sending}
        />
        <button type="submit" disabled={sending || !text.trim()} className="btn-primary px-5">
          {sending ? '…' : 'Send'}
        </button>
      </form>
    </div>
  );
}
