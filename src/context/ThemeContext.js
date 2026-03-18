'use client';

import { createContext, useContext, useEffect, useState } from 'react';

// ── Theme tokens ──────────────────────────────────────────────────────────────
export const THEMES = {
  dark: {
    name: 'dark',
    bg: '#060a10',
    bgCard: 'rgba(255,255,255,0.028)',
    bgCardSolid: '#0c1118',
    border: 'rgba(255,255,255,0.06)',
    borderHi: 'rgba(245,158,11,0.4)',
    text: '#eef1f6',
    textSec: 'rgba(255,255,255,0.55)',
    textMut: 'rgba(255,255,255,0.25)',
    textGhost: 'rgba(255,255,255,0.1)',
    sidebar: '#080d15',
    header: 'rgba(6,10,16,0.88)',
    accent: '#f59e0b',
    accentBg: 'rgba(245,158,11,0.1)',
    grid: 'rgba(255,255,255,0.04)',
    tip: 'rgba(10,14,22,0.96)',
    inp: 'rgba(255,255,255,0.04)',
    inpBd: 'rgba(255,255,255,0.08)',
    ok: '#10b981',
    no: '#ef4444',
    info: '#6366f1',
    mapBase: '#131c2a',
    mapStroke: '#1e2d40',
    mapHi: '#f59e0b',
    tblStripe: 'rgba(255,255,255,0.012)',
    tblHov: 'rgba(255,255,255,0.03)',
    shadow: 'rgba(0,0,0,0.4)',
  },
  light: {
    name: 'light',
    bg: '#f0f2f5',
    bgCard: '#ffffff',
    bgCardSolid: '#ffffff',
    border: '#e0e5ec',
    borderHi: '#d97706',
    text: '#0f172a',
    textSec: '#475569',
    textMut: '#94a3b8',
    textGhost: '#cbd5e1',
    sidebar: '#ffffff',
    header: 'rgba(255,255,255,0.9)',
    accent: '#d97706',
    accentBg: 'rgba(217,119,6,0.08)',
    grid: 'rgba(0,0,0,0.06)',
    tip: 'rgba(255,255,255,0.97)',
    inp: '#f1f5f9',
    inpBd: '#d1d5db',
    ok: '#059669',
    no: '#dc2626',
    info: '#4f46e5',
    mapBase: '#dfe5ed',
    mapStroke: '#a0aec0',
    mapHi: '#d97706',
    tblStripe: '#f8fafc',
    tblHov: '#f1f5f9',
    shadow: 'rgba(0,0,0,0.08)',
  },
};

// ── Context ───────────────────────────────────────────────────────────────────
const ThemeCtx = createContext(null);

export const useTheme = () => {
  const ctx = useContext(ThemeCtx);
  if (!ctx) throw new Error('useTheme must be used inside ThemeContextProvider');
  return ctx;
};

// ── Inject CSS variables into :root ──────────────────────────────────────────
function injectCSSVars(tokens) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  Object.entries(tokens).forEach(([key, val]) => {
    if (key !== 'name') root.style.setProperty(`--t-${key}`, val);
  });
  // Also set data-theme for scoped selectors
  root.setAttribute('data-theme', tokens.name);
}

// ── Provider ──────────────────────────────────────────────────────────────────
export function ThemeContextProvider({ children, defaultTheme = 'dark' }) {
  const [themeName, setThemeName] = useState(defaultTheme);
  const theme = THEMES[themeName] || THEMES.dark;

  // Inject on mount + change
  useEffect(() => {
    injectCSSVars(theme);
    // Sync with Tailwind dark class
    document.documentElement.classList.toggle('dark', theme.name === 'dark');
    // Persist preference
    try { localStorage.setItem('eci-theme', theme.name); } catch {}
  }, [theme]);

  // Restore persisted preference on first mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('eci-theme');
      if (saved && THEMES[saved]) setThemeName(saved);
    } catch {}
  }, []);

  const toggle  = () => setThemeName(n => n === 'dark' ? 'light' : 'dark');
  const setTheme = name => { if (THEMES[name]) setThemeName(name); };

  return (
    <ThemeCtx.Provider value={{ theme, themeName, toggle, setTheme }}>
      {children}
    </ThemeCtx.Provider>
  );
}
