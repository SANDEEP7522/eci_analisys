'use client';

import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts';

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
    <ResponsiveContainer width="100%" height={40}>
      <LineChart data={data} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
        <Line type="monotone" dataKey="pos" stroke="#15B77E" strokeWidth={1.5} dot={false} />
        <Line type="monotone" dataKey="neg" stroke="#F04F5C" strokeWidth={1.5} dot={false} />
        <Tooltip
          contentStyle={{ backgroundColor: 'var(--t-bgCardSolid)', border: '1px solid var(--t-border)', fontSize: 10, borderRadius: 4 }}
          itemStyle={{ color: 'var(--t-textSec)' }}
          labelFormatter={() => ''}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
