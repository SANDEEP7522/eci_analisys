'use client';

import { useState, useMemo } from 'react';
import { ArrowLeft, Filter, Search } from 'lucide-react';
import Link from 'next/link';

const DEMO_DATA = [
  { constituency: 'Varanasi',    state: 'Uttar Pradesh', candidate: 'Narendra Modi',  party: 'BJP', margin: 152513 },
  { constituency: 'Raebareli',   state: 'Uttar Pradesh', candidate: 'Rahul Gandhi',   party: 'INC', margin: 390030 },
  { constituency: 'Gandhinagar', state: 'Gujarat',       candidate: 'Amit Shah',      party: 'BJP', margin: 744716 },
  { constituency: 'Wayanad',     state: 'Kerala',        candidate: 'Rahul Gandhi',   party: 'INC', margin: 364422 },
  { constituency: 'New Delhi',   state: 'Delhi',         candidate: 'Bansuri Swaraj', party: 'BJP', margin: 78370  },
];

const PARTY_BADGE_COLOR = { BJP: '#f97316', INC: '#1e3a8a', SP: '#ef4444', TMC: '#22c55e' };

export default function ResultsPage() {
  const [search, setSearch] = useState('');
  const [party,  setParty]  = useState('');

  const filtered = useMemo(() =>
    DEMO_DATA.filter(row => {
      const q = search.toLowerCase();
      return (!search || row.constituency.toLowerCase().includes(q) || row.candidate.toLowerCase().includes(q))
          && (!party  || row.party === party);
    }),
  [search, party]);

  const parties = Array.from(new Set(DEMO_DATA.map(d => d.party)));

  return (
    <div className="h-screen flex flex-col bg-[var(--t-bg)] text-[var(--t-text)] p-4 gap-4">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[var(--t-text)]">Constituency Results</h1>
          <p className="text-xs text-[var(--t-textMut)]">Demo table — 2024 General Elections</p>
        </div>
        <Link href="/" className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors">
          <ArrowLeft size={14} /> Back to Dashboard
        </Link>
      </div>

      {/* Filters row */}
      <div className="flex gap-2 items-center">
        <div className="flex items-center gap-1.5 bg-[var(--t-bgCardSolid)] border border-[var(--t-border)] rounded-lg px-2.5 py-1.5 flex-1 hover:border-[var(--t-borderHi)] transition-colors">
          <Search size={13} className="text-[var(--t-textMut)]" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search constituency or candidate…"
            className="bg-transparent outline-none flex-1 text-xs text-[var(--t-text)] placeholder:text-[var(--t-textMut)]"
          />
        </div>
        <div className="flex items-center gap-1.5 bg-[var(--t-bgCardSolid)] border border-[var(--t-border)] rounded-lg px-2.5 py-1.5 hover:border-[var(--t-borderHi)] transition-colors">
          <Filter size={13} className="text-[var(--t-textMut)]" />
          <select
            value={party}
            onChange={e => setParty(e.target.value)}
            className="bg-transparent text-[var(--t-text)] text-xs outline-none cursor-pointer"
          >
            <option value="" style={{ background: 'var(--t-bgCardSolid)' }}>All Parties</option>
            {parties.map(p => (
              <option key={p} value={p} style={{ background: 'var(--t-bgCardSolid)' }}>{p}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto rounded-xl border border-[var(--t-border)]">
        <table className="min-w-full text-xs">
          <thead className="sticky top-0 bg-[var(--t-sidebar)]">
            <tr>
              {['Constituency', 'State', 'Candidate', 'Party', 'Margin'].map((h, i) => (
                <th
                  key={h}
                  className={`px-3 py-2.5 text-[var(--t-textMut)] font-semibold uppercase tracking-wider border-b border-[var(--t-border)] ${i === 4 ? 'text-right' : 'text-left'}`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(row => (
              <tr
                key={`${row.constituency}-${row.candidate}`}
                className="border-t border-[var(--t-border)] hover:bg-[var(--t-bgCard)] transition-colors"
              >
                <td className="px-3 py-2 font-medium text-[var(--t-text)] whitespace-nowrap">{row.constituency}</td>
                <td className="px-3 py-2 text-[var(--t-textSec)] whitespace-nowrap">{row.state}</td>
                <td className="px-3 py-2 text-[var(--t-textSec)] whitespace-nowrap">{row.candidate}</td>
                <td className="px-3 py-2 whitespace-nowrap">
                  <span
                    className="px-2 py-0.5 rounded text-[10px] font-bold"
                    style={{ backgroundColor: (PARTY_BADGE_COLOR[row.party] || '#64748b') + '25', color: PARTY_BADGE_COLOR[row.party] || 'var(--t-textSec)' }}
                  >
                    {row.party}
                  </span>
                </td>
                <td className="px-3 py-2 text-right font-semibold text-[var(--t-text)] font-mono whitespace-nowrap">
                  {row.margin.toLocaleString('en-IN')}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-3 py-10 text-center text-[var(--t-textMut)]">
                  No matching results found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
