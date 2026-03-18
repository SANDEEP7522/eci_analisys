'use client';

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const ALLIANCE_DATA = [
  { name: 'NDA',    seats: 293, pct: 54, color: '#f97316' },
  { name: 'INDIA',  seats: 232, pct: 43, color: '#3b82f6' },
  { name: 'Others', seats: 18,  pct: 3,  color: '#64748b' },
];

const PARTY_DATA = [
  { name: 'BJP',    seats: 240, pct: 44, color: '#f97316' },
  { name: 'INC',    seats: 99,  pct: 18, color: '#3b82f6' },
  { name: 'SP',     seats: 37,  pct: 7,  color: '#ef4444' },
  { name: 'TMC',    seats: 29,  pct: 5,  color: '#22c55e' },
  { name: 'DMK',    seats: 22,  pct: 4,  color: '#7c3aed' },
  { name: 'Others', seats: 116, pct: 22, color: '#475569' },
];

const TOTAL    = 543;
const MAJORITY = 272;


const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-[var(--t-bgCardSolid)] border border-[var(--t-border)] rounded-md px-2.5 py-1.5 text-[10px] shadow-xl">
      <div className="font-bold text-[var(--t-text)] mb-0.5">{d.name}</div>
      <div className="text-[var(--t-textMut)]">{d.seats} seats</div>
      <div style={{ color: d.color }} className="font-semibold">{d.pct}% share</div>
    </div>
  );
};

export default function CoalitionRose() {
  return (
    <div className="flex items-center gap-1 h-full w-full">

      {/* ── Nested Rose Chart ───────────────────── */}
      <div className="relative flex-shrink-0" style={{ width: 140, height: 130 }}>
        <ResponsiveContainer width={140} height={130}>
          <PieChart>
            {/* Outer ring: party breakdown */}
            <Pie
              data={PARTY_DATA}
              dataKey="seats"
              cx="50%" cy="50%"
              innerRadius={50} outerRadius={64}
              paddingAngle={2}
              startAngle={90} endAngle={-270}
              stroke="none"
              isAnimationActive
            >
              {PARTY_DATA.map((d) => (
                <Cell key={d.name} fill={d.color} opacity={0.9} />
              ))}
            </Pie>

            {/* Inner ring: alliance breakdown */}
            <Pie
              data={ALLIANCE_DATA}
              dataKey="seats"
              cx="50%" cy="50%"
              innerRadius={32} outerRadius={46}
              paddingAngle={3}
              startAngle={90} endAngle={-270}
              stroke="none"
              isAnimationActive
            >
              {ALLIANCE_DATA.map((d) => (
                <Cell key={d.name} fill={d.color} opacity={0.75} />
              ))}
            </Pie>

            {/* Core circle */}
            <Pie
              data={[{ value: 1 }]}
              dataKey="value"
              cx="50%" cy="50%"
              innerRadius={0} outerRadius={28}
              stroke="none"
              isAnimationActive={false}
            >
              <Cell fill="var(--t-bgCardSolid)" />
            </Pie>

            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-[14px] font-black text-orange-400 leading-tight">293</span>
          <span className="text-[7px] text-[#64748b] uppercase tracking-wider">NDA</span>
        </div>
      </div>

      {/* ── Info Panel ──────────────────────────── */}
      <div className="flex flex-col gap-1 flex-1 min-w-0">

        {/* Majority bar */}
        <div className="bg-[var(--t-bgCard)] rounded-md px-2 py-1.5 border border-[var(--t-border)]">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[8px] text-[var(--t-textMut)] uppercase tracking-wider">Majority Mark</span>
            <span className="text-[9px] font-bold text-[var(--t-text)]">{MAJORITY}</span>
          </div>
          <div className="relative w-full h-2 bg-[var(--t-border)] rounded-full overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full rounded-full"
              style={{ width: `${(293 / TOTAL) * 100}%`, background: 'linear-gradient(90deg,#f97316,#fb923c)' }}
            />
            <div
              className="absolute top-0 bottom-0 w-px opacity-60 bg-[var(--t-text)]"
              style={{ left: `${(MAJORITY / TOTAL) * 100}%` }}
            />
          </div>
          <div className="flex justify-between mt-0.5">
            <span className="text-[8px] text-orange-400 font-semibold">NDA +{293 - MAJORITY}</span>
            <span className="text-[8px] text-[var(--t-textMut)]">{TOTAL} total</span>
          </div>
        </div>

        {/* Alliance rows */}
        <div className="space-y-0.5">
          {ALLIANCE_DATA.map((d) => (
            <div key={d.name} className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
              <span className="text-[9px] text-[var(--t-textSec)] w-9 font-medium">{d.name}</span>
              <div className="flex-1 bg-[var(--t-border)] rounded-full h-1.5 overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${(d.seats / TOTAL) * 100}%`, backgroundColor: d.color, opacity: 0.85 }}
                />
              </div>
              <span className="text-[9px] font-bold w-6 text-right" style={{ color: d.color }}>{d.seats}</span>
            </div>
          ))}
        </div>

        {/* Top parties */}
        <div className="flex gap-1 mt-0.5">
          {PARTY_DATA.slice(0, 4).map((d) => (
            <div
              key={d.name}
              className="flex-1 rounded text-center py-0.5"
              style={{ backgroundColor: d.color + '18', border: `1px solid ${d.color}44` }}
            >
              <div className="text-[8px] font-black" style={{ color: d.color }}>{d.name}</div>
              <div className="text-[7px] text-[var(--t-textMut)]">{d.seats}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
