'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/AuthContext';
import { useI18n } from '@/lib/i18n';

export default function RegisterPage() {
  const { register } = useAuth();
  const { t } = useI18n();
  const router = useRouter();
  const [form, setForm] = useState({ username: '', email: '', password: '', first_name: '', phone: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault(); setBusy(true); setError('');
    try { await register(form); router.push('/dashboard'); }
    catch (err) { setError(err.username?.[0] || err.email?.[0] || err.error || 'Registration failed'); }
    finally { setBusy(false); }
  };

  return (
    <main className="min-h-screen flex items-center justify-center hero-grid px-4 py-24">
      <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}
        className="w-full max-w-md p-8 rounded-3xl bg-white border border-stone-200 shadow-[0_30px_60px_rgba(127,29,29,0.12)]">
        <h1 className="text-3xl font-extrabold text-center text-stone-900">{t('reg_title')} <span className="grad-text">account</span></h1>
        <p className="text-stone-500 text-sm text-center mt-2">{t('reg_sub')}</p>
        {error && <p className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">{error}</p>}
        <form onSubmit={submit} className="mt-6 space-y-4">
          <input className="input-w" placeholder="Full name" value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} />
          <input className="input-w" placeholder="Username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} required />
          <input type="email" className="input-w" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <input className="input-w" placeholder="Phone (optional)" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <input type="password" className="input-w" placeholder="Password (min 6 chars)" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={6} />
          <button disabled={busy} className="wine-btn w-full py-3.5 disabled:opacity-50">{busy ? '…' : t('reg_btn')}</button>
        </form>
        <p className="text-sm text-stone-500 text-center mt-6">Have an account? <Link href="/login" className="text-wine-600 font-bold">Login</Link></p>
      </motion.div>
    </main>
  );
}
