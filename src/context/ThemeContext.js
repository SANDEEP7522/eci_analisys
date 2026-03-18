'use client';

import { createContext, useContext, useEffect, useState } from 'react';

// ── Theme tokens ──────────────────────────────────────────────────────────────
export const THEMES = {
  dark: {
    name: 'dark',
    bg: '#0F172A',
    bgCard: 'rgba(255,255,255,0.04)',
    bgCardSolid: '#1E293B',
    border: 'rgba(255,255,255,0.08)',
    borderHi: 'rgba(245,158,11,0.45)',
    text: '#eef1f6',
    textSec: 'rgba(255,255,255,0.55)',
    textMut: 'rgba(255,255,255,0.28)',
    textGhost: 'rgba(255,255,255,0.1)',
    sidebar: '#0B1221',
    header: 'rgba(11,18,33,0.92)',
    accent: '#f59e0b',
    accentBg: 'rgba(245,158,11,0.1)',
    grid: 'rgba(255,255,255,0.05)',
    tip: 'rgba(11,18,33,0.96)',
    inp: 'rgba(255,255,255,0.05)',
    inpBd: 'rgba(255,255,255,0.1)',
    ok: '#10b981',
    no: '#ef4444',
    info: '#6366f1',
    mapBase: '#162033',
    mapStroke: '#2a3f5f',
    mapHi: '#f59e0b',
    tblStripe: 'rgba(255,255,255,0.015)',
    tblHov: 'rgba(255,255,255,0.04)',
    shadow: 'rgba(0,0,0,0.5)',
  },
  light: {
    name: 'light',
    bg: '#f2f5fc',
    bgCard: 'rgba(255,255,255,0.85)',
    bgCardSolid: '#ffffff',
    border: '#e4eaf5',
    borderHi: '#14b8a6',
    text: '#1a2035',
    textSec: '#5a6480',
    textMut: '#9aa5be',
    textGhost: '#d0d8ed',
    sidebar: '#f8faff',
    header: 'rgba(248,250,255,0.97)',
    accent: '#14b8a6',
    accentBg: 'rgba(20,184,166,0.08)',
    grid: 'rgba(0,0,0,0.04)',
    tip: '#ffffff',
    inp: '#f1f5fb',
    inpBd: '#c8d3e8',
    ok: '#22c55e',
    no: '#ef4444',
    info: '#6366f1',
    mapBase: '#dce8f8',
    mapStroke: '#a8b8d0',
    mapHi: '#14b8a6',
    tblStripe: '#f8fafd',
    tblHov: '#f0f5ff',
    shadow: 'rgba(20,184,166,0.10)',
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
