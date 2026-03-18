'use client';

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const DATA = [
  { phase: 'P1', BJP: 38, INC: 22, SP: 8, TMC: 6, Others: 26 },
  { phase: 'P2', BJP: 35, INC: 24, SP: 10, TMC: 7, Others: 24 },
  { phase: 'P3', BJP: 40, INC: 20, SP: 9, TMC: 8, Others: 23 },
  { phase: 'P4', BJP: 37, INC: 23, SP: 11, TMC: 6, Others: 23 },
  { phase: 'P5', BJP: 36, INC: 25, SP: 10, TMC: 7, Others: 22 },
  { phase: 'P6', BJP: 34, INC: 26, SP: 12, TMC: 9, Others: 19 },
  { phase: 'P7', BJP: 33, INC: 28, SP: 11, TMC: 8, Others: 20 },
];

const COLORS = { BJP: '#f97316', INC: '#3b82f6', SP: '#ef4444', TMC: '#22c55e', Others: '#94a3b8' };

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[var(--t-bgCardSolid)] border border-[var(--t-border)] rounded px-2 py-1.5 text-[10px]">
      <div className="text-[var(--t-textSec)] font-semibold mb-1">{label}</div>
      {payload.map(p => (
        <div key={p.dataKey} className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-sm inline-block" style={{ backgroundColor: p.color }} />
          <span style={{ color: p.color }}>{p.dataKey}: {p.value}%</span>
        </div>
      ))}
    </div>
  );
};

export default function SeatShareArea() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={DATA} margin={{ top: 4, right: 4, bottom: 4, left: -20 }}>
        <defs>
          {Object.entries(COLORS).map(([k, v]) => (
            <linearGradient key={k} id={`grad_${k}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={v} stopOpacity={0.4} />
              <stop offset="95%" stopColor={v} stopOpacity={0.05} />
            </linearGradient>
          ))}
        </defs>
        <XAxis dataKey="phase" tick={{ fontSize: 9, fill: 'var(--t-textMut)' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 9, fill: 'var(--t-textMut)' }} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip />} />
        {Object.entries(COLORS).map(([k, v]) => (
          <Area key={k} type="monotone" dataKey={k} stroke={v} strokeWidth={1.5}
            fill={`url(#grad_${k})`} stackId="1" />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
}
