'use client';

const CX = 110;
const CY = 100;
const R_OUTER = 82;
const R_INNER = 58;

function polarToXY(cx, cy, r, angleDeg) {
  const rad = ((angleDeg - 180) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function arcPath(cx, cy, rInner, rOuter, startDeg, endDeg) {
  const s1 = polarToXY(cx, cy, rOuter, startDeg);
  const e1 = polarToXY(cx, cy, rOuter, endDeg);
  const s2 = polarToXY(cx, cy, rInner, endDeg);
  const e2 = polarToXY(cx, cy, rInner, startDeg);
  const large = endDeg - startDeg > 180 ? 1 : 0;
  return [
    `M ${s1.x} ${s1.y}`,
    `A ${rOuter} ${rOuter} 0 ${large} 1 ${e1.x} ${e1.y}`,
    `L ${s2.x} ${s2.y}`,
    `A ${rInner} ${rInner} 0 ${large} 0 ${e2.x} ${e2.y}`,
    'Z',
  ].join(' ');
}

export default function SentimentGauge({ positive = 54, neutral = 14, negative = 32 }) {
  const negEnd     = (negative / 100) * 180;
  const neutralEnd = negEnd + (neutral / 100) * 180;
  const needleAngle = (positive / 100) * 180;
  const needleTip   = polarToXY(CX, CY, R_OUTER - 14, needleAngle);

  const PARTY_SENTIMENT = [
    { name: 'BJP', pos: Math.min(99, Math.round(positive + 8)),  color: '#FF822D' },
    { name: 'INC', pos: Math.min(99, Math.round(positive - 6)),  color: '#4271FE' },
    { name: 'SP',  pos: Math.min(99, Math.round(positive - 13)), color: '#F04F5C' },
    { name: 'TMC', pos: Math.min(99, Math.round(positive + 1)),  color: '#15B77E' },
  ];

  return (
    <div className="flex flex-col w-full h-full">
      <div className="relative flex justify-center w-full max-w-[240px] mx-auto">
        <svg viewBox="0 0 220 108" className="w-full h-auto">
          <path d={arcPath(CX, CY, R_INNER, R_OUTER, 0, 180)} fill="var(--t-bgCard)" opacity={1} />
          <path d={arcPath(CX, CY, R_INNER + 2, R_OUTER - 2, 0, negEnd)} fill="#F04F5C" opacity={0.85} />
          <path d={arcPath(CX, CY, R_INNER + 2, R_OUTER - 2, negEnd, neutralEnd)} fill="#F5A623" opacity={0.85} />
          <path d={arcPath(CX, CY, R_INNER + 2, R_OUTER - 2, neutralEnd, 180)} fill="#15B77E" opacity={0.85} />
          <path d={arcPath(CX, CY, R_INNER + 2, R_OUTER - 2, neutralEnd, 180)} fill="none" stroke="#15B77E" strokeWidth={1} opacity={0.5} />

          <text x={polarToXY(CX, CY, R_OUTER + 8, negEnd / 2).x}
                y={polarToXY(CX, CY, R_OUTER + 8, negEnd / 2).y}
                textAnchor="middle" fontSize={8} fill="#F04F5C" opacity={0.9}>{negative}%</text>
          <text x={polarToXY(CX, CY, R_OUTER + 8, negEnd + (neutral / 100) * 90).x}
                y={polarToXY(CX, CY, R_OUTER + 8, negEnd + (neutral / 100) * 90).y}
                textAnchor="middle" fontSize={8} fill="#F5A623" opacity={0.9}>{neutral}%</text>
          <text x={polarToXY(CX, CY, R_OUTER + 8, neutralEnd + (positive / 100) * 90).x}
                y={polarToXY(CX, CY, R_OUTER + 8, neutralEnd + (positive / 100) * 90).y}
                textAnchor="middle" fontSize={8} fill="#15B77E" opacity={0.9}>{positive}%</text>

          <line x1={CX} y1={CY} x2={needleTip.x} y2={needleTip.y}
                stroke="var(--t-text)" strokeWidth={2} strokeLinecap="round" />
          <circle cx={CX} cy={CY} r={5} fill="var(--t-bgCardSolid)" stroke="var(--t-text)" strokeWidth={1.5} />

          <text x={CX} y={CY - 10} textAnchor="middle" fontSize={16} fontWeight="bold" fill="#15B77E">{positive}%</text>
          <text x={CX} y={CY + 2}  textAnchor="middle" fontSize={8}  fill="var(--t-textMut)">Positive</text>
        </svg>
        <span className="absolute bottom-0 left-4 text-[9px] text-red-400 font-semibold">Negative</span>
        <span className="absolute bottom-0 right-4 text-[9px] text-green-400 font-semibold">Positive</span>
      </div>

      <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 px-1 mt-1">
        {PARTY_SENTIMENT.map((p) => (
          <div key={p.name} className="flex items-center gap-1.5">
            <span className="text-[8px] font-bold w-5 flex-shrink-0" style={{ color: p.color }}>{p.name}</span>
            <div className="flex-1 bg-[var(--t-border)] rounded-full h-1 overflow-hidden">
              <div className="h-full rounded-full transition-all duration-700"
                   style={{ width: `${p.pos}%`, backgroundColor: p.color, opacity: 0.9 }} />
            </div>
            <span className="text-[8px] text-[var(--t-textMut)] w-5 text-right">{p.pos}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
