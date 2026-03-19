'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
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

function Row({ label, children }) {
  return (
    <div className="flex flex-col gap-1">
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
        className="w-full appearance-none bg-[var(--t-bgCard)] border border-[var(--t-border)] text-[var(--t-text)] text-[11px] rounded-md pl-2.5 pr-7 py-1.5 focus:outline-none focus:border-[var(--t-accent)] hover:border-[var(--t-borderHi)] transition-colors cursor-pointer"
      >
        {options.map(o => (
          <option key={o} value={o} style={{ backgroundColor: 'var(--t-bgCardSolid)', color: 'var(--t-text)' }}>{o}</option>
        ))}
      </select>
      <ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--t-textMut)] pointer-events-none" />
    </div>
  );
}

function Pills({ value, options, onChange, cols = 3 }) {
  return (
    <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
      {options.map(o => (
        <button
          key={o}
          onClick={() => onChange(o)}
          className={`py-1 px-1 rounded text-[11px] font-semibold truncate transition-all ${
            value === o
              ? 'bg-[var(--t-accent)] text-white shadow shadow-teal-900/40'
              : 'bg-[var(--t-bgCard)] border border-[var(--t-border)] text-[var(--t-textSec)] hover:border-[var(--t-accent)] hover:text-[var(--t-text)]'
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
  const [f, setF]       = useState({ ...DEFAULTS, year: selectedYear || '2024' });
  const wrapRef         = useRef(null);

  useEffect(() => { if (selectedYear) setF(p => ({ ...p, year: selectedYear })); }, [selectedYear]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = e => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const onClick = e => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

  const set = key => val => setF(p => ({ ...p, [key]: val }));

  const activeCount = useMemo(
    () => Object.entries(f).filter(([k, v]) => v !== DEFAULTS[k]).length,
    [f],
  );

  const handleReset = () => setF({ ...DEFAULTS });
  const handleApply = () => { onApply?.(f); setOpen(false); };

  return (
    <div ref={wrapRef} className="relative">

      {/* ── Trigger ──────────────────────────────────────────────── */}
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--t-bgCardSolid)] border border-[var(--t-border)] hover:border-[var(--t-accent)] rounded-lg text-[var(--t-textSec)] hover:text-[var(--t-text)] transition-all text-[11px] font-medium group"
        title="Open Filters"
      >
        <SlidersHorizontal size={13} className="text-[var(--t-accent)]" />
        Filters
        {activeCount > 0 && (
          <span className="bg-[var(--t-accent)] text-white text-[9px] px-1.5 py-0.5 rounded-full min-w-[16px] text-center leading-none">
            {activeCount}
          </span>
        )}
        <ChevronDown
          size={11}
          className={`text-[var(--t-textMut)] transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* ── Dropdown ─────────────────────────────────────────────── */}
      {open && (
        <div className="absolute top-full right-0 mt-1.5 z-50 w-[340px] max-h-[80vh] bg-[var(--t-bgCardSolid)] border border-[var(--t-border)] rounded-xl shadow-[0_8px_32px_rgba(0,0,20,0.7),0_2px_8px_rgba(0,0,20,0.5)] flex flex-col overflow-hidden">

          {/* Header */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-[var(--t-border)] bg-[var(--t-sidebar)] flex-shrink-0">
            <div className="flex items-center gap-2">
              <SlidersHorizontal size={13} className="text-[var(--t-accent)]" />
              <span className="text-[12px] font-bold text-[var(--t-text)]">Filter Options</span>
              {activeCount > 0 && (
                <span className="bg-[var(--t-accentBg)] text-[var(--t-accent)] border border-[var(--t-borderHi)] text-[10px] px-2 py-0.5 rounded-full">
                  {activeCount} active
                </span>
              )}
            </div>
            <button
              onClick={() => setOpen(false)}
              className="p-1 rounded-md hover:bg-[var(--t-bgCard)] text-[var(--t-textSec)] hover:text-[var(--t-text)] transition-colors"
            >
              <X size={13} />
            </button>
          </div>

          {/* Scrollable body */}
          <div className="flex-1 overflow-y-auto p-2.5 flex flex-col gap-2">

            <Section title="Election Year">
              <Pills value={f.year} options={YEARS} onChange={set('year')} cols={3} />
            </Section>

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

            <Section title="Party & Alliance">
              <Row label="Party">
                <Sel value={f.party} options={PARTIES} onChange={set('party')} />
              </Row>
              <Row label="Alliance">
                <Pills value={f.alliance} options={ALLIANCES} onChange={set('alliance')} cols={3} />
              </Row>
            </Section>

            <Section title="Phase & Date Range">
              <Row label="Phase">
                <Sel value={f.phase} options={PHASES} onChange={set('phase')} />
              </Row>
              <Row label="Date Range">
                <div className="grid grid-cols-2 gap-2">
                  <input type="date" value={f.dateFrom} onChange={e => set('dateFrom')(e.target.value)}
                    className="bg-[var(--t-bgCard)] border border-[var(--t-border)] text-[var(--t-text)] text-[11px] rounded-md px-2 py-1.5 focus:outline-none focus:border-[var(--t-accent)] w-full" />
                  <input type="date" value={f.dateTo} onChange={e => set('dateTo')(e.target.value)}
                    className="bg-[var(--t-bgCard)] border border-[var(--t-border)] text-[var(--t-text)] text-[11px] rounded-md px-2 py-1.5 focus:outline-none focus:border-[var(--t-accent)] w-full" />
                </div>
              </Row>
            </Section>

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
          <div className="flex items-center gap-2 px-3 py-2 border-t border-[var(--t-border)] bg-[var(--t-sidebar)] flex-shrink-0">
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--t-bgCard)] hover:bg-[var(--t-bgCard)] border border-[var(--t-border)] text-[var(--t-textSec)] text-[11px] rounded-md transition-colors"
            >
              <RotateCcw size={11} /> Reset
            </button>
            <button
              onClick={handleApply}
              className="flex-1 py-1.5 bg-[var(--t-accent)] hover:opacity-90 text-white text-[12px] font-semibold rounded-md transition-opacity shadow-md"
            >
              Apply {activeCount > 0 && `(${activeCount})`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
