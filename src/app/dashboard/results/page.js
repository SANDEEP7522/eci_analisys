'use client';

import { useState, useMemo } from 'react';
import { ArrowLeft, Filter, Search } from 'lucide-react';
import Link from 'next/link';

const DEMO_DATA = [
  { constituency: 'Varanasi', state: 'Uttar Pradesh', candidate: 'Narendra Modi', party: 'BJP', margin: 152513 },
  { constituency: 'Raebareli', state: 'Uttar Pradesh', candidate: 'Rahul Gandhi', party: 'INC', margin: 390030 },
  { constituency: 'Gandhinagar', state: 'Gujarat', candidate: 'Amit Shah', party: 'BJP', margin: 744716 },
  { constituency: 'Wayanad', state: 'Kerala', candidate: 'Rahul Gandhi', party: 'INC', margin: 364422 },
  { constituency: 'New Delhi', state: 'Delhi', candidate: 'Bansuri Swaraj', party: 'BJP', margin: 78370 },
];

export default function ResultsPage() {
  const [search, setSearch] = useState('');
  const [party, setParty] = useState('');

  const filtered = useMemo(() => {
    return DEMO_DATA.filter((row) => {
      const matchesSearch =
        !search ||
        row.constituency.toLowerCase().includes(search.toLowerCase()) ||
        row.candidate.toLowerCase().includes(search.toLowerCase());
      const matchesParty = !party || row.party === party;
      return matchesSearch && matchesParty;
    });
  }, [search, party]);

  const parties = Array.from(new Set(DEMO_DATA.map((d) => d.party)));

  return (
    <div className="space-y-4 pb-6">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
            Constituency Results
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            Simple demo table – no external API calls.
          </p>
        </div>
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline"
        >
          <ArrowLeft size={14} />
          Back
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center text-xs">
        <div className="flex items-center gap-1 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg px-2 py-1 flex-1">
          <Search size={14} className="text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search constituency or candidate…"
            className="bg-transparent outline-none flex-1 text-xs text-gray-700 dark:text-gray-100"
          />
        </div>
        <div className="flex items-center gap-1">
          <Filter size={14} className="text-gray-400 hidden sm:inline" />
          <select
            value={party}
            onChange={(e) => setParty(e.target.value)}
            className="border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-100 rounded-lg px-2 py-1 text-xs"
          >
            <option value="">All parties</option>
            {parties.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900">
        <table className="min-w-full text-xs">
          <thead className="bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-gray-300">
            <tr>
              <th className="px-3 py-2 text-left font-semibold">Constituency</th>
              <th className="px-3 py-2 text-left font-semibold">State</th>
              <th className="px-3 py-2 text-left font-semibold">Candidate</th>
              <th className="px-3 py-2 text-left font-semibold">Party</th>
              <th className="px-3 py-2 text-right font-semibold">Margin</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row) => (
              <tr
                key={`${row.constituency}-${row.candidate}`}
                className="border-t border-gray-100 dark:border-slate-800 hover:bg-gray-50/60 dark:hover:bg-slate-800/60"
              >
                <td className="px-3 py-2 whitespace-nowrap text-gray-900 dark:text-gray-100">
                  {row.constituency}
                </td>
                <td className="px-3 py-2 whitespace-nowrap">{row.state}</td>
                <td className="px-3 py-2 whitespace-nowrap">{row.candidate}</td>
                <td className="px-3 py-2 whitespace-nowrap">{row.party}</td>
                <td className="px-3 py-2 whitespace-nowrap text-right font-semibold">
                  {row.margin.toLocaleString('en-IN')}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-3 py-6 text-center text-gray-400 dark:text-gray-500"
                >
                  No matching results.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

