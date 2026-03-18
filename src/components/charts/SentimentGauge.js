'use client';

// Sentiment scores
const POSITIVE = 54;
const NEUTRAL   = 14;
const NEGATIVE  = 32;

// Party-wise sentiment mini data
const PARTY_SENTIMENT = [
  { name: 'BJP',  pos: 62, color: '#f97316' },
  { name: 'INC',  pos: 48, color: '#3b82f6' },
  { name: 'SP',   pos: 41, color: '#ef4444' },
  { name: 'TMC',  pos: 55, color: '#22c55e' },
];

// SVG semi-circle gauge constants
const CX = 110;
const CY = 100;
const R_OUTER = 82;
const R_INNER = 58;

function polarToXY(cx, cy, r, angleDeg) {
  const rad = ((angleDeg - 180) * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
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

// Full 180° split: negative | neutral | positive (left to right)
const negEnd     = (NEGATIVE / 100) * 180;        // 0° → negEnd
const neutralEnd = negEnd + (NEUTRAL / 100) * 180; // negEnd → neutralEnd
// positive fills the rest to 180°

// Needle angle: 0° = far left (all negative), 180° = far right (all positive)
const needleAngle = (POSITIVE / 100) * 180; // 54% → ~97°

export default function SentimentGauge() {
  const needleTip = polarToXY(CX, CY, R_OUTER - 14, needleAngle);

  return (
    <div className="flex flex-col w-full h-full">
      {/* ── Gauge SVG ───────────────────────── */}
      <div className="relative flex justify-center">
        <svg width={220} height={108} viewBox="0 0 220 108">
          {/* Track background */}
          <path
            d={arcPath(CX, CY, R_INNER, R_OUTER, 0, 180)}
            fill="var(--t-bgCard)"
            opacity={1}
          />

          {/* Negative zone — red */}
          <path
            d={arcPath(CX, CY, R_INNER + 2, R_OUTER - 2, 0, negEnd)}
            fill="#ef4444"
            opacity={0.85}
          />

          {/* Neutral zone — amber */}
          <path
            d={arcPath(CX, CY, R_INNER + 2, R_OUTER - 2, negEnd, neutralEnd)}
            fill="#f59e0b"
            opacity={0.85}
          />

          {/* Positive zone — green */}
          <path
            d={arcPath(CX, CY, R_INNER + 2, R_OUTER - 2, neutralEnd, 180)}
            fill="#22c55e"
            opacity={0.85}
          />

          {/* Glow highlight on active (positive) arc */}
          <path
            d={arcPath(CX, CY, R_INNER + 2, R_OUTER - 2, neutralEnd, 180)}
            fill="none"
            stroke="#22c55e"
            strokeWidth={1}
            opacity={0.5}
          />

          {/* Zone labels */}
          {/* Neg label */}
          <text x={polarToXY(CX, CY, R_OUTER + 8, negEnd / 2).x}
                y={polarToXY(CX, CY, R_OUTER + 8, negEnd / 2).y}
                textAnchor="middle" fontSize={8} fill="#ef4444" opacity={0.9}>
            {NEGATIVE}%
          </text>
          {/* Neu label */}
          <text x={polarToXY(CX, CY, R_OUTER + 8, negEnd + (NEUTRAL / 100) * 90).x}
                y={polarToXY(CX, CY, R_OUTER + 8, negEnd + (NEUTRAL / 100) * 90).y}
                textAnchor="middle" fontSize={8} fill="#f59e0b" opacity={0.9}>
            {NEUTRAL}%
          </text>
          {/* Pos label */}
          <text x={polarToXY(CX, CY, R_OUTER + 8, neutralEnd + (POSITIVE / 100) * 90).x}
                y={polarToXY(CX, CY, R_OUTER + 8, neutralEnd + (POSITIVE / 100) * 90).y}
                textAnchor="middle" fontSize={8} fill="#22c55e" opacity={0.9}>
            {POSITIVE}%
          </text>

          {/* Needle */}
          <line
            x1={CX} y1={CY}
            x2={needleTip.x} y2={needleTip.y}
            stroke="var(--t-text)" strokeWidth={2} strokeLinecap="round"
          />
          <circle cx={CX} cy={CY} r={5} fill="var(--t-bgCardSolid)" stroke="var(--t-text)" strokeWidth={1.5} />

          {/* Center score */}
          <text x={CX} y={CY - 10} textAnchor="middle" fontSize={16} fontWeight="bold" fill="#22c55e">
            {POSITIVE}%
          </text>
          <text x={CX} y={CY + 2} textAnchor="middle" fontSize={8} fill="var(--t-textMut)">
            Positive
          </text>
        </svg>

        {/* Corner labels */}
        <span className="absolute bottom-0 left-4 text-[9px] text-red-400 font-semibold">Negative</span>
        <span className="absolute bottom-0 right-4 text-[9px] text-green-400 font-semibold">Positive</span>
      </div>

      {/* ── Party sentiment bars ─────────────── */}
      <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 px-1 mt-1">
        {PARTY_SENTIMENT.map((p) => (
          <div key={p.name} className="flex items-center gap-1.5">
            <span className="text-[8px] font-bold w-5 flex-shrink-0" style={{ color: p.color }}>{p.name}</span>
            <div className="flex-1 bg-[var(--t-border)] rounded-full h-1 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${p.pos}%`, backgroundColor: p.color, opacity: 0.9 }}
              />
            </div>
            <span className="text-[8px] text-[var(--t-textMut)] w-5 text-right">{p.pos}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
