'use client';

// Each word gets a gradient pair for clip-text effect
const WORDS = [
  { text: 'Development',    size: 22, g: ['#0A8055','#3DE8A0'], x: 10, y: 15 },
  { text: 'Corruption',     size: 14, g: ['#C82035','#FF6E7A'], x: 55, y: 10 },
  { text: 'Governance',     size: 18, g: ['#1E50CC','#78AAFF'], x: 30, y: 35 },
  { text: 'Secularism',     size: 26, g: ['#FF5500','#FFB347'], x: 8,  y: 52 },
  { text: 'Jobs',           size: 16, g: ['#0A8055','#3DE8A0'], x: 68, y: 30 },
  { text: 'Economy',        size: 20, g: ['#7E2ECC','#CF9BFF'], x: 55, y: 55 },
  { text: 'Healthcare',     size: 15, g: ['#0894AA','#5AE2F8'], x: 12, y: 72 },
  { text: 'Education',      size: 17, g: ['#C87A00','#FFD060'], x: 60, y: 75 },
  { text: 'Infrastructure', size: 13, g: ['#1E50CC','#78AAFF'], x: 35, y: 80 },
  { text: 'Democracy',      size: 19, g: ['#C82035','#FF6E7A'], x: 20, y: 90 },
  { text: 'Unity',          size: 14, g: ['#0894AA','#5AE2F8'], x: 72, y: 88 },
  { text: 'Reform',         size: 16, g: ['#0A8055','#3DE8A0'], x: 45, y: 20 },
  { text: 'Welfare',        size: 13, g: ['#FF5500','#FFB347'], x: 80, y: 50 },
  { text: 'Tax',            size: 12, g: ['#506078','#A8BCCC'], x: 85, y: 20 },
  { text: 'Poverty',        size: 15, g: ['#C82035','#FF6E7A'], x: 78, y: 70 },
];

export default function SentimentCloud() {
  return (
    <div className="relative w-full h-full overflow-hidden">
      {WORDS.map((w, i) => (
        <span
          key={i}
          className="absolute font-black select-none cursor-default transition-all duration-300 hover:scale-110"
          style={{
            left: `${w.x}%`,
            top: `${w.y}%`,
            fontSize: `${w.size * 0.7}px`,
            background: `linear-gradient(135deg, ${w.g[0]}, ${w.g[1]})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            filter: `drop-shadow(0 1px 2px var(--t-shadow)) drop-shadow(0 0 5px ${w.g[1]}40)`,
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
