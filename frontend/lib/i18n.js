'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { api } from './api';
import { useAuth } from './AuthContext';

const FALLBACK = {
  nav_features: 'Features', nav_pricing: 'Pricing', nav_login: 'Login', nav_get_started: 'Get Started',
  hero_badge: 'JAR SOLUTIONS PRESENTS', hero_title_1: 'QR Codes,', hero_title_2: 'Reimagined.',
  hero_sub: 'Create stunning, customizable QR codes in seconds. From WiFi to WhatsApp — one platform for every need.',
  hero_cta: 'Create Free QR', hero_cta2: 'View Pricing', hero_note: 'Free plan: 2 QR codes • No credit card needed',
  feat_title: 'Why choose', feat_sub: 'Everything you need to create, manage and scale QR codes.',
  types_title: 'Every QR type', types_sub: 'you need',
  cta_title: 'Ready to get started?', cta_sub: 'Join JAR QR today — free forever plan available.', cta_btn: 'Start Creating Free',
  dash_welcome: 'Welcome', dash_pro: 'JAR Pro — Unlimited QR codes', dash_guest_used: 'QR codes used',
  dash_upgrade: 'Upgrade to Pro', dash_create: 'Create QR Code', dash_title_ph: 'Title (optional)',
  dash_generate: 'Generate QR Code', dash_download: 'Download PNG', dash_mine: 'My QR Codes',
  limit_alert: 'Guest limit reached. Upgrade to JAR Pro for unlimited codes!',
  pricing_title: 'Simple, honest', pricing_sub: 'Start free. Upgrade when you grow. Cancel anytime.',
  login_title: 'Welcome', login_sub: 'Login to your JAR QR account', login_btn: 'Login',
  reg_title: 'Create', reg_sub: 'Free plan: 2 QR codes. No card needed.', reg_btn: 'Create Free Account',
};

const I18nContext = createContext({ t: (k) => FALLBACK[k] || k, lang: 'en', setLang: () => {}, languages: [] });

export function I18nProvider({ children }) {
  const [lang, setLangState] = useState('en');
  const [dict, setDict] = useState(FALLBACK);
  const [languages, setLanguages] = useState([{ code: 'en', name: 'English', native_name: 'English' }]);
  const { user, setUser } = useAuth();

  useEffect(() => {
    api('/api/core/languages/', { auth: false }).then((l) => { if (l.length) setLanguages(l); }).catch(() => {});
    const saved = localStorage.getItem('jar_lang') || 'en';
    loadLang(saved);
  }, []);

  const loadLang = async (code) => {
    setLangState(code);
    localStorage.setItem('jar_lang', code);
    try {
      const d = await api(`/api/core/translations/?lang=${code}`, { auth: false });
      setDict({ ...FALLBACK, ...d.translations });
    } catch { setDict(FALLBACK); }
  };

  const setLang = async (code) => {
    await loadLang(code);
    if (user) {
      try {
        const u = await api('/api/auth/me/', { method: 'PATCH', body: { language: code } });
        setUser && setUser(u);
      } catch { /* not critical */ }
    }
  };

  const t = (k) => dict[k] || FALLBACK[k] || k;
  return <I18nContext.Provider value={{ t, lang, setLang, languages }}>{children}</I18nContext.Provider>;
}

export const useI18n = () => useContext(I18nContext);
