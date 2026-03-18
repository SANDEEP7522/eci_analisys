'use client';

import { useState } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import Badge from '@/components/ui/Badge';

export default function ResultsTable({ data }) {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-white dark:bg-[var(--t-bgCardSolid)] rounded-2xl border border-dashed border-gray-200 dark:border-[var(--t-border)] text-gray-400 dark:text-gray-500">
        <div className="text-3xl mb-2">🔍</div>
        <div className="text-sm font-medium">No results match your filters</div>
      </div>
    );
  }

  const sortedData = [...data].sort((a, b) => {
    if (!sortConfig.key) return 0;
    if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
    if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const requestSort = (key) => {
    setSortConfig(prev => ({ key, direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc' }));
  };

  const SortIcon = ({ col }) => {
    if (sortConfig.key !== col) return <ArrowUpDown size={12} className="text-gray-300 dark:text-gray-600" />;
    return sortConfig.direction === 'asc'
      ? <ArrowUp size={12} className="text-blue-600 dark:text-blue-400" />
      : <ArrowDown size={12} className="text-blue-600 dark:text-blue-400" />;
  };

  const cols = [
    { key: 'constituency', label: 'Constituency' },
    { key: 'state',        label: 'State' },
    { key: 'candidate',    label: 'Candidate' },
    { key: 'party',        label: 'Party' },
    { key: 'margin',       label: 'Margin', right: true },
  ];

  return (
    <div className="bg-white dark:bg-[var(--t-bgCardSolid)] rounded-2xl shadow-sm border border-gray-100 dark:border-[var(--t-border)] overflow-hidden">

      {/* ── Mobile card view (shown on xs, hidden on md+) ── */}
      <div className="md:hidden divide-y divide-gray-100 dark:divide-slate-700">
        {sortedData.map((row, idx) => (
          <div key={idx} className="p-4 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="font-semibold text-gray-900 dark:text-gray-100 text-sm">{row.constituency}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{row.state}</div>
              </div>
              <Badge party={row.party}>{row.party}</Badge>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-700 dark:text-gray-300 font-medium">{row.candidate}</span>
              <span className="text-gray-500 dark:text-gray-400 font-mono">+{row.margin?.toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Desktop table (hidden on mobile, shown on md+) ── */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
          <thead className="bg-gray-50 dark:bg-[var(--t-sidebar)]/50">
            <tr>
              {cols.map(col => (
                <th
                  key={col.key}
                  scope="col"
                  onClick={() => requestSort(col.key)}
                  className={`px-5 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-[var(--t-bgCardSolid)] select-none transition-colors ${col.right ? 'text-right' : 'text-left'}`}
                >
                  <div className={`flex items-center gap-1.5 ${col.right ? 'justify-end' : ''}`}>
                    {col.label} <SortIcon col={col.key} />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
            {sortedData.map((row, idx) => (
              <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-[var(--t-bgCard)] transition-colors">
                <td className="px-5 py-3 text-sm font-semibold text-gray-900 dark:text-gray-100 whitespace-nowrap">{row.constituency}</td>
                <td className="px-5 py-3 text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">{row.state}</td>
                <td className="px-5 py-3 text-sm text-gray-800 dark:text-gray-200 whitespace-nowrap">{row.candidate}</td>
                <td className="px-5 py-3 whitespace-nowrap">
                  <Badge party={row.party}>{row.party}</Badge>
                </td>
                <td className="px-5 py-3 text-sm text-right font-mono font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                  +{row.margin?.toLocaleString() || '--'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer summary */}
      <div className="px-4 py-2.5 border-t border-gray-100 dark:border-[var(--t-border)] bg-gray-50 dark:bg-[var(--t-sidebar)]/30 text-xs text-gray-400 dark:text-gray-500">
        {sortedData.length} constituencies
      </div>
    </div>
  );
}
