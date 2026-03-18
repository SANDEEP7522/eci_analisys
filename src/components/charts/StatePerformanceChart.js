'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const DATA = [
  { state: 'UP', BJP: 33, INC: 6, SP: 37, Others: 4 },
  { state: 'MH', BJP: 23, INC: 13, SS: 9, Others: 3 },
  { state: 'WB', TMC: 29, BJP: 12, INC: 1, Others: 0 },
  { state: 'TN', DMK: 22, INC: 9, BJP: 0, AIADMK: 0, Others: 8 },
  { state: 'BR', JDU: 12, BJP: 17, INC: 3, Others: 8 },
  { state: 'RJ', BJP: 14, INC: 8, Others: 3 },
  { state: 'GJ', BJP: 26, INC: 0, Others: 0 },
];

const COLORS = ['#f97316','#6366f1','#ef4444','#22c55e','#a855f7','#14b8a6','#94a3b8'];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[var(--t-bgCardSolid)] border border-[var(--t-border)] rounded px-2 py-1.5 text-[10px]">
      <div className="font-semibold text-[var(--t-text)] mb-1">{label}</div>
      {payload.map(p => (
        <div key={p.dataKey} style={{ color: p.fill }}>{p.dataKey}: {p.value}</div>
      ))}
    </div>
  );
};

export default function StatePerformanceChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={DATA} margin={{ top: 4, right: 4, bottom: 4, left: -25 }} barSize={6} barGap={1}>
        <XAxis dataKey="state" tick={{ fontSize: 9, fill: 'var(--t-textMut)' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 9, fill: 'var(--t-textMut)' }} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip />} />
        {['BJP','INC','SP','TMC','DMK','JDU','Others'].map((k, i) => (
          <Bar key={k} dataKey={k} fill={COLORS[i]} stackId="a" radius={i === 6 ? [3,3,0,0] : [0,0,0,0]} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
