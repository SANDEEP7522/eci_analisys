'use client';

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

// Historical seat counts per year — used when no prop passed
const ALL_YEARS_DATA = [
  { year: "'99", BJP: 182, INC: 114, SP: 26,  TMC: 8,  Others: 213 },
  { year: "'04", BJP: 138, INC: 145, SP: 36,  TMC: 0,  Others: 224 },
  { year: "'09", BJP: 116, INC: 206, SP: 23,  TMC: 19, Others: 179 },
  { year: "'14", BJP: 282, INC: 44,  SP: 5,   TMC: 34, Others: 178 },
  { year: "'19", BJP: 303, INC: 52,  SP: 5,   TMC: 22, Others: 161 },
  { year: "'24", BJP: 240, INC: 99,  SP: 37,  TMC: 29, Others: 138 },
];

const COLORS = { BJP: '#FF822D', INC: '#4271FE', SP: '#F04F5C', TMC: '#15B77E', Others: '#8E9CAE' };

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[var(--t-bgCardSolid)] border border-[var(--t-border)] rounded px-2 py-1.5 text-[10px]">
      <div className="text-[var(--t-textSec)] font-semibold mb-1">{label}</div>
      {payload.map(p => (
        <div key={p.dataKey} className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-sm inline-block" style={{ backgroundColor: p.color }} />
          <span style={{ color: p.color }}>{p.dataKey}: {p.value}</span>
        </div>
      ))}
    </div>
  );
};

export default function SeatShareArea({ activeParties }) {
  // Filter which party lines to show; fall back to all
  const visibleKeys = activeParties && activeParties.length > 0
    ? activeParties
    : Object.keys(COLORS);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={ALL_YEARS_DATA} margin={{ top: 4, right: 4, bottom: 4, left: -20 }}>
        <defs>
          {Object.entries(COLORS).map(([k, v]) => (
            <linearGradient key={k} id={`ssa_${k}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor={v} stopOpacity={0.4} />
              <stop offset="95%" stopColor={v} stopOpacity={0.05} />
            </linearGradient>
          ))}
        </defs>
        <XAxis dataKey="year" tick={{ fontSize: 9, fill: '#8E9CAE' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 9, fill: '#8E9CAE' }} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip />} />
        {visibleKeys.filter(k => COLORS[k]).map(k => (
          <Area key={k} type="monotone" dataKey={k}
            stroke={COLORS[k]} strokeWidth={1.5}
            fill={`url(#ssa_${k})`}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
}
