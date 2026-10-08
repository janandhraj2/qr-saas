'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/AuthContext';
import { useI18n } from '@/lib/i18n';

export default function PricingPage() {
  const { user } = useAuth();
  const { t } = useI18n();
  const router = useRouter();
  const [plans, setPlans] = useState([]);
  const [gateways, setGateways] = useState([]);
  const [upiData, setUpiData] = useState(null);

  useEffect(() => {
    api('/api/payments/plans/', { auth: false }).then((d) => setPlans(d.plans)).catch(() => {});
    api('/api/payments/gateways/', { auth: false }).then(setGateways).catch(() => {});
  }, []);

  const loadRazorpay = () => new Promise((resolve) => {
    if (document.getElementById('rzp')) return resolve(true);
    const s = document.createElement('script');
    s.id = 'rzp'; s.src = 'https://checkout.razorpay.com/v1/checkout.js';
    s.onload = () => resolve(true); s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });

  const subscribe = async (planKey) => {
    if (!user) { router.push('/login'); return; }
    try {
      const order = await api('/api/payments/create-order/', { method: 'POST', body: { plan_key: planKey } });
      if (order.gateway === 'upi') { setUpiData(order); return; }
      await loadRazorpay();
      const rzp = new window.Razorpay({
        key: order.razorpay_key_id, amount: order.amount, currency: 'INR',
        name: 'JAR Solutions', order_id: order.order_id,
        prefill: { name: user.first_name || user.username, email: user.email },
        theme: { color: '#991b1b' },
        handler: async (res) => {
          try {
            const r = await api('/api/payments/verify/', { method: 'POST', body: res });
            alert(r.message); window.location.href = '/dashboard';
          } catch (e) { alert(e.error || 'Verification failed'); }
        },
      });
      rzp.open();
    } catch (e) { alert(e.error || 'Could not start payment'); }
  };

  const submitUpiRef = async () => {
    const ref = document.getElementById('upi_ref').value.trim();
    if (!ref) return alert('Enter your UPI reference number');
    try {
      const r = await api('/api/payments/upi-submit/', { method: 'POST', body: { txn_id: upiData.txn_id, upi_ref: ref } });
      alert(r.message); setUpiData(null);
    } catch (e) { alert(e.error || 'Failed'); }
  };

  return (
    <main className="hero-grid">
      <section className="max-w-6xl mx-auto px-4 md:px-6 pt-14 pb-20">
        <motion.div initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-stone-900">{t('pricing_title')} <span className="grad-text">pricing</span></h1>
          <p className="text-stone-500 mt-4">{t('pricing_sub')}</p>
          <p className="text-xs text-stone-400 mt-2">Payment options: {gateways.map((g) => g.display_name).join(' • ') || 'Loading…'}</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 mt-14">
          <div className="p-7 rounded-3xl bg-white border border-stone-200 flex flex-col">
            <h3 className="font-bold text-stone-400 tracking-wide text-sm">GUEST</h3>
            <p className="text-4xl font-extrabold mt-2 text-stone-900">Free</p>
            <ul className="mt-6 space-y-3 text-sm text-stone-500 flex-1">
              <li>✅ 2 QR codes</li><li>✅ All QR types</li><li>✅ Logo inside QR</li><li>✅ Custom colors</li>
              <li className="text-stone-300">❌ Unlimited codes</li>
            </ul>
            <button onClick={() => router.push('/register')} className="mt-7 py-3.5 rounded-2xl border-2 border-stone-200 font-bold text-stone-600 hover:border-wine-500 hover:text-wine-600 transition">Start Free</button>
          </div>
          {plans.map((p, i) => (
            <motion.div key={p.key} initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.08 }}
              className={'p-7 rounded-3xl flex flex-col relative ' + (p.is_popular
                ? 'bg-gradient-to-br from-wine-700 to-wine-500 text-white shadow-[0_30px_60px_rgba(127,29,29,0.35)]'
                : 'bg-white border border-stone-200')}>
              {p.is_popular && <span className="absolute top-5 right-5 px-3 py-1 rounded-full bg-white text-wine-700 text-xs font-bold">POPULAR</span>}
              <h3 className={'font-bold tracking-wide text-sm ' + (p.is_popular ? 'text-red-200' : 'text-wine-600')}>{p.name.toUpperCase()}</h3>
              <p className="text-4xl font-extrabold mt-2">₹{p.price_inr}<span className="text-base font-medium opacity-70">/{p.days >= 365 ? 'year' : p.days + ' days'}</span></p>
              <ul className={'mt-6 space-y-3 text-sm flex-1 ' + (p.is_popular ? 'text-red-50' : 'text-stone-500')}>
                {(p.features || []).map((ft) => <li key={ft}>✅ {ft}</li>)}
                <li>✅ {p.max_qrs ? p.max_qrs + ' QR codes' : 'Unlimited QR codes'}</li>
              </ul>
              <button onClick={() => subscribe(p.key)} className={p.is_popular ? 'mt-7 py-3.5 rounded-2xl bg-white text-wine-700 font-bold hover:scale-[1.02] transition' : 'wine-btn mt-7 py-3.5'}>
                Subscribe Now
              </button>
            </motion.div>
          ))}
        </div>

        {upiData && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setUpiData(null)}>
            <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center" onClick={(e) => e.stopPropagation()}>
              <h3 className="font-extrabold text-lg text-stone-900">Pay ₹{upiData.amount} via UPI</h3>
              <img src={`data:image/png;base64,${upiData.upi_qr}`} className="w-52 h-52 mx-auto my-5 border border-stone-200 rounded-2xl" alt="UPI QR" />
              <p className="text-xs text-stone-400 break-all mb-4">{upiData.upi_string}</p>
              <input id="upi_ref" className="input-w" placeholder="UPI Reference / UTR Number" />
              <button onClick={submitUpiRef} className="wine-btn w-full py-3 mt-3">I have paid — Submit Ref</button>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
