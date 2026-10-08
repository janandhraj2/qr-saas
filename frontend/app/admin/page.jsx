'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/AuthContext';
import Link from 'next/link';

const TABS = [
  ['overview', 'Overview', '/icons/feat-analytics.webp'], ['users', 'Users', '/icons/tab-users.webp'], ['payments', 'Payments', '/icons/feat-payments.webp'],
  ['qrs', 'QR Codes', '/icons/feat-qrlogo.webp'], ['languages', 'Languages', '/icons/feat-globe.webp'], ['gateways', 'Gateways', '/icons/tab-gateways.webp'],
  ['plans', 'Plans', '/icons/tab-plans.webp'], ['settings', 'Settings', '/icons/feat-admin.webp'],
];

export default function AdminPage() {
  const { user, loading } = useAuth();
  const [tab, setTab] = useState('overview');

  if (loading) return <main className="min-h-screen flex items-center justify-center text-stone-400">Loading…</main>;
  if (!user?.is_staff) return (
    <main className="min-h-screen flex items-center justify-center text-center px-6">
      <div><p className="text-5xl mb-4">🔒</p><p className="text-stone-500">Admin access only. <Link href="/" className="text-wine-600 font-bold">Go home</Link></p></div>
    </main>
  );

  return (
    <main className="hero-grid pt-8 pb-16 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-2xl md:text-3xl font-extrabold text-stone-900">
          JAR Admin <span className="grad-text">Control Center</span>
        </motion.h1>
        <p className="text-stone-500 text-sm mt-1">Fully dynamic — manage everything without touching code.</p>

        <div className="flex flex-wrap gap-2 mt-6">
          {TABS.map(([key, label, img]) => (
            <button key={key} onClick={() => setTab(key)}
              className={'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition border ' + (tab === key
                ? 'bg-wine-600 text-white border-wine-600 shadow-lg shadow-wine-600/25'
                : 'bg-white text-stone-600 border-stone-200 hover:border-wine-400')}>
              <img src={img} alt={label} className="w-5 h-5 rounded-md" />
              {label}
            </button>
          ))}
        </div>

        <div className="mt-6">
          {tab === 'overview' && <Overview />}
          {tab === 'users' && <Users />}
          {tab === 'payments' && <Payments />}
          {tab === 'qrs' && <QRs />}
          {tab === 'languages' && <Languages />}
          {tab === 'gateways' && <Gateways />}
          {tab === 'plans' && <Plans />}
          {tab === 'settings' && <Settings />}
        </div>
      </div>
    </main>
  );
}

function Overview() {
  const [stats, setStats] = useState(null);
  useEffect(() => { api('/api/auth/admin/stats/').then(setStats).catch(() => {}); }, []);
  const cards = [
    ['/icons/tab-users.webp', 'Total Users', stats?.total_users, 'from-wine-600 to-red-500'],
    ['/icons/tab-plans.webp', 'Paid Users', stats?.paid_users, 'from-emerald-500 to-teal-500'],
    ['/icons/feat-globe.webp', 'Guest Users', stats?.guest_users, 'from-amber-500 to-orange-500'],
    ['/icons/feat-qrlogo.webp', 'Total QRs', stats?.total_qrs, 'from-purple-500 to-pink-500'],
    ['/icons/feat-payments.webp', 'Revenue ₹', stats?.revenue_inr, 'from-sky-500 to-cyan-500'],
    ['/icons/feat-analytics.webp', 'Pending Payments', stats?.pending_payments, 'from-stone-500 to-stone-400'],
  ];
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {cards.map(([ic, lbl, val, grad]) => (
        <div key={lbl} className="p-5 rounded-2xl bg-white border border-stone-200 card-lift">
          <div className={'w-10 h-10 rounded-xl bg-gradient-to-br ' + grad + ' flex items-center justify-center mb-3 overflow-hidden'}>
            <img src={ic} alt={lbl} className="w-full h-full object-cover" />
          </div>
          <p className="text-2xl font-extrabold text-stone-900">{val ?? '—'}</p>
          <p className="text-xs text-stone-400 mt-1">{lbl}</p>
        </div>
      ))}
    </div>
  );
}

function Users() {
  const [users, setUsers] = useState([]);
  const load = () => api('/api/auth/admin/users/').then(setUsers).catch(() => {});
  useEffect(() => { load(); }, []);
  const act = async (id, action, days) => {
    await api(`/api/auth/admin/users/${id}/`, { method: 'PATCH', body: { action, days } });
    load();
  };
  return (
    <div className="rounded-2xl bg-white border border-stone-200 overflow-x-auto">
      <table className="w-full text-sm min-w-[640px]">
        <thead><tr className="text-left text-stone-400 border-b border-stone-200">
          <th className="px-5 py-4">User</th><th className="px-5 py-4">Email</th><th className="px-5 py-4">Plan</th>
          <th className="px-5 py-4">QRs</th><th className="px-5 py-4">Joined</th><th className="px-5 py-4">Actions</th>
        </tr></thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="border-b border-stone-100 hover:bg-wine-50/40">
              <td className="px-5 py-4 font-bold text-stone-800">{u.username}{u.is_staff && <span className="ml-1 text-[10px] text-wine-600">ADMIN</span>}</td>
              <td className="px-5 py-4 text-stone-500">{u.email || '—'}</td>
              <td className="px-5 py-4">
                <span className={'px-3 py-1 rounded-full text-xs font-bold ' + (u.is_pro ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-stone-100 text-stone-500')}>
                  {u.is_pro ? '💎 PRO' : 'GUEST'}
                </span>
              </td>
              <td className="px-5 py-4">{u.qr_count}</td>
              <td className="px-5 py-4 text-stone-400">{new Date(u.date_joined).toLocaleDateString()}</td>
              <td className="px-5 py-4">
                <div className="flex gap-1.5">
                  <button onClick={() => act(u.id, 'make_pro', 365)} className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold">Make Pro</button>
                  <button onClick={() => act(u.id, 'make_guest')} className="px-3 py-1.5 rounded-lg bg-stone-200 text-stone-600 text-xs font-bold">To Guest</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Payments() {
  const [txns, setTxns] = useState([]);
  const load = () => api('/api/payments/admin/transactions/').then(setTxns).catch(() => {});
  useEffect(() => { load(); }, []);
  const approve = async (id) => { await api(`/api/payments/admin/transactions/${id}/approve/`, { method: 'POST' }); load(); };
  const colors = { captured: 'bg-emerald-50 text-emerald-600 border-emerald-200', failed: 'bg-red-50 text-red-500 border-red-200', pending_verification: 'bg-amber-50 text-amber-600 border-amber-200', created: 'bg-stone-100 text-stone-500' };
  return (
    <div className="rounded-2xl bg-white border border-stone-200 overflow-x-auto">
      <table className="w-full text-sm min-w-[680px]">
        <thead><tr className="text-left text-stone-400 border-b border-stone-200">
          <th className="px-5 py-4">User</th><th className="px-5 py-4">Plan</th><th className="px-5 py-4">Gateway</th>
          <th className="px-5 py-4">Amount</th><th className="px-5 py-4">Status</th><th className="px-5 py-4">UPI Ref</th><th className="px-5 py-4"></th>
        </tr></thead>
        <tbody>
          {txns.map((tx) => (
            <tr key={tx.id} className="border-b border-stone-100">
              <td className="px-5 py-4 font-bold text-stone-800">{tx.user}</td>
              <td className="px-5 py-4">{tx.plan}</td>
              <td className="px-5 py-4 text-stone-500">{tx.gateway}</td>
              <td className="px-5 py-4 font-bold">₹{tx.amount}</td>
              <td className="px-5 py-4"><span className={'px-3 py-1 rounded-full text-xs font-bold border ' + (colors[tx.status] || '')}>{tx.status}</span></td>
              <td className="px-5 py-4 text-stone-400 text-xs">{tx.upi_ref || '—'}</td>
              <td className="px-5 py-4">
                {tx.status === 'pending_verification' && (
                  <button onClick={() => approve(tx.id)} className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold">✓ Approve</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function QRs() {
  const [qrs, setQrs] = useState([]);
  const load = () => api('/api/qr/admin/all/').then(setQrs).catch(() => {});
  useEffect(() => { load(); }, []);
  return (
    <div className="rounded-2xl bg-white border border-stone-200 overflow-x-auto">
      <table className="w-full text-sm min-w-[560px]">
        <thead><tr className="text-left text-stone-400 border-b border-stone-200">
          <th className="px-5 py-4">User</th><th className="px-5 py-4">Type</th><th className="px-5 py-4">Title</th>
          <th className="px-5 py-4">Scans</th><th className="px-5 py-4">Created</th>
        </tr></thead>
        <tbody>
          {qrs.map((q) => (
            <tr key={q.id} className="border-b border-stone-100">
              <td className="px-5 py-4 font-bold text-stone-800">{q.user}</td>
              <td className="px-5 py-4"><span className="px-2.5 py-1 rounded-lg bg-wine-50 text-wine-700 text-xs font-bold">{q.qr_type}</span></td>
              <td className="px-5 py-4 text-stone-500">{q.title || '—'}</td>
              <td className="px-5 py-4">👁 {q.scan_count}</td>
              <td className="px-5 py-4 text-stone-400">{new Date(q.created_at).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Languages() {
  const [langs, setLangs] = useState([]);
  const [form, setForm] = useState({ code: '', name: '', native_name: '' });
  const [tr, setTr] = useState({ lang: 'en', key: '', value: '' });
  const load = () => api('/api/core/admin/languages/').then(setLangs).catch(() => {});
  useEffect(() => { load(); }, []);
  const patch = async (id, body) => { await api(`/api/core/admin/languages/${id}/`, { method: 'PATCH', body }); load(); };
  const add = async () => { await api('/api/core/admin/languages/', { method: 'POST', body: form }); setForm({ code: '', name: '', native_name: '' }); load(); };
  const addTr = async () => { await api('/api/core/admin/translations/', { method: 'POST', body: { language: langs.find(l => l.code === tr.lang)?.id, key: tr.key, value: tr.value } }); setTr({ ...tr, key: '', value: '' }); alert('Translation saved!'); };
  return (
    <div className="grid lg:grid-cols-2 gap-5">
      <div className="p-6 rounded-2xl bg-white border border-stone-200">
        <h3 className="font-extrabold text-stone-900 mb-4">🌍 Languages</h3>
        {langs.map((l) => (
          <div key={l.id} className="flex items-center justify-between py-2.5 border-b border-stone-100">
            <div><span className="font-bold text-stone-800 text-sm">{l.native_name || l.name}</span> <span className="text-xs text-stone-400">({l.code})</span></div>
            <div className="flex gap-2">
              <button onClick={() => patch(l.id, { is_active: !l.is_active })} className={'px-3 py-1 rounded-lg text-xs font-bold ' + (l.is_active ? 'bg-emerald-50 text-emerald-600' : 'bg-stone-100 text-stone-400')}>{l.is_active ? 'Active' : 'Off'}</button>
              <button onClick={() => patch(l.id, { is_default: true })} className={'px-3 py-1 rounded-lg text-xs font-bold ' + (l.is_default ? 'bg-wine-600 text-white' : 'bg-stone-100 text-stone-500')}>{l.is_default ? 'Default' : 'Set default'}</button>
            </div>
          </div>
        ))}
        <div className="flex gap-2 mt-4">
          <input className="input-w" placeholder="code (e.g. kn)" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} />
          <input className="input-w" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input className="input-w" placeholder="Native" value={form.native_name} onChange={(e) => setForm({ ...form, native_name: e.target.value })} />
        </div>
        <button onClick={add} className="wine-btn px-5 py-2.5 text-sm mt-3">+ Add Language</button>
      </div>
      <div className="p-6 rounded-2xl bg-white border border-stone-200">
        <h3 className="font-extrabold text-stone-900 mb-1">📝 Add Translation</h3>
        <p className="text-xs text-stone-400 mb-4">Translate any UI text key, e.g. hero_title_2 → "மீண்டும் உருவாக்கப்பட்டது"</p>
        <select className="input-w" value={tr.lang} onChange={(e) => setTr({ ...tr, lang: e.target.value })}>
          {langs.map((l) => <option key={l.code} value={l.code}>{l.name}</option>)}
        </select>
        <input className="input-w" placeholder="Key (e.g. hero_cta)" value={tr.key} onChange={(e) => setTr({ ...tr, key: e.target.value })} />
        <textarea className="input-w" rows={2} placeholder="Translated text" value={tr.value} onChange={(e) => setTr({ ...tr, value: e.target.value })} />
        <button onClick={addTr} className="wine-btn px-5 py-2.5 text-sm">Save Translation</button>
      </div>
    </div>
  );
}

function Gateways() {
  const [gws, setGws] = useState([]);
  const load = () => api('/api/payments/admin/gateways/').then(setGws).catch(() => {});
  useEffect(() => { load(); }, []);
  const patch = async (id, body) => { await api(`/api/payments/admin/gateways/${id}/`, { method: 'PATCH', body }); load(); };
  return (
    <div className="grid md:grid-cols-2 gap-5">
      {gws.map((g) => (
        <div key={g.id} className="p-6 rounded-2xl bg-white border border-stone-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-extrabold text-stone-900">{g.display_name}</h3>
            <span className={'px-3 py-1 rounded-full text-xs font-bold ' + (g.is_active ? 'bg-emerald-50 text-emerald-600' : 'bg-stone-100 text-stone-400')}>
              {g.is_active ? 'ACTIVE' : 'DISABLED'}
            </span>
          </div>
          <p className="text-xs text-stone-400 mb-3">ID: {g.name}{g.is_default ? ' • ⭐ DEFAULT GATEWAY' : ''}</p>
          <ConfigEditor gateway={g} onSave={(config) => patch(g.id, { config })} />
          <div className="flex gap-2 mt-4">
            <button onClick={() => patch(g.id, { is_active: !g.is_active })} className="px-4 py-2 rounded-xl bg-stone-100 text-stone-600 text-xs font-bold hover:bg-stone-200">
              {g.is_active ? 'Disable' : 'Enable'}
            </button>
            <button onClick={() => patch(g.id, { is_default: true })} className="px-4 py-2 rounded-xl bg-amber-50 text-amber-600 text-xs font-bold border border-amber-200">
              ⭐ Make Default
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function ConfigEditor({ gateway, onSave }) {
  const [text, setText] = useState(JSON.stringify(gateway.config, null, 2));
  return (
    <div>
      <textarea className="input-w font-mono text-xs" rows={4} value={text} onChange={(e) => setText(e.target.value)} />
      <button onClick={() => { try { onSave(JSON.parse(text)); alert('Config saved!'); } catch { alert('Invalid JSON'); } }}
        className="px-4 py-2 rounded-xl bg-wine-600 text-white text-xs font-bold mt-2">Save Config</button>
    </div>
  );
}

function Plans() {
  const [plans, setPlans] = useState([]);
  const load = () => api('/api/payments/admin/plans/').then(setPlans).catch(() => {});
  useEffect(() => { load(); }, []);
  const patch = async (id, body) => { await api(`/api/payments/admin/plans/${id}/`, { method: 'PATCH', body }); load(); };
  const add = async () => {
    const key = prompt('Plan key (e.g. pro_lifetime):'); if (!key) return;
    const name = prompt('Plan name:', key) || key;
    const price = parseInt(prompt('Price in ₹:', '499')) || 499;
    await api('/api/payments/admin/plans/', { method: 'POST', body: { key, name, price_inr: price, days: 365, max_qrs: null, features: [] } });
    load();
  };
  return (
    <div>
      <button onClick={add} className="wine-btn px-5 py-2.5 text-sm mb-4">+ Create Plan</button>
      <div className="grid md:grid-cols-3 gap-4">
        {plans.map((p) => (
          <div key={p.id} className="p-5 rounded-2xl bg-white border border-stone-200 card-lift">
            <div className="flex justify-between items-start">
              <h3 className="font-extrabold text-stone-900">{p.name}</h3>
              {p.is_popular && <span className="px-2 py-0.5 rounded-full bg-wine-600 text-white text-[10px] font-bold">POPULAR</span>}
            </div>
            <p className="text-2xl font-extrabold text-wine-600 mt-2">₹{p.price_inr} <span className="text-xs text-stone-400 font-medium">/ {p.days} days</span></p>
            <p className="text-xs text-stone-400 mt-1">{p.max_qrs ? p.max_qrs + ' QR codes' : '♾ Unlimited QRs'} • key: {p.key}</p>
            <ul className="text-xs text-stone-500 mt-2">{(p.features || []).map((f) => <li key={f}>✅ {f}</li>)}</ul>
            <div className="flex gap-2 mt-4">
              <button onClick={() => patch(p.id, { is_active: !p.is_active })} className="px-3 py-1.5 rounded-lg bg-stone-100 text-xs font-bold text-stone-600">{p.is_active ? 'Deactivate' : 'Activate'}</button>
              <button onClick={() => patch(p.id, { is_popular: !p.is_popular })} className="px-3 py-1.5 rounded-lg bg-amber-50 text-amber-600 border border-amber-200 text-xs font-bold">⭐ Toggle popular</button>
              <button onClick={() => { const pr = prompt('New price ₹:', p.price_inr); if (pr) patch(p.id, { price_inr: parseInt(pr) }).then(load); }} className="px-3 py-1.5 rounded-lg bg-wine-50 text-wine-700 text-xs font-bold">₹ Edit price</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Settings() {
  const [s, setS] = useState(null);
  const load = () => api('/api/core/admin/settings/').then(setS).catch(() => {});
  useEffect(() => { load(); }, []);
  if (!s) return <p className="text-stone-400 text-sm">Loading…</p>;
  const save = async () => { await api('/api/core/admin/settings/', { method: 'PUT', body: s }); alert('Settings saved!'); load(); };
  const onLogo = (e) => {
    const f = e.target.files[0]; if (!f) return;
    const r = new FileReader();
    r.onload = () => setS({ ...s, logo_base64: r.result });
    r.readAsDataURL(f);
  };
  return (
    <div className="grid lg:grid-cols-2 gap-5">
      <div className="p-6 rounded-2xl bg-white border border-stone-200 space-y-3">
        <h3 className="font-extrabold text-stone-900">🏢 Site Identity</h3>
        <label className="text-xs text-stone-500 block">Site name
          <input className="input-w mt-1" value={s.site_name} onChange={(e) => setS({ ...s, site_name: e.target.value })} /></label>
        <label className="text-xs text-stone-500 block">Tagline
          <input className="input-w mt-1" value={s.tagline} onChange={(e) => setS({ ...s, tagline: e.target.value })} /></label>
        <div className="flex items-center gap-3">
          {s.logo_url && <img src={s.logo_url} className="h-12 w-auto border border-stone-200 rounded-lg p-1" alt="logo" />}
          <input type="file" accept="image/*" onChange={onLogo} className="text-xs text-stone-500" />
        </div>
      </div>
      <div className="p-6 rounded-2xl bg-white border border-stone-200 space-y-3">
        <h3 className="font-extrabold text-stone-900">🎨 Theme & Limits</h3>
        <div className="grid grid-cols-2 gap-3">
          <label className="text-xs text-stone-500">Primary color
            <input type="color" value={s.primary_color} onChange={(e) => setS({ ...s, primary_color: e.target.value })} className="block mt-1 w-full h-10 rounded-lg bg-white border border-stone-200 cursor-pointer" /></label>
          <label className="text-xs text-stone-500">Secondary color
            <input type="color" value={s.secondary_color} onChange={(e) => setS({ ...s, secondary_color: e.target.value })} className="block mt-1 w-full h-10 rounded-lg bg-white border border-stone-200 cursor-pointer" /></label>
        </div>
        <label className="text-xs text-stone-500 block">Guest QR limit
          <input type="number" className="input-w mt-1" value={s.guest_qr_limit} onChange={(e) => setS({ ...s, guest_qr_limit: parseInt(e.target.value) })} /></label>
        <label className="flex items-center gap-2 text-sm text-stone-700 mt-2 cursor-pointer">
          <input type="checkbox" checked={s.maintenance_mode} onChange={(e) => setS({ ...s, maintenance_mode: e.target.checked })} className="accent-red-700 w-4 h-4" />
          Maintenance mode (temporarily close registrations)
        </label>
        <button onClick={save} className="wine-btn px-6 py-3 text-sm">💾 Save Settings</button>
      </div>
    </div>
  );
}
