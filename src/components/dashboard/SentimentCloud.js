'use client';

const WORDS = [
  { text: 'Development', size: 22, color: '#22c55e', x: 10, y: 15 },
  { text: 'Corruption', size: 14, color: '#ef4444', x: 55, y: 10 },
  { text: 'Governance', size: 18, color: '#3b82f6', x: 30, y: 35 },
  { text: 'Secularism', size: 26, color: '#f97316', x: 8, y: 52 },
  { text: 'Jobs', size: 16, color: '#22c55e', x: 68, y: 30 },
  { text: 'Economy', size: 20, color: '#a78bfa', x: 55, y: 55 },
  { text: 'Healthcare', size: 15, color: '#38bdf8', x: 12, y: 72 },
  { text: 'Education', size: 17, color: '#f59e0b', x: 60, y: 75 },
  { text: 'Infrastructure', size: 13, color: '#6366f1', x: 35, y: 80 },
  { text: 'Democracy', size: 19, color: '#ec4899', x: 20, y: 90 },
  { text: 'Unity', size: 14, color: '#14b8a6', x: 72, y: 88 },
  { text: 'Reform', size: 16, color: '#84cc16', x: 45, y: 20 },
  { text: 'Welfare', size: 13, color: '#fb923c', x: 80, y: 50 },
  { text: 'Tax', size: 12, color: '#94a3b8', x: 85, y: 20 },
  { text: 'Poverty', size: 15, color: '#f87171', x: 78, y: 70 },
];

export default function SentimentCloud() {
  return (
    <div className="relative w-full h-full overflow-hidden">
      {WORDS.map((w, i) => (
        <span
          key={i}
          className="absolute font-bold select-none cursor-default transition-all duration-300 hover:brightness-125"
          style={{
            left: `${w.x}%`,
            top: `${w.y}%`,
            fontSize: `${w.size * 0.7}px`,
            color: w.color,
            textShadow: `0 0 8px ${w.color}55`,
            transform: 'translate(-50%, -50%)',
            whiteSpace: 'nowrap',
          }}
        >
          {w.text}
        </span>
      ))}
    </div>
  );
}
