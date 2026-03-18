'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function WeeklyTrendChart({ data, height = 220 }) {
  const chartData = data || Array.from({ length: 12 }, (_, i) => ({
    week: `W${i + 1}`,
    Facebook: Math.floor(Math.random() * 1000 + 500),
    Instagram: Math.floor(Math.random() * 800 + 200),
    Messenger: Math.floor(Math.random() * 400 + 100),
  }));

  return (
    <div style={{ height, width: '100%' }}>
      <ResponsiveContainer>
        <BarChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }} barSize={8}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis dataKey="week" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.15)' }} />
          <Legend iconSize={8} iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
          <Bar dataKey="Facebook" stackId="a" fill="#1877F2" radius={[0, 0, 0, 0]} />
          <Bar dataKey="Instagram" stackId="a" fill="#e1306c" radius={[0, 0, 0, 0]} />
          <Bar dataKey="Messenger" stackId="a" fill="#00b2ff" radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
