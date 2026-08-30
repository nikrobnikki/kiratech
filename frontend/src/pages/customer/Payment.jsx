import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../../lib/api';
import { PageSpinner } from '../../components/Spinner';

const STRIPE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

export default function PaymentPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [methods, setMethods] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Mobile money fields
  const [phone, setPhone] = useState('');
  const [providerRef, setProviderRef] = useState('');
  // Crypto fields
  const [network, setNetwork] = useState('TRC20');
  const [txHash, setTxHash] = useState('');

  useEffect(() => {
    Promise.all([
      api.get(`/user/requests/${id}`),
      api.get('/payments/methods'),
    ]).then(([reqRes, methodsRes]) => {
      setRequest(reqRes.data.request);
      setMethods(methodsRes.data.methods);
    }).catch(() => toast.error('Failed to load payment info'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleStripe = async () => {
    if (!STRIPE_KEY || STRIPE_KEY.includes('your')) {
      toast.error('Stripe is not configured. Use mobile money or crypto.');
      return;
    }
    setSubmitting(true);
    try {
      const { data } = await api.post('/payments/create-intent', { requestId: id });
      // Dynamically load Stripe
      const { loadStripe } = await import('@stripe/stripe-js');
      const stripe = await loadStripe(STRIPE_KEY);
      const result = await stripe.confirmCardPayment(data.clientSecret);
      if (result.error) {
        toast.error(result.error.message);
      } else {
        toast.success('Payment successful!');
        navigate(`/requests/${id}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Payment failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleMobileMoney = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/payments/mobile-money', {
        requestId: id, method: selected, phone,
        providerRef: providerRef || undefined,
      });
      toast.success('Payment submitted! Admin will confirm shortly.');
      navigate(`/requests/${id}`);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to submit payment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCrypto = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/payments/crypto', { requestId: id, network, txHash });
      toast.success('Crypto payment submitted! Admin will verify shortly.');
      navigate(`/requests/${id}`);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to submit payment');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <PageSpinner />;
  if (!request) return <div className="text-center text-slate-400 py-20">Request not found</div>;
  if (!request.finalCost) return (
    <div className="max-w-md mx-auto text-center py-20">
      <p className="text-4xl mb-4">⏳</p>
      <p className="text-slate-300 font-medium">Invoice not ready yet</p>
      <p className="text-slate-500 mt-2 text-sm">Admin will set the final cost once the job is complete.</p>
      <Link to={`/requests/${id}`} className="mt-6 inline-block btn-secondary px-6 py-2">Back to Request</Link>
    </div>
  );

  const mobileMethods = ['mpesa', 'airtel_money', 'tigo_pesa', 'mtn_momo'];

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div>
        <Link to={`/requests/${id}`} className="text-sm text-slate-400 hover:text-white mb-2 inline-block">← Back</Link>
        <h1 className="text-2xl font-bold text-white">Pay for Service</h1>
        <p className="text-slate-400 mt-1">Ticket: {request.ticketNumber}</p>
      </div>

      {/* Amount */}
      <div className="card text-center">
        <p className="text-slate-400 text-sm">Amount Due</p>
        <p className="text-4xl font-bold text-white mt-1">${parseFloat(request.finalCost).toFixed(2)}</p>
        <p className="text-sm text-slate-500 mt-1">{request.service?.name}</p>
      </div>

      {/* Method selection */}
      <div className="card">
        <h2 className="font-semibold text-white mb-4">Select Payment Method</h2>
        <div className="space-y-2">
          {/* Stripe */}
          {methods?.stripe?.available && (
            <label className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer ${selected === 'stripe' ? 'border-blue-500 bg-blue-500/10' : 'border-slate-700'}`}>
              <input type="radio" name="method" value="stripe" className="accent-blue-500"
                checked={selected === 'stripe'} onChange={() => setSelected('stripe')} />
              <span className="text-xl">💳</span>
              <div><p className="font-medium text-sm text-white">Credit / Debit Card</p><p className="text-xs text-slate-500">Visa, Mastercard, Amex</p></div>
            </label>
          )}
          {/* Mobile money */}
          {mobileMethods.map(m => methods?.[m] && (
            <label key={m} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer ${selected === m ? 'border-blue-500 bg-blue-500/10' : 'border-slate-700'}`}>
              <input type="radio" name="method" value={m} className="accent-blue-500"
                checked={selected === m} onChange={() => setSelected(m)} />
              <span className="text-xl">📱</span>
              <div>
                <p className="font-medium text-sm text-white">{methods[m].label}</p>
                <p className="text-xs text-slate-500">{methods[m].businessNumber} · {methods[m].currency}</p>
              </div>
            </label>
          ))}
          {/* Crypto */}
          <label className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer ${selected === 'binance' ? 'border-yellow-500 bg-yellow-500/10' : 'border-slate-700'}`}>
            <input type="radio" name="method" value="binance" className="accent-yellow-500"
              checked={selected === 'binance'} onChange={() => setSelected('binance')} />
            <span className="text-xl">🟡</span>
            <div><p className="font-medium text-sm text-white">USDT / Binance Pay</p><p className="text-xs text-slate-500">BEP20 · TRC20 · ERC20</p></div>
          </label>
        </div>
      </div>

      {/* Stripe pay button */}
      {selected === 'stripe' && (
        <button onClick={handleStripe} disabled={submitting} className="btn-primary w-full py-3">
          {submitting ? 'Processing…' : `Pay $${parseFloat(request.finalCost).toFixed(2)} with Card`}
        </button>
      )}

      {/* Mobile money form */}
      {mobileMethods.includes(selected) && methods?.[selected] && (
        <form onSubmit={handleMobileMoney} className="card space-y-4">
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 text-sm text-blue-300">
            <p className="font-medium mb-1">Instructions:</p>
            <p>{methods[selected].instructions}</p>
            <p className="mt-1 text-blue-200 font-medium">Reference: KIRATECH-{request.ticketNumber}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Your {methods[selected].label} Phone *</label>
            <input required className="input-field" type="tel" value={phone}
              onChange={e => setPhone(e.target.value)} placeholder="+255714000000" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Transaction Reference (optional)</label>
            <input className="input-field" value={providerRef}
              onChange={e => setProviderRef(e.target.value)} placeholder="If you have already sent, enter the TX ref" />
          </div>
          <button type="submit" disabled={submitting} className="btn-primary w-full py-3">
            {submitting ? 'Submitting…' : 'Confirm Payment'}
          </button>
        </form>
      )}

      {/* Crypto form */}
      {selected === 'binance' && methods?.binance && (
        <form onSubmit={handleCrypto} className="card space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Network</label>
            <div className="grid grid-cols-3 gap-2">
              {['TRC20', 'BEP20', 'ERC20'].map(n => (
                <label key={n} className={`flex items-center justify-center gap-2 p-2 rounded-lg border cursor-pointer text-sm ${network === n ? 'border-yellow-500 bg-yellow-500/10 text-yellow-400' : 'border-slate-700 text-slate-400'}`}>
                  <input type="radio" className="hidden" checked={network === n} onChange={() => setNetwork(n)} />
                  {n}
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">USDT Wallet Address to Send To</label>
            <div className="input-field bg-slate-700 text-xs font-mono break-all select-all cursor-pointer"
              onClick={() => { navigator.clipboard.writeText(methods.binance.addresses[network]?.address); toast.success('Copied!'); }}>
              {methods.binance.addresses[network]?.address}
              <span className="text-slate-400 ml-2">(tap to copy)</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Transaction Hash (TX ID) *</label>
            <input required className="input-field font-mono text-sm" value={txHash}
              onChange={e => setTxHash(e.target.value)} placeholder="0x..." />
          </div>
          <p className="text-xs text-yellow-500">⚠️ {methods.binance.warning}</p>
          <button type="submit" disabled={submitting} className="btn-primary w-full py-3" style={{ background: '#F0B90B', color: '#000' }}>
            {submitting ? 'Submitting…' : 'Submit Crypto Payment'}
          </button>
        </form>
      )}

      <Link to={`/requests/${id}`} className="block text-center text-sm text-slate-500 hover:text-slate-400">Cancel</Link>
    </div>
  );
}
