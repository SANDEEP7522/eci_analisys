'use client';

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#1877F2', '#9061F9', '#34d399'];

export default function GenderPieChart({ data, height = 220 }) {
  const chartData = data || [
    { name: 'Male', value: 6000 },
    { name: 'Female', value: 13800 },
    { name: 'All', value: 10000 },
  ];

  const total = chartData.reduce((a, b) => a + b.value, 0);

  return (
    <div style={{ height, width: '100%' }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={80}
            paddingAngle={3}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [`${(value / total * 100).toFixed(0)}%`, '']} />
          <Legend iconSize={10} iconType="circle" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
