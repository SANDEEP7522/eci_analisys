'use client';

import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip, ResponsiveContainer } from 'recharts';

const DEFAULT_DATA = [
  { name: 'NDA',    value: 293, color: '#f97316' },
  { name: 'INDIA',  value: 232, color: '#3b82f6' },
  { name: 'Others', value: 18,  color: '#64748b' },
];

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-[var(--t-bgCardSolid)] border border-[var(--t-border)] rounded px-2 py-1 text-[10px]">
      <div className="font-bold text-[var(--t-text)]">{d.name}: {d.value}</div>
    </div>
  );
};

export default function CoalitionRadar({ alliances, majorityMark = 272 }) {
  const data = alliances
    ? alliances.map(a => ({ name: a.name, value: a.seats, color: a.color }))
    : DEFAULT_DATA;

  const leader = data.reduce((a, b) => (a.value > b.value ? a : b), data[0]);
  const margin = leader.value - majorityMark;

  return (
    <div className="flex items-center gap-2 h-full">
      <div className="flex-1 relative" style={{ minHeight: 120 }}>
        <ResponsiveContainer width="100%" height={120}>
          <RadarChart data={data}>
            <PolarGrid stroke="var(--t-border)" />
            <PolarAngleAxis dataKey="name" tick={{ fontSize: 10, fill: '#94a3b8' }} />
            <PolarRadiusAxis angle={30} domain={[0, Math.max(...data.map(d => d.value)) + 20]} tick={false} />
            <Radar name="Seats" dataKey="value" stroke={leader.color} fill={leader.color} fillOpacity={0.4} />
            <Tooltip content={<CustomTooltip />} />
          </RadarChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <div className="text-[10px] text-[var(--t-textSec)]">Maj.</div>
            <div className="text-xs font-bold text-[var(--t-text)]">{majorityMark}</div>
          </div>
        </div>
      </div>

      <div className="space-y-1.5">
        {data.map(d => (
          <div key={d.name} className="flex items-center gap-1.5 text-[10px]">
            <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: d.color }} />
            <span className="text-[var(--t-textSec)]">{d.name}</span>
            <span className="font-bold ml-auto pl-2" style={{ color: d.color }}>{d.value}</span>
          </div>
        ))}
        <div className="text-[10px] text-[var(--t-textMut)] border-t border-[var(--t-border)] pt-1 mt-1">
          {leader.name}:&nbsp;
          <span style={{ color: margin >= 0 ? '#22c55e' : '#ef4444', fontWeight: 600 }}>
            {margin >= 0 ? `+${margin}` : margin}
          </span>
        </div>
      </div>
    </div>
  );
}
