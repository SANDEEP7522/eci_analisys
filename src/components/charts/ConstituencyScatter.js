'use client';

import { ScatterChart, Scatter, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const COLORS = ['#f97316','#3b82f6','#22c55e','#a78bfa','#06b6d4','#ec4899','#f59e0b','#84cc16'];

function generateScatterData(n = 120) {
  const parties = ['BJP','INC','SP','TMC','DMK','TDP','JDU','Others'];
  return Array.from({ length: n }, (_, i) => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    z: Math.random() * 50000 + 5000,
    party: parties[Math.floor(Math.random() * parties.length)],
  }));
}

const DATA = generateScatterData(150);
const PARTY_COLORS = { BJP:'#f97316', INC:'#1e3a8a', SP:'#ef4444', TMC:'#22c55e', DMK:'#7c3aed', TDP:'#06b6d4', JDU:'#6366f1', Others:'#94a3b8' };

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-[var(--t-bgCardSolid)] border border-[var(--t-border)] rounded px-2 py-1 text-[10px]">
      <div className="font-bold" style={{ color: PARTY_COLORS[d.party] || '#fff' }}>{d.party}</div>
      <div className="text-[var(--t-textSec)]">Margin: {d.z.toLocaleString()}</div>
    </div>
  );
};

export default function ConstituencyScatter() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ScatterChart margin={{ top: 4, right: 4, bottom: 4, left: -20 }}>
        <XAxis dataKey="x" type="number" domain={[0,100]} tick={{ fontSize: 9, fill: '#64748b' }} axisLine={false} tickLine={false} />
        <YAxis dataKey="y" type="number" domain={[0,100]} tick={{ fontSize: 9, fill: '#64748b' }} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3', stroke: '#334155' }} />
        <Scatter data={DATA} fillOpacity={0.8}>
          {DATA.map((d, i) => (
            <Cell key={i} fill={PARTY_COLORS[d.party] || '#94a3b8'} />
          ))}
        </Scatter>
      </ScatterChart>
    </ResponsiveContainer>
  );
}
