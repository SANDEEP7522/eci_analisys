'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const PARTY_COLORS = {
  BJP: '#f97316', INC: '#1e3a8a', SP: '#ef4444', TMC: '#22c55e',
  DMK: '#7c3aed', TDP: '#06b6d4', JDU: '#6366f1', Others: '#94a3b8',
};

export default function SeatBarChart({ data, height = 360 }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center bg-gray-50 dark:bg-slate-900/30 rounded-xl border border-dashed border-gray-200 dark:border-slate-600 text-gray-400 dark:text-gray-500 text-sm" style={{ height }}>
        No seat data available
      </div>
    );
  }

  return (
    <div style={{ height, width: '100%' }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148,163,184,0.2)" />
          <XAxis
            dataKey="party"
            angle={-40}
            textAnchor="end"
            height={70}
            interval={0}
            tick={{ fill: '#64748b', fontSize: 11 }}
            axisLine={{ stroke: 'rgba(148,163,184,0.3)' }}
          />
          <YAxis
            tick={{ fill: '#64748b', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            cursor={{ fill: 'rgba(59,130,246,0.05)' }}
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.15)', fontSize: '12px' }}
          />
          <Bar dataKey="seats" name="Seats Won" radius={[5, 5, 0, 0]} maxBarSize={55}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={PARTY_COLORS[entry.party] || '#94a3b8'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
