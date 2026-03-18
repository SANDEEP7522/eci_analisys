'use client';

import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts';

const DATA = Array.from({ length: 20 }, (_, i) => ({
  t: i,
  pos: Math.round(40 + 20 * Math.sin(i * 0.5) + Math.random() * 10),
  neg: Math.round(20 + 10 * Math.cos(i * 0.4) + Math.random() * 8),
}));

export default function SentimentSparkline() {
  return (
    <ResponsiveContainer width="100%" height={40}>
      <LineChart data={DATA} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
        <Line type="monotone" dataKey="pos" stroke="#22c55e" strokeWidth={1.5} dot={false} />
        <Line type="monotone" dataKey="neg" stroke="#ef4444" strokeWidth={1.5} dot={false} />
        <Tooltip
          contentStyle={{ backgroundColor: 'var(--t-bgCardSolid)', border: '1px solid var(--t-border)', fontSize: 10, borderRadius: 4 }}
          itemStyle={{ color: 'var(--t-textSec)' }}
          labelFormatter={() => ''}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
