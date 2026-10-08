'use client';
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/AuthContext';
import { useI18n } from '@/lib/i18n';
import Link from 'next/link';

const TYPE_FIELDS = {
  url: [{ key: 'url', label: 'Website URL', placeholder: 'https://jarsolutions.com', type: 'url' }],
  text: [{ key: 'text', label: 'Text content', placeholder: 'Hello world!', type: 'textarea' }],
  wifi: [
    { key: 'ssid', label: 'Network name (SSID)', placeholder: 'MyWiFi', type: 'text' },
    { key: 'password', label: 'Password', placeholder: '••••••••', type: 'text' },
    { key: 'encryption', label: 'Security', type: 'select', options: ['WPA', 'WEP', 'nopass'] }],
  vcard: [
    { key: 'name', label: 'Full name', placeholder: 'Arun Kumar', type: 'text' },
    { key: 'phone', label: 'Phone', placeholder: '+91 98765 43210', type: 'text' },
    { key: 'email', label: 'Email', placeholder: 'arun@jarsolutions.com', type: 'text' },
    { key: 'org', label: 'Company', placeholder: 'JAR Solutions', type: 'text' },
    { key: 'title', label: 'Job title', placeholder: 'CEO', type: 'text' }],
  email: [
    { key: 'email', label: 'Recipient email', placeholder: 'hello@jarsolutions.com', type: 'text' },
    { key: 'subject', label: 'Subject', placeholder: 'Enquiry', type: 'text' },
    { key: 'body', label: 'Message', placeholder: 'Hi…', type: 'textarea' }],
  sms: [{ key: 'phone', label: 'Phone number', placeholder: '+919876543210', type: 'text' },
        { key: 'message', label: 'Message', placeholder: 'Hello!', type: 'textarea' }],
  whatsapp: [{ key: 'phone', label: 'WhatsApp number (country code)', placeholder: '919876543210', type: 'text' },
        { key: 'message', label: 'Pre-filled message', type: 'textarea' }],
  phone: [{ key: 'phone', label: 'Phone number', placeholder: '+919876543210', type: 'text' }],
  event: [
    { key: 'title', label: 'Event name', placeholder: 'Annual Meet', type: 'text' },
    { key: 'start', label: 'Start (YYYYMMDD)', placeholder: '20261015T100000', type: 'text' },
    { key: 'end', label: 'End (YYYYMMDD)', placeholder: '20261015T130000', type: 'text' },
    { key: 'location', label: 'Location', placeholder: 'Chennai', type: 'text' }],
  app: [{ key: 'store_url', label: 'App Store / Play Store URL', placeholder: 'https://play.google.com/…', type: 'text' }],
  social: [{ key: 'profile_url', label: 'Profile URL (Instagram, LinkedIn…)', placeholder: 'https://instagram.com/…', type: 'text' }],
};

const TYPES = [
  ['url', 'URL', '/icons/type-link.webp'], ['text', 'Text', '/icons/type-text.webp'], ['wifi', 'WiFi', '/icons/type-wifi.webp'], ['vcard', 'vCard', '/icons/type-vcard.webp'],
  ['email', 'Email', '/icons/type-email.webp'], ['sms', 'SMS', '/icons/type-phone.webp'], ['whatsapp', 'WhatsApp', '/icons/type-whatsapp.webp'], ['phone', 'Phone', '/icons/type-phone.webp'],
  ['event', 'Event', '/icons/type-event.webp'], ['app', 'App', '/icons/type-app.webp'], ['social', 'Social', '/icons/type-social.webp'],
];

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const { t } = useI18n();
  const [qrType, setQrType] = useState('url');
  const [data, setData] = useState({});
  const [title, setTitle] = useState('');
  const [fill, setFill] = useState('#7f1d1d');
  const [back, setBack] = useState('#ffffff');
  const [size, setSize] = useState(10);
  const [border, setBorder] = useState(2);
  const [ec, setEc] = useState('H');
  const [logoB64, setLogoB64] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [mine, setMine] = useState([]);
  const fileRef = useRef();

  useEffect(() => { if (user) loadMine(); }, [user]);
  const loadMine = async () => { try { setMine(await api('/api/qr/mine/')); } catch (e) {} };

  const onLogoFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setLogoB64(reader.result);
    reader.readAsDataURL(file);
  };

  if (loading) return <main className="min-h-screen flex items-center justify-center text-stone-400">Loading…</main>;
  if (!user) return <main className="min-h-screen flex items-center justify-center"><Link href="/login" className="text-wine-600 font-bold">Please login →</Link></main>;

  const atLimit = !user.is_pro && user.qr_limit !== null && mine.length >= user.qr_limit;

  const generate = async (e) => {
    e.preventDefault(); setBusy(true); setError(''); setResult(null);
    try {
      const res = await api('/api/qr/generate/', { method: 'POST', body: {
        qr_type: qrType, data, title, fill_color: fill, back_color: back,
        size, border, error_correction: ec, logo_base64: logoB64 } });
      setResult(res); loadMine();
    } catch (err) { setError(err.message || err.error || 'Error'); }
    finally { setBusy(false); }
  };

  const download = () => {
    const a = document.createElement('a');
    a.href = `data:image/png;base64,${result.image_base64}`;
    a.download = `${result.title || result.qr_type}-qr.png`;
    a.click();
  };

  const remove = async (id) => { await api(`/api/qr/${id}/`, { method: 'DELETE' }); loadMine(); };

  return (
    <main className="hero-grid pt-8 pb-16 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-stone-900">{t('dash_welcome')}, {user.first_name || user.username}</h1>
            <p className="text-stone-500 mt-1 text-sm">
              {user.is_pro ? 'JAR Pro — Unlimited QR codes' : `Guest plan — ${mine.length}/${user.qr_limit} ${t('dash_guest_used')}`}
            </p>
          </div>
          {!user.is_pro && <Link href="/pricing" className="wine-btn px-6 py-3 text-sm">{t('dash_upgrade')}</Link>}
        </motion.div>

        {atLimit && <div className="mt-5 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 text-sm">{t('limit_alert')}</div>}

        <div className="grid lg:grid-cols-5 gap-6 mt-8">
          <motion.form onSubmit={generate} initial={{ opacity: 0, x: -22 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.08 }}
            className="lg:col-span-3 p-6 md:p-7 rounded-3xl bg-white border border-stone-200 shadow-[0_20px_50px_rgba(127,29,29,0.07)]">
            <h2 className="font-extrabold text-lg text-stone-900 mb-5">{t('dash_create')}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
              {TYPES.map(([v, l, img]) => (
                <button type="button" key={v} onClick={() => { setQrType(v); setData({}); }}
                  className={'flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold border transition ' + (qrType === v ? 'bg-wine-600 text-white border-wine-600' : 'bg-white text-stone-600 border-stone-200 hover:border-wine-400')}>
                  <img src={img} alt={l} className="w-6 h-6 rounded-md" />
                  {l}
                </button>
              ))}
            </div>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder={t('dash_title_ph')} className="input-w" />
            {TYPE_FIELDS[qrType].map((fld) =>
              fld.type === 'textarea' ? (
                <textarea key={fld.key} rows={2} value={data[fld.key] || ''} placeholder={fld.label}
                  onChange={(e) => setData({ ...data, [fld.key]: e.target.value })} className="input-w" />
              ) : fld.type === 'select' ? (
                <select key={fld.key} value={data[fld.key] || 'WPA'} onChange={(e) => setData({ ...data, [fld.key]: e.target.value })} className="input-w">
                  {fld.options.map((o) => <option key={o}>{o}</option>)}
                </select>
              ) : (
                <input key={fld.key} type={fld.type} value={data[fld.key] || ''} placeholder={fld.label}
                  onChange={(e) => setData({ ...data, [fld.key]: e.target.value })} className="input-w" />
              ))}
            <div className="grid sm:grid-cols-2 gap-4 mt-1">
              <label className="text-xs text-stone-500">Foreground
                <input type="color" value={fill} onChange={(e) => setFill(e.target.value)} className="block mt-1.5 w-full h-10 rounded-lg cursor-pointer bg-white border border-stone-200" />
              </label>
              <label className="text-xs text-stone-500">Background
                <input type="color" value={back} onChange={(e) => setBack(e.target.value)} className="block mt-1.5 w-full h-10 rounded-lg cursor-pointer bg-white border border-stone-200" />
              </label>
              <label className="text-xs text-stone-500">Error Correction
                <select value={ec} onChange={(e) => setEc(e.target.value)} className="input-w mt-1.5">
                  <option value="H">H — 30% (best for logos)</option>
                  <option value="Q">Q — 25%</option>
                  <option value="M">M — 15%</option>
                  <option value="L">L — 7%</option>
                </select>
              </label>
              <label className="text-xs text-stone-500">Size: {size} • Border: {border}
                <input type="range" min="6" max="20" value={size} onChange={(e) => setSize(+e.target.value)} className="w-full mt-3 accent-red-700" />
              </label>
            </div>
            <div className="mt-4 p-4 rounded-2xl bg-wine-50 border border-wine-100">
              <p className="text-xs font-bold text-wine-700 mb-2.5">LOGO INSIDE QR <span className="font-normal text-wine-500">(Pro feature, free guests too!)</span></p>
              <div className="flex items-center gap-3">
                <input ref={fileRef} type="file" accept="image/*" onChange={onLogoFile} className="hidden" />
                <button type="button" onClick={() => fileRef.current.click()} data-tip="PNG or JPG, square works best"
                  className="px-4 py-2.5 rounded-xl bg-white border border-wine-200 text-wine-700 text-sm font-bold hover:bg-wine-100 transition">
                  {logoB64 ? 'Logo selected — change?' : 'Upload your logo'}
                </button>
                {logoB64 && <img src={logoB64} className="w-10 h-10 rounded-lg border border-wine-200 object-contain bg-white" alt="logo" />}
                {logoB64 && <button type="button" onClick={() => setLogoB64(null)} className="text-xs text-stone-400 underline">remove</button>}
              </div>
              <p className="text-[11px] text-stone-400 mt-2">Tip: use error correction <b>H</b> for the best logo result.</p>
            </div>
            <button disabled={busy || atLimit} data-tip="Create and save your QR code" className="wine-btn w-full py-3.5 mt-5 disabled:opacity-40">
              {busy ? 'Generating…' : t('dash_generate')}
            </button>
          </motion.form>

          <motion.div initial={{ opacity: 0, x: 22 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}
            className="lg:col-span-2 p-6 rounded-3xl bg-white border border-stone-200 shadow-[0_20px_50px_rgba(127,29,29,0.07)] flex flex-col items-center justify-center min-h-[420px]">
            {error ? (
              <div className="text-center">
                <p className="text-xs font-extrabold tracking-[0.2em] text-red-500 mb-2">OOPS</p>
                <p className="text-red-600 font-semibold text-sm max-w-xs">{error}</p>
                <Link href="/pricing" className="wine-btn inline-block mt-5 px-6 py-2.5 text-sm">{t('dash_upgrade')}</Link>
              </div>
            ) : result ? (
              <div className="text-center">
                <div className="inline-block p-5 rounded-3xl bg-white border-2 border-wine-100 shadow-[0_25px_60px_rgba(127,29,29,0.18)] animate-float">
                  <img src={`data:image/png;base64,${result.image_base64}`} alt="QR" className="w-52 h-52" />
                </div>
                <p className="mt-4 font-bold text-stone-800">{result.title || result.qr_type}</p>
                <button onClick={download} data-tip="Save as high-resolution PNG" className="wine-btn mt-4 px-8 py-3 text-sm">{t('dash_download')}</button>
              </div>
            ) : (
              <div className="text-center text-stone-400">
                <img src="/icons/feat-qrlogo.webp" alt="" className="w-16 h-16 mx-auto mb-4 opacity-40 rounded-2xl" />
                <p className="text-sm">Your QR preview appears here</p>
              </div>
            )}
          </motion.div>
        </div>

        <h2 className="text-xl font-extrabold text-stone-900 mt-12 mb-5">{t('dash_mine')} ({mine.length})</h2>
        {mine.length === 0 ? <p className="text-stone-400 text-sm">No QR codes yet — create your first one above!</p> : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {mine.map((qr) => (
              <div key={qr.id} className="p-4 rounded-2xl bg-white border border-stone-200 card-lift">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-sm text-stone-800">{qr.title || qr.qr_type}</p>
                    <p className="text-[11px] text-stone-400 mt-0.5">{qr.qr_type} • {new Date(qr.created_at).toLocaleDateString()} • {qr.scan_count} scans</p>
                  </div>
                  <button onClick={() => remove(qr.id)} data-tip="Delete this QR" className="text-xs text-stone-300 hover:text-red-500 font-semibold">Delete</button>
                </div>
                <QRThumb id={qr.id} />
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

function QRThumb({ id }) {
  const [img, setImg] = useState(null);
  useEffect(() => { api(`/api/qr/${id}/`).then((d) => setImg(d.image_base64)).catch(() => {}); }, [id]);
  return (
    <div className="mt-3 mx-auto w-24 h-24 rounded-xl border border-stone-200 bg-white flex items-center justify-center overflow-hidden">
      {img ? <img src={`data:image/png;base64,${img}`} className="w-full h-full object-contain" alt="QR" /> : <span className="text-stone-300 text-xs">…</span>}
    </div>
  );
}
