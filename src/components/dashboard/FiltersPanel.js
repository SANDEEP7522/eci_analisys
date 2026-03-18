'use client';

import { useState, useEffect, useMemo } from 'react';
import { X, SlidersHorizontal, RotateCcw, ChevronDown } from 'lucide-react';

const YEARS     = ['2024', '2019', '2014', '2009', '2004', '1999'];
const REGIONS   = ['All India', 'North India', 'South India', 'East India', 'West India', 'Central India', 'Northeast India'];
const STATES    = ['All States', 'Uttar Pradesh', 'Maharashtra', 'West Bengal', 'Bihar', 'Tamil Nadu', 'Rajasthan', 'Gujarat', 'Madhya Pradesh', 'Andhra Pradesh', 'Karnataka', 'Punjab', 'Telangana', 'Kerala', 'Odisha', 'Haryana', 'Delhi', 'Assam', 'Jharkhand', 'Chhattisgarh', 'Uttarakhand', 'Himachal Pradesh', 'Tripura', 'Goa', 'Manipur', 'Meghalaya', 'Nagaland', 'Arunachal Pradesh', 'Mizoram', 'Sikkim'];
const PARTIES   = ['All Parties', 'BJP', 'INC', 'SP', 'TMC', 'DMK', 'TDP', 'JDU', 'BSP', 'CPI(M)', 'AAP', 'SAD', 'NCP', 'SS', 'YSRCP', 'BJD', 'RJD', 'LJP', 'AIMIM'];
const ALLIANCES = ['All Alliances', 'NDA', 'INDIA', 'Others / Independents'];
const PHASES    = ['All Phases', 'Phase 1 (Apr 19)', 'Phase 2 (Apr 26)', 'Phase 3 (May 7)', 'Phase 4 (May 13)', 'Phase 5 (May 20)', 'Phase 6 (May 25)', 'Phase 7 (Jun 1)'];
const CON_TYPES = ['All Types', 'Urban', 'Semi-Urban', 'Rural'];
const MARGINS   = ['Any Margin', 'Close (< 5K)', 'Moderate (5K–50K)', 'Landslide (> 50K)'];
const TURNOUTS  = ['Any Turnout', 'Low (< 50%)', 'Medium (50–65%)', 'High (> 65%)'];
const STATUSES  = ['All Results', 'Won', 'Leading', 'Lost', 'Trailing'];

const DEFAULTS = {
  year: '2024', region: 'All India', state: 'All States',
  party: 'All Parties', alliance: 'All Alliances', phase: 'All Phases',
  conType: 'All Types', margin: 'Any Margin', turnout: 'Any Turnout',
  status: 'All Results', dateFrom: '2024-04-19', dateTo: '2024-06-01',
};

function Row({ label, children, half }) {
  return (
    <div className={`flex flex-col gap-1 ${half ? '' : ''}`}>
      <span className="text-[10px] text-[var(--t-textMut)] font-semibold uppercase tracking-wider">{label}</span>
      {children}
    </div>
  );
}

function Sel({ value, options, onChange }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full appearance-none bg-[var(--t-bgCard)] border border-[var(--t-border)] text-[var(--t-text)] text-[11px] rounded-md pl-2.5 pr-7 py-1.5 focus:outline-none focus:border-blue-500 hover:border-[var(--t-borderHi)] transition-colors cursor-pointer"
      >
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      <ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--t-textMut)] pointer-events-none" />
    </div>
  );
}

function Pills({ value, options, onChange, colorActive = 'bg-blue-600 text-white', cols = 3 }) {
  return (
    <div className={`grid gap-1`} style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
      {options.map(o => (
        <button
          key={o}
          onClick={() => onChange(o)}
          className={`py-1 px-1 rounded text-[11px] font-semibold truncate transition-all ${
            value === o
              ? `${colorActive} shadow shadow-blue-900/40`
              : 'bg-[var(--t-bgCard)] border border-[var(--t-border)] text-[var(--t-textSec)] hover:border-blue-500 hover:text-[var(--t-text)]'
          }`}
          title={o}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

function Section({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-[var(--t-border)] rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-3 py-2 bg-[var(--t-sidebar)] hover:bg-[var(--t-accentBg)] transition-colors"
      >
        <span className="text-[11px] font-bold text-[var(--t-textSec)]">{title}</span>
        <ChevronDown size={12} className={`text-[var(--t-textMut)] transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <div className="p-3 flex flex-col gap-3 bg-[var(--t-bgCard)]">{children}</div>}
    </div>
  );
}

export default function FiltersPanel({ selectedYear, onApply }) {
  const [open, setOpen] = useState(false);
  const [f, setF] = useState({ ...DEFAULTS, year: selectedYear || '2024' });

  useEffect(() => { if (selectedYear) setF(p => ({ ...p, year: selectedYear })); }, [selectedYear]);

  useEffect(() => {
    if (!open) return;
    const handle = e => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', handle);
    return () => window.removeEventListener('keydown', handle);
  }, [open]);

  const set = key => val => setF(p => ({ ...p, [key]: val }));

  // Count active (non-default) filters
  const activeCount = useMemo(() =>
    Object.entries(f).filter(([k, v]) => v !== DEFAULTS[k]).length,
  [f]);

  const handleReset = () => setF({ ...DEFAULTS });
  const handleApply = () => { onApply?.(f); setOpen(false); };

  return (
    <>
      {/* ── Trigger ──────────────────────────────────────────────── */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--t-bgCardSolid)] border border-[var(--t-border)] hover:border-blue-500 rounded-lg text-[var(--t-textSec)] hover:text-white transition-all text-[11px] font-medium group"
        title="Open Filters"
      >
        <SlidersHorizontal size={13} className="text-blue-400 group-hover:text-blue-300" />
        Filters
        {activeCount > 0 && (
          <span className="bg-blue-600 text-white text-[9px] px-1.5 py-0.5 rounded-full min-w-[16px] text-center leading-none">
            {activeCount}
          </span>
        )}
      </button>

      {/* ── Backdrop ─────────────────────────────────────────────── */}
      {open && (
        <div className="fixed inset-0 z-40 bg-black/65 backdrop-blur-sm" onClick={() => setOpen(false)} />
      )}

      {/* ── Modal ────────────────────────────────────────────────── */}
      {open && (
        <div className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] max-h-[88vh] bg-[var(--t-bgCardSolid)] border border-[var(--t-border)] rounded-xl shadow-2xl shadow-black/70 flex flex-col overflow-hidden">

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--t-border)] bg-[var(--t-sidebar)] flex-shrink-0">
            <div className="flex items-center gap-2">
              <SlidersHorizontal size={15} className="text-blue-400" />
              <span className="text-[13px] font-bold text-white">Filter Options</span>
              {activeCount > 0 && (
                <span className="bg-blue-600/20 text-blue-400 border border-blue-500/30 text-[10px] px-2 py-0.5 rounded-full">
                  {activeCount} active
                </span>
              )}
            </div>
            <button onClick={() => setOpen(false)} className="p-1 rounded-md hover:bg-[var(--t-bgCard)] text-[var(--t-textSec)] hover:text-white transition-colors">
              <X size={15} />
            </button>
          </div>

          {/* Scrollable body */}
          <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2.5">

            {/* ── Election Year ── */}
            <Section title="Election Year">
              <Pills value={f.year} options={YEARS} onChange={set('year')} cols={6} />
            </Section>

            {/* ── Geography ── */}
            <Section title="Geography">
              <div className="grid grid-cols-2 gap-2">
                <Row label="Region">
                  <Sel value={f.region} options={REGIONS} onChange={set('region')} />
                </Row>
                <Row label="State">
                  <Sel value={f.state} options={STATES} onChange={set('state')} />
                </Row>
              </div>
            </Section>

            {/* ── Party & Alliance ── */}
            <Section title="Party & Alliance">
              <Row label="Party">
                <Sel value={f.party} options={PARTIES} onChange={set('party')} />
              </Row>
              <Row label="Alliance">
                <Pills value={f.alliance} options={ALLIANCES} onChange={set('alliance')} cols={3} />
              </Row>
            </Section>

            {/* ── Election Phase & Date ── */}
            <Section title="Phase & Date Range">
              <Row label="Phase">
                <Sel value={f.phase} options={PHASES} onChange={set('phase')} />
              </Row>
              <Row label="Date Range">
                <div className="grid grid-cols-2 gap-2">
                  <input type="date" value={f.dateFrom} onChange={e => set('dateFrom')(e.target.value)}
                    className="bg-[var(--t-bgCard)] border border-[var(--t-border)] text-[var(--t-text)] text-[11px] rounded-md px-2 py-1.5 focus:outline-none focus:border-blue-500 w-full" />
                  <input type="date" value={f.dateTo} onChange={e => set('dateTo')(e.target.value)}
                    className="bg-[var(--t-bgCard)] border border-[var(--t-border)] text-[var(--t-text)] text-[11px] rounded-md px-2 py-1.5 focus:outline-none focus:border-blue-500 w-full" />
                </div>
              </Row>
            </Section>

            {/* ── Constituency & Result ── */}
            <Section title="Constituency & Result" defaultOpen={false}>
              <div className="grid grid-cols-2 gap-2">
                <Row label="Constituency Type">
                  <Sel value={f.conType} options={CON_TYPES} onChange={set('conType')} />
                </Row>
                <Row label="Result Status">
                  <Sel value={f.status} options={STATUSES} onChange={set('status')} />
                </Row>
              </div>
              <Row label="Winning Margin">
                <Pills value={f.margin} options={MARGINS} onChange={set('margin')} cols={2} />
              </Row>
              <Row label="Voter Turnout">
                <Pills value={f.turnout} options={TURNOUTS} onChange={set('turnout')} cols={2} />
              </Row>
            </Section>

          </div>

          {/* Footer */}
          <div className="flex items-center gap-2 px-4 py-3 border-t border-[var(--t-border)] bg-[var(--t-sidebar)] flex-shrink-0">
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--t-bgCard)] hover:bg-slate-600 text-[var(--t-textSec)] text-[12px] rounded-md transition-colors"
            >
              <RotateCcw size={11} /> Reset All
            </button>
            <button
              onClick={handleApply}
              className="flex-1 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-[12px] font-semibold rounded-md transition-colors shadow-md shadow-blue-900/30"
            >
              Apply Filters {activeCount > 0 && `(${activeCount})`}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
