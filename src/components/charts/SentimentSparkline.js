'use client';

import { LineChart, Line, ResponsiveContainer, Tooltip, defs } from 'recharts';

function makeData(posBase, negBase) {
  return Array.from({ length: 20 }, (_, i) => ({
    t: i,
    pos: Math.round(posBase + 12 * Math.sin(i * 0.5)),
    neg: Math.round(negBase + 7  * Math.cos(i * 0.4)),
  }));
}

export default function SentimentSparkline({ positive = 54, negative = 32 }) {
  const data = makeData(positive, negative);
  return (
    <div style={{ position: 'relative', width: '100%', height: 40 }}>
      {/* Inject gradient defs */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <linearGradient id="spark-pos" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="#0A8055"/>
            <stop offset="100%" stopColor="#3DE8A0"/>
          </linearGradient>
          <linearGradient id="spark-neg" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="#C82035"/>
            <stop offset="100%" stopColor="#FF6E7A"/>
          </linearGradient>
        </defs>
      </svg>
      <ResponsiveContainer width="100%" height={40}>
        <LineChart data={data} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
          <Line type="monotone" dataKey="pos" stroke="url(#spark-pos)" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="neg" stroke="url(#spark-neg)" strokeWidth={2} dot={false} />
          <Tooltip
            contentStyle={{ backgroundColor: 'var(--t-bgCardSolid)', border: '1px solid var(--t-border)', fontSize: 10, borderRadius: 4 }}
            itemStyle={{ color: 'var(--t-textSec)' }}
            labelFormatter={() => ''}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
