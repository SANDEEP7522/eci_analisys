'use client';

import { useEffect, useState } from 'react';

const FEED_ITEMS = [
  { time: '10:36', text: 'UP: BJP leads in 24/80 seats, SP ahead in 36', tag: 'UP', color: '#f97316' },
  { time: '10:34', text: 'Kerala: LDF sweeping with 16/20 leads', tag: 'KL', color: '#22c55e' },
  { time: '10:32', text: 'Tamil Nadu: DMK dominates — leads in 34/39', tag: 'TN', color: '#7c3aed' },
  { time: '10:30', text: 'Maharashtra: MVA vs MahaYuti close contest', tag: 'MH', color: '#3b82f6' },
  { time: '10:28', text: 'West Bengal: TMC leads in 28/42 constituencies', tag: 'WB', color: '#22c55e' },
  { time: '10:25', text: 'Rajasthan: INC recovering, leads 12/25', tag: 'RJ', color: '#1e3a8a' },
  { time: '10:22', text: 'Bihar: NDA holds advantage, 24/40 leads', tag: 'BR', color: '#f97316' },
  { time: '10:20', text: 'Gujarat: BJP dominant with 22/26 leads', tag: 'GJ', color: '#f97316' },
  { time: '10:18', text: 'Andhra: TDP leading in 20/25 constituencies', tag: 'AP', color: '#06b6d4' },
  { time: '10:15', text: 'Punjab: SAD holds 3, AAP 7, INC 5 leads', tag: 'PB', color: '#f59e0b' },
];

export default function LiveFeed() {
  const [count, setCount] = useState(FEED_ITEMS.length);

  useEffect(() => {
    const t = setInterval(() => setCount(c => c + 1), 8000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex-1 overflow-y-auto space-y-1 pr-0.5">
        {FEED_ITEMS.map((item, i) => (
          <div key={i} className="flex items-start gap-1.5 text-[10px] py-1 border-b border-[var(--t-border)]">
            <span className="text-[var(--t-textMut)] flex-shrink-0 mt-0.5">{item.time}</span>
            <span
              className="px-1 rounded text-[9px] font-bold flex-shrink-0 mt-0.5"
              style={{ backgroundColor: item.color + '22', color: item.color }}
            >
              {item.tag}
            </span>
            <span className="text-[var(--t-textSec)] leading-tight">{item.text}</span>
          </div>
        ))}
      </div>
      <div className="mt-1 text-[10px] text-[var(--t-textMut)] flex items-center gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-green-400 pulse-dot inline-block" />
        {count} updates today
      </div>
    </div>
  );
}
