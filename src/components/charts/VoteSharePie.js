'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = [
  'url(#grad-orange)', 'url(#grad-blue)', 'url(#grad-red)',
  'url(#grad-green)', 'url(#grad-purple)', 'url(#grad-cyan)',
  'url(#grad-amber)', 'url(#grad-gray)',
];

// Note: gradient defs are injected globally in page.js


const renderLabel = ({ percent }) => (percent > 0.05 ? `${(percent * 100).toFixed(1)}%` : '');

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[var(--t-bgCardSolid)] border border-[var(--t-border)] rounded-lg px-2.5 py-1.5 text-[11px] shadow-xl">
      <div className="font-semibold text-[var(--t-text)]">{payload[0].name}</div>
      <div className="text-[var(--t-textSec)]">Vote Share: {payload[0].value?.toFixed(2)}%</div>
    </div>
  );
};

export default function VoteSharePie({ data, height = 360 }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center bg-[var(--t-bgCard)] rounded-xl border border-dashed border-[var(--t-border)] text-[var(--t-textSec)] font-bold text-sm" style={{ height }}>
        No vote share data
      </div>
    );
  }

  return (
    <div className="h-full w-full" style={{ minHeight: 200 }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%" cy="45%"
            outerRadius="65%"
            dataKey="share"
            nameKey="party"
            label={renderLabel}
            labelLine={false}
            labelStyle={{ fill: 'var(--t-textSec)', fontSize: 10 }}
          >
            {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            iconType="circle" iconSize={7}
            wrapperStyle={{ fontSize: '10px', paddingTop: '6px', color: 'var(--t-textSec)' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
