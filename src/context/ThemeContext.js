'use client';

import { createContext, useContext, useEffect, useState } from 'react';

// ── Theme tokens ──────────────────────────────────────────────────────────────
export const THEMES = {
  dark: {
    name: 'dark',
    bg: '#03040d',
    bgCard: 'rgba(255,255,255,0.04)',
    bgCardSolid: '#0a0b18',
    border: 'rgba(255,255,255,0.07)',
    borderHi: 'rgba(255,107,0,0.45)',
    text: '#e8edf8',
    textSec: 'rgba(220,228,255,0.55)',
    textMut: 'rgba(220,228,255,0.28)',
    textGhost: 'rgba(220,228,255,0.08)',
    sidebar: '#020309',
    header: 'rgba(2,3,9,0.96)',
    accent: '#ff6b00',
    accentBg: 'rgba(255,107,0,0.1)',
    grid: 'rgba(255,255,255,0.04)',
    tip: 'rgba(9,11,24,0.98)',
    inp: 'rgba(255,255,255,0.05)',
    inpBd: 'rgba(255,255,255,0.1)',
    ok: '#10b981',
    no: '#ef4444',
    info: '#6366f1',
    mapBase: '#0d1020',
    mapStroke: '#1a2040',
    mapHi: '#ff6b00',
    tblStripe: 'rgba(255,255,255,0.015)',
    tblHov: 'rgba(255,107,0,0.05)',
    shadow: 'rgba(0,0,15,0.85)',
  },
  light: {
    name: 'light',
    bg: '#f2f5fc',
    bgCard: 'rgba(255,255,255,0.85)',
    bgCardSolid: '#ffffff',
    border: '#e4eaf5',
    borderHi: '#f97316',
    text: '#1a2035',
    textSec: '#5a6480',
    textMut: '#9aa5be',
    textGhost: '#d0d8ed',
    sidebar: '#f8faff',
    header: 'rgba(248,250,255,0.97)',
    accent: '#f97316',
    accentBg: 'rgba(249,115,22,0.08)',
    grid: 'rgba(0,0,0,0.04)',
    tip: '#ffffff',
    inp: '#f1f5fb',
    inpBd: '#c8d3e8',
    ok: '#22c55e',
    no: '#ef4444',
    info: '#6366f1',
    mapBase: '#dce8f8',
    mapStroke: '#a8b8d0',
    mapHi: '#f97316',
    tblStripe: '#f8fafd',
    tblHov: '#fff5f0',
    shadow: 'rgba(249,115,22,0.10)',
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
