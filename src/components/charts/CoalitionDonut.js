'use client';

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const DATA = [
  { name: 'NDA', value: 293, color: '#f97316' },
  { name: 'INDIA', value: 232, color: '#3b82f6' },
  { name: 'Others', value: 18, color: '#64748b' },
];

const MAJORITY = 272;

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;

  return (
    <div className="bg-[var(--t-bgCardSolid)] border border-[var(--t-border)] rounded px-2 py-1 text-[10px]">
      <div className="font-bold text-white">
        {d.name}: {d.value}
      </div>
    </div>
  );
};

export default function CoalitionRadar() {
  return (
    <div className="flex items-center gap-2 h-full">

      {/* Radar Chart */}
      <div className="flex-1 relative" style={{ minHeight: 120 }}>
        <ResponsiveContainer width="100%" height={120}>
          <RadarChart data={DATA}>
            <PolarGrid stroke="#334155" />
            <PolarAngleAxis
              dataKey="name"
              tick={{ fontSize: 10, fill: '#94a3b8' }}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 300]}
              tick={false}
            />

            <Radar
              name="Seats"
              dataKey="value"
              stroke="#f97316"
              fill="#f97316"
              fillOpacity={0.4}
            />

            <Tooltip content={<CustomTooltip />} />
          </RadarChart>
        </ResponsiveContainer>

        {/* Center Text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <div className="text-[10px] text-[var(--t-textSec)]">Maj.</div>
            <div className="text-xs font-bold text-white">{MAJORITY}</div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="space-y-1.5">
        {DATA.map(d => (
          <div key={d.name} className="flex items-center gap-1.5 text-[10px]">
            <div
              className="w-2 h-2 rounded-sm"
              style={{ backgroundColor: d.color }}
            />
            <span className="text-[var(--t-textSec)]">{d.name}</span>
            <span
              className="font-bold ml-auto pl-2"
              style={{ color: d.color }}
            >
              {d.value}
            </span>
          </div>
        ))}

        <div className="text-[10px] text-[var(--t-textMut)] border-t border-[var(--t-border)] pt-1 mt-1">
          NDA majority:
          <span className="text-green-400 font-semibold">
            +{293 - MAJORITY}
          </span>
        </div>
      </div>

    </div>
  );
}