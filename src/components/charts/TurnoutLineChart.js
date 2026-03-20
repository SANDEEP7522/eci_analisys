'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[var(--t-bgCardSolid)] border border-[var(--t-border)] rounded-lg px-2.5 py-1.5 text-[11px] shadow-xl">
      <div className="text-[var(--t-textSec)] font-semibold mb-0.5">{label}</div>
      <div className="text-[var(--t-text)]">Turnout: {payload[0].value}%</div>
    </div>
  );
};

export default function TurnoutLineChart({ data, height = 300 }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center bg-[var(--t-bgCard)] rounded-xl border border-dashed border-[var(--t-border)] text-[var(--t-textSec)] font-bold text-sm" style={{ height }}>
        No turnout data
      </div>
    );
  }

  const avg = data.reduce((a, d) => a + d.turnout, 0) / data.length;

  return (
    <div style={{ height, width: '100%' }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 20, left: -10, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--t-grid)" />
          <XAxis dataKey="year" tick={{ fill: 'var(--t-textMut)', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis
            tick={{ fill: 'var(--t-textMut)', fontSize: 11 }}
            axisLine={false} tickLine={false}
            domain={['dataMin - 4', 'dataMax + 4']}
            tickFormatter={v => `${v}%`}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine
            y={avg} stroke="#FF822D" strokeDasharray="4 3"
            label={{ value: `Avg ${avg.toFixed(1)}%`, fill: '#FF822D', fontSize: 10, position: 'left' }}
          />
          <Line
            type="monotone" dataKey="turnout"
            stroke="var(--t-accent)" strokeWidth={2.5}
            dot={{ r: 5, fill: 'var(--t-accent)', strokeWidth: 2, stroke: 'var(--t-bgCardSolid)' }}
            activeDot={{ r: 7, strokeWidth: 2, stroke: 'var(--t-bgCardSolid)' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
