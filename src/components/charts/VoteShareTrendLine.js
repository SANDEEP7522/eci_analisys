'use client';

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const DATA = [
  { year: '99', BJP: 23.7, INC: 28.3, SP: 4.1, TMC: 3.2, Others: 40.7 },
  { year: '04', BJP: 22.2, INC: 26.5, SP: 4.6, TMC: 5.0, Others: 41.7 },
  { year: '09', BJP: 18.8, INC: 28.6, SP: 3.2, TMC: 6.1, Others: 43.3 },
  { year: '14', BJP: 31.0, INC: 19.3, SP: 3.4, TMC: 3.8, Others: 42.5 },
  { year: '19', BJP: 37.4, INC: 19.5, SP: 2.5, TMC: 4.1, Others: 36.5 },
  { year: '24', BJP: 36.6, INC: 21.2, SP: 4.6, TMC: 4.4, Others: 33.2 },
];

const COLORS = { BJP: '#f97316', INC: '#3b82f6', SP: '#ef4444', TMC: '#22c55e', Others: '#94a3b8' };

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[var(--t-bgCardSolid)] border border-[var(--t-border)] rounded px-2 py-1.5 text-[10px]">
      <div className="text-[var(--t-textSec)] font-semibold mb-1">{label}</div>
      {payload.map(p => (
        <div key={p.dataKey} style={{ color: p.stroke }}>{p.dataKey}: {p.value}%</div>
      ))}
    </div>
  );
};

export default function VoteShareTrendLine() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={DATA} margin={{ top: 4, right: 4, bottom: 4, left: -20 }}>
        <XAxis dataKey="year" tick={{ fontSize: 9, fill: '#64748b' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 9, fill: '#64748b' }} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip />} />
        {Object.entries(COLORS).map(([k, v]) => (
          <Line key={k} type="monotone" dataKey={k} stroke={v} strokeWidth={1.5} dot={{ r: 2, fill: v }} activeDot={{ r: 3 }} />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
