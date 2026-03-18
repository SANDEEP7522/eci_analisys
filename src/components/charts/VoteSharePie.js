'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = ['#f97316','#1e3a8a','#ef4444','#22c55e','#7c3aed','#06b6d4','#6366f1','#94a3b8'];

const renderLabel = ({ name, percent }) => percent > 0.05 ? `${(percent * 100).toFixed(1)}%` : '';

export default function VoteSharePie({ data, height = 360 }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center bg-gray-50 dark:bg-slate-900/30 rounded-xl border border-dashed border-gray-200 dark:border-slate-600 text-gray-400 text-sm" style={{ height }}>
        No vote share data
      </div>
    );
  }

  return (
    <div style={{ height, width: '100%' }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="45%"
            outerRadius="65%"
            dataKey="share"
            nameKey="party"
            label={renderLabel}
            labelLine={false}
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(val) => [`${val.toFixed(2)}%`, 'Vote Share']}
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.15)', fontSize: '12px' }}
          />
          <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
