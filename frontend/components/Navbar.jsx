'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { useI18n } from '@/lib/i18n';
import Image from 'next/image';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { t, lang, setLang, languages } = useI18n();
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  const links = [
    ...(user ? [{ href: '/dashboard', label: 'My QR', tip: 'Your QR codes dashboard', icon: '/icons/feat-qrlogo.webp', active: true }] : []),
    { href: '/#features', label: t('nav_features'), tip: 'See what JAR QR can do', icon: '/icons/feat-colors.webp' },
    { href: '/#qrtypes', label: 'QR Types', tip: '11 types of QR codes', icon: '/icons/type-link.webp' },
    { href: '/pricing', label: t('nav_pricing'), tip: 'Plans & pricing', icon: '/icons/tab-plans.webp' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/85 backdrop-blur-xl border-b border-stone-200/80 shadow-[0_2px_20px_rgba(127,29,29,0.05)]">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-2.5 shrink-0" onClick={close}>
          <Image src="/logo.svg" alt="JAR Solutions" width={150} height={42} priority className="h-9 w-auto" />
        </Link>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center gap-1 text-sm text-stone-600 font-medium">
          {links.map((l) => (
            <Link key={l.href + l.label} href={l.href} data-tip={l.tip}
              className={'flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition hover:bg-wine-50 hover:text-wine-600 ' + (l.active ? 'text-wine-600 font-bold bg-wine-50' : '')}>
              <img src={l.icon} alt="" className="w-5 h-5 rounded-md" />
              {l.label}
            </Link>
          ))}
          {user?.is_staff && (
            <Link href="/admin" data-tip="Admin control center" className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-wine-600 font-semibold hover:bg-wine-50 transition">
              <img src="/icons/feat-admin.webp" alt="" className="w-5 h-5 rounded-md" />
              Admin
            </Link>
          )}
        </div>

        <div className="flex items-center gap-2.5">
          <select value={lang} onChange={(e) => setLang(e.target.value)} aria-label="Language"
            data-tip="Switch language"
            className="text-xs md:text-sm px-2.5 py-2 rounded-lg border border-stone-200 bg-white text-stone-700 outline-none cursor-pointer">
            {languages.map((l) => <option key={l.code} value={l.code}>{l.native_name || l.name}</option>)}
          </select>
          {user ? (
            <>
              <Link href="/dashboard" className="wine-btn px-4 md:px-5 py-2 text-sm hidden sm:block">{user.first_name || user.username}</Link>
              <button onClick={logout} data-tip="Sign out"
                className="text-xs text-stone-400 hover:text-wine-600 hidden sm:block px-2 py-2">Logout</button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm text-stone-600 hover:text-wine-600 hidden sm:block">{t('nav_login')}</Link>
              <Link href="/register" className="wine-btn px-4 md:px-5 py-2 text-sm">{t('nav_get_started')}</Link>
            </>
          )}
          {/* Mobile hamburger */}
          <button onClick={() => setOpen(!open)} aria-label="Toggle menu" aria-expanded={open} data-tip-pos="bottom" data-tip="Menu"
            className="md:hidden p-2 rounded-lg border border-stone-200 text-stone-600 hover:border-wine-400 hover:text-wine-600 transition">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {open ? <path d="M5 5l10 10M15 5L5 15" /> : <path d="M3 5h14M3 10h14M3 15h14" />}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu panel */}
      {open && (
        <div className="md:hidden border-t border-stone-200/80 bg-white/95 backdrop-blur-xl anim-fade-up">
          <div className="px-4 py-3 flex flex-col gap-1 text-sm font-medium text-stone-600">
            {links.map((l) => (
              <Link key={'m-' + l.href + l.label} href={l.href} onClick={close}
                className={'flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition hover:bg-wine-50 hover:text-wine-600 ' + (l.active ? 'text-wine-600 font-bold bg-wine-50' : '')}>
                <img src={l.icon} alt="" className="w-6 h-6 rounded-md" />
                {l.label}
              </Link>
            ))}
            {user?.is_staff && (
              <Link href="/admin" onClick={close} className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-wine-600 font-semibold hover:bg-wine-50">
                <img src="/icons/feat-admin.webp" alt="" className="w-6 h-6 rounded-md" />
                Admin
              </Link>
            )}
            <div className="border-t border-stone-200 my-1.5" />
            {user ? (
              <>
                <Link href="/dashboard" onClick={close} className="wine-btn px-4 py-2.5 text-center text-sm">{user.first_name || user.username}</Link>
                <button onClick={() => { logout(); close(); }} className="text-xs text-stone-400 hover:text-wine-600 py-1.5">Logout</button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={close} className="px-3 py-2.5 text-stone-600">{t('nav_login')}</Link>
                <Link href="/register" onClick={close} className="wine-btn px-4 py-2.5 text-center text-sm">{t('nav_get_started')}</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
