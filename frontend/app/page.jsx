'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Reveal from '@/components/Reveal';
import { useI18n } from '@/lib/i18n';

const qrTypes = [
  { img: '/icons/type-link.webp', name: 'Website URL', desc: 'Drive traffic to any link instantly' },
  { img: '/icons/type-wifi.webp', name: 'WiFi', desc: 'Guests connect without typing passwords' },
  { img: '/icons/type-vcard.webp', name: 'vCard', desc: 'Digital business cards that impress' },
  { img: '/icons/type-email.webp', name: 'Email', desc: 'Pre-filled emails with one scan' },
  { img: '/icons/type-whatsapp.webp', name: 'WhatsApp', desc: 'Open chats with pre-typed messages' },
  { img: '/icons/type-event.webp', name: 'Event', desc: 'Save-the-date calendar invites' },
  { img: '/icons/type-phone.webp', name: 'SMS & Phone', desc: 'Call or text with a single scan' },
  { img: '/icons/feat-qrlogo.webp', name: 'Logo Inside QR', desc: 'Your brand, embedded in the code' },
];

const features = [
  { img: '/icons/feat-qrlogo.webp', title: 'Logo Inside QR', desc: 'Embed your brand logo in the center — like QRCode Monkey & Canva, included in every plan.' },
  { img: '/icons/feat-colors.webp', title: 'Custom Colors & Frames', desc: 'Match your brand with any foreground/background colors and precision sizing.' },
  { img: '/icons/feat-globe.webp', title: 'Multi-Language UI', desc: 'English, Tamil, Hindi and more — switch languages instantly, saved to your profile.' },
  { img: '/icons/feat-payments.webp', title: 'Multiple Payment Gateways', desc: 'Razorpay, direct UPI and more — configured dynamically from the admin panel.' },
  { img: '/icons/feat-analytics.webp', title: 'Scan Analytics', desc: 'Track how many times each QR code is scanned.' },
  { img: '/icons/feat-hd.webp', title: 'High-Resolution PNG', desc: 'Print-ready downloads for packaging, banners and billboards.' },
  { img: '/icons/feat-shield.webp', title: 'Secure & Private', desc: 'Your data never leaves your server. Enterprise-grade Django security.' },
  { img: '/icons/feat-admin.webp', title: 'Fully Dynamic Admin', desc: 'Plans, prices, gateways, languages — change everything without touching code.' },
];

export default function Home() {
  const { t } = useI18n();
  return (
    <main className="relative overflow-hidden">
      <section className="relative hero-grid">
        <div className="soft-blob w-[520px] h-[520px] bg-wine-600 top-[-120px] right-[-140px]" />
        <div className="soft-blob w-[380px] h-[380px] bg-red-400 bottom-[-80px] left-[-120px]" />
        <div className="max-w-7xl mx-auto px-4 md:px-6 pt-14 md:pt-20 pb-16 grid md:grid-cols-2 gap-10 items-center relative z-10">
          <div>
            <motion.div initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }}>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-wine-50 border border-wine-100 text-wine-600 text-xs font-bold tracking-wide mb-6">
                <span className="w-2 h-2 rounded-full bg-wine-500 anim-pulse-dot" aria-hidden="true" />
                {t('hero_badge')}
              </span>
              <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.05] tracking-tight text-stone-900">
                {t('hero_title_1')}<br /><span className="grad-text">{t('hero_title_2')}</span>
              </h1>
              <p className="mt-6 text-lg text-stone-500 max-w-md">{t('hero_sub')}</p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/register" data-tip="Free account, no card needed" className="wine-btn px-8 py-3.5">{t('hero_cta')} →</Link>
                <Link href="/pricing" data-tip="See plans and pricing" className="px-8 py-3.5 rounded-[14px] border-2 border-stone-200 font-semibold text-stone-700 hover:border-wine-500 hover:text-wine-600 transition">{t('hero_cta2')}</Link>
              </div>
              <p className="mt-4 text-xs text-stone-400">{t('hero_note')}</p>
            </motion.div>
          </div>
          <div className="relative h-[400px] hidden md:block">
            <motion.div animate={{ y: [0, -14, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-2 left-6 w-60 p-5 rounded-3xl bg-white border border-stone-200 shadow-[0_30px_60px_rgba(127,29,29,0.14)] rotate-[-5deg]">
              <img src="/demo-qr-wifi.png" alt="WiFi QR" className="w-36 h-36 mx-auto rounded-xl border border-stone-100" />
              <p className="text-center mt-3 text-sm font-bold text-stone-700">WiFi Access</p>
            </motion.div>
            <motion.div animate={{ y: [0, 14, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              className="absolute bottom-0 right-2 w-60 p-5 rounded-3xl bg-white border border-stone-200 shadow-[0_30px_60px_rgba(127,29,29,0.14)] rotate-[4deg]">
              <img src="/demo-qr-logo.png" alt="Branded QR" className="w-36 h-36 mx-auto rounded-xl border border-stone-100" />
              <p className="text-center mt-3 text-sm font-bold text-wine-600">Branded QR + Logo</p>
            </motion.div>
          </div>
        </div>
      </section>

      <section id="features" className="max-w-7xl mx-auto px-4 md:px-6 py-16">
        <Reveal>
          <h2 className="text-4xl md:text-5xl font-extrabold text-center text-stone-900">{t('feat_title')} <span className="grad-text">JAR QR</span>?</h2>
          <p className="text-center text-stone-500 mt-4 max-w-xl mx-auto">{t('feat_sub')}</p>
        </Reveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-12">
          {features.map((ft, i) => (
            <Reveal key={ft.title} delay={i * 0.06}>
              <div data-tip={ft.title} className="card-lift p-5 rounded-2xl bg-white border border-stone-200 h-full flex items-start gap-4">
                <img src={ft.img} alt={ft.title} className="w-12 h-12 rounded-xl shadow-md flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-stone-800">{ft.title}</h3>
                  <p className="text-sm text-stone-500 mt-1.5 leading-relaxed">{ft.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="qrtypes" className="bg-gradient-to-b from-white via-[#fdf5f5] to-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-16">
          <Reveal>
            <h2 className="text-4xl md:text-5xl font-extrabold text-center text-stone-900">{t('types_title')} <span className="grad-text">{t('types_sub')}</span></h2>
          </Reveal>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-12">
            {qrTypes.map((qt, i) => (
              <Reveal key={qt.name} delay={i * 0.05}>
                <div data-tip={qt.name} className="card-lift p-4 rounded-2xl bg-white border border-stone-200 flex items-start gap-3">
                  <img src={qt.img} alt={qt.name} className="w-10 h-10 rounded-lg shadow-md flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-stone-800 text-sm">{qt.name}</h3>
                    <p className="text-xs text-stone-500 mt-1 leading-relaxed">{qt.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 md:px-6 py-16">
        <Reveal>
          <div className="p-10 md:p-14 rounded-[28px] grad-anim text-white text-center shadow-[0_40px_80px_rgba(127,29,29,0.35)]">
            <h2 className="text-3xl md:text-4xl font-extrabold">{t('cta_title')}</h2>
            <p className="text-red-100 mt-4">{t('cta_sub')}</p>
            <Link href="/register" data-tip="Get started in 30 seconds" className="inline-block mt-8 px-10 py-4 rounded-2xl bg-white text-wine-700 font-bold text-lg hover:scale-[1.03] transition shadow-xl">
              {t('cta_btn')} →
            </Link>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
