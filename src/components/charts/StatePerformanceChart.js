'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const PARTY_COLORS = {
  BJP: 'url(#grad-orange)', INC: 'url(#grad-blue)', SP: 'url(#grad-red)', TMC: 'url(#grad-green)',
  DMK: 'url(#grad-purple)', JDU: 'url(#grad-blue)', TDP: 'url(#grad-cyan)', SS: 'url(#grad-orange)',
  'CPI(M)': 'url(#grad-red)', AIADMK: 'url(#grad-green)', BSP: 'url(#grad-gray)', Others: 'url(#grad-gray)',
  NC: 'url(#grad-green)', YSRCP: 'url(#grad-purple)', JSP: 'url(#grad-cyan)',
};

const DEFAULT = [
  { state: 'UP', BJP: 33, SP: 37, INC: 6,  Others: 4  },
  { state: 'MH', BJP: 23, INC: 13, SS: 9,  Others: 3  },
  { state: 'WB', TMC: 29, BJP: 12, INC: 1, Others: 0  },
  { state: 'TN', DMK: 22, INC: 9,  Others: 8          },
  { state: 'BR', JDU: 12, BJP: 17, INC: 3, Others: 8  },
  { state: 'GJ', BJP: 26, Others: 0                   },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[var(--t-bgCardSolid)] border border-[var(--t-border)] rounded px-2 py-1.5 text-[10px]">
      <div className="font-semibold text-[var(--t-text)] mb-1">{label}</div>
      {payload.map(p => (
        <div key={p.dataKey} style={{ color: p.fill }}>{p.dataKey}: {p.value}</div>
      ))}
    </div>
  );
};

export default function StatePerformanceChart({ stateData, richData }) {
  // Build chart rows from rich data if available, else fallback to standard state mapping
  const data = richData && richData.length > 0 
    ? richData 
    : (stateData && stateData.length > 0
        ? stateData.map(s => ({
            state: s.id,
            [s.party]: s.won,
            Others: Math.max(0, s.seats - s.won),
          }))
        : DEFAULT);

  // Collect all unique party keys across rows (excluding state/region/Others metadata)
  const partyKeys = [...new Set(
    data.flatMap(d => Object.keys(d).filter(k => k !== 'state' && k !== 'Others' && k !== 'region'))
  )];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 4, right: 4, bottom: 4, left: -25 }} barSize={6} barGap={1}>
        <XAxis dataKey="state" tick={{ fontSize: 9, fill: '#8E9CAE' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 9, fill: '#8E9CAE' }} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip />} />
        {partyKeys.map(k => (
          <Bar key={k} dataKey={k} fill={PARTY_COLORS[k] || 'url(#grad-gray)'} stackId="a" />
        ))}
        <Bar dataKey="Others" fill='url(#grad-gray)' stackId="a" radius={[3, 3, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
