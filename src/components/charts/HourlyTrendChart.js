'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function HourlyTrendChart({ data, height = 200 }) {
  const chartData = data || Array.from({ length: 24 }, (_, i) => ({
    hour: `${i}h`,
    engagements: Math.floor(Math.sin(i / 3) * 150 + Math.random() * 100 + 200),
  }));

  return (
    <div style={{ height, width: '100%' }}>
      <ResponsiveContainer>
        <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis dataKey="hour" tick={{ fontSize: 9, fill: '#8E9CAE' }} axisLine={false} tickLine={false} interval={3} />
          <YAxis tick={{ fontSize: 10, fill: '#8E9CAE' }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.15)' }} />
          <Line
            type="monotone"
            dataKey="engagements"
            stroke="#1877F2"
            strokeWidth={2}
            dot={{ r: 3, fill: '#1877F2' }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
