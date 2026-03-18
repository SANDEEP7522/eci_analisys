'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

export default function TurnoutLineChart({ data, height = 300 }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center bg-gray-50 dark:bg-slate-900/30 rounded-xl border border-dashed border-gray-200 dark:border-slate-600 text-gray-400 text-sm" style={{ height }}>
        No turnout data
      </div>
    );
  }

  const avg = data.reduce((a, d) => a + d.turnout, 0) / data.length;

  return (
    <div style={{ height, width: '100%' }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 20, left: -10, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148,163,184,0.2)" />
          <XAxis dataKey="year" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis
            tick={{ fill: '#64748b', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            domain={['dataMin - 4', 'dataMax + 4']}
            tickFormatter={(v) => `${v}%`}
          />
          <Tooltip
            formatter={(v) => [`${v}%`, 'Turnout']}
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.15)', fontSize: '12px' }}
          />
          <ReferenceLine
            y={avg}
            stroke="#f97316"
            strokeDasharray="4 3"
            label={{ value: `Avg ${avg.toFixed(1)}%`, fill: '#f97316', fontSize: 10, position: 'left' }}
          />
          <Line
            type="monotone"
            dataKey="turnout"
            stroke="#1e3a8a"
            strokeWidth={2.5}
            dot={{ r: 5, fill: '#1e3a8a', strokeWidth: 2, stroke: '#fff' }}
            activeDot={{ r: 7, strokeWidth: 2, stroke: '#fff' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
