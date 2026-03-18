'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function StateBarChart({ data, dataKey = 'turnout', nameKey = 'state', height = 320 }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center bg-gray-50 dark:bg-[var(--t-sidebar)]/30 rounded-xl border border-dashed border-gray-200 dark:border-[var(--t-border)] text-gray-400 text-sm" style={{ height }}>
        No state data
      </div>
    );
  }

  return (
    <div style={{ height, width: '100%' }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 80 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148,163,184,0.2)" />
          <XAxis
            dataKey={nameKey}
            angle={-40}
            textAnchor="end"
            height={90}
            interval={0}
            tick={{ fill: '#64748b', fontSize: 10 }}
            axisLine={{ stroke: 'rgba(148,163,184,0.3)' }}
          />
          <YAxis
            tick={{ fill: '#64748b', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => dataKey === 'turnout' ? `${v}%` : v}
          />
          <Tooltip
            formatter={(v) => [dataKey === 'turnout' ? `${v}%` : v.toLocaleString(), dataKey === 'turnout' ? 'Turnout' : 'Seats']}
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.15)', fontSize: '12px' }}
            cursor={{ fill: 'rgba(59,130,246,0.05)' }}
          />
          <Bar dataKey={dataKey} radius={[5, 5, 0, 0]} maxBarSize={50}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color || '#1e3a8a'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
