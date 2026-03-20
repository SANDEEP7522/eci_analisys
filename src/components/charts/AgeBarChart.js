'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AgeBarChart({ data, height = 220 }) {
  const chartData = data || [
    { age: '13', count: 180 }, { age: '18', count: 620 }, { age: '21', count: 980 },
    { age: '25', count: 1550 }, { age: '30', count: 1950 }, { age: '35', count: 1700 },
    { age: '40', count: 1300 }, { age: '45', count: 980 }, { age: '50', count: 660 },
    { age: '55', count: 420 }, { age: '60', count: 250 }, { age: '65+', count: 130 },
  ];

  return (
    <div style={{ height, width: '100%' }}>
      <ResponsiveContainer>
        <BarChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-gray-700" />
          <XAxis dataKey="age" tick={{ fontSize: 10, fill: 'var(--t-textMut)' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 10, fill: 'var(--t-textMut)' }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.15)' }}
            cursor={{ fill: 'rgba(139, 92, 246, 0.1)' }}
          />
          <Bar dataKey="count" name="Engagements" fill="#9061F9" radius={[3, 3, 0, 0]} maxBarSize={30} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
