'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FEED_ITEMS = [
  { time: '10:36', text: 'UP: BJP leads in 24/80 seats, SP ahead in 36', tag: 'UP', color: '#FF822D' },
  { time: '10:34', text: 'Kerala: LDF sweeping with 16/20 leads', tag: 'KL', color: '#15B77E' },
  { time: '10:32', text: 'Tamil Nadu: DMK dominates — leads in 34/39', tag: 'TN', color: '#B261EC' },
  { time: '10:30', text: 'Maharashtra: MVA vs MahaYuti close contest', tag: 'MH', color: '#4271FE' },
  { time: '10:28', text: 'West Bengal: TMC leads in 28/42 constituencies', tag: 'WB', color: '#15B77E' },
  { time: '10:25', text: 'Rajasthan: INC recovering, leads 12/25', tag: 'RJ', color: '#4271FE' },
  { time: '10:22', text: 'Bihar: NDA holds advantage, 24/40 leads', tag: 'BR', color: '#FF822D' },
  { time: '10:20', text: 'Gujarat: BJP dominant with 22/26 leads', tag: 'GJ', color: '#FF822D' },
  { time: '10:18', text: 'Andhra: TDP leading in 20/25 constituencies', tag: 'AP', color: '#14C1D7' },
  { time: '10:15', text: 'Punjab: SAD holds 3, AAP 7, INC 5 leads', tag: 'PB', color: '#F5A623' },
  { time: '10:12', text: 'Odisha: BJP gaining ground, 15/21 leads', tag: 'OD', color: '#FF822D' },
  { time: '10:09', text: 'Jharkhand: NDA ahead in 9, INDIA in 5', tag: 'JH', color: '#FF822D' },
  { time: '10:05', text: 'Assam: NDA dominates with 10/14 leads', tag: 'AS', color: '#FF822D' },
  { time: '10:02', text: 'Telangana: INC leads 8, BJP 4, BRS 2', tag: 'TS', color: '#4271FE' },
  { time: '09:58', text: 'Chhattisgarh: BJP sweeping 10/11 leads', tag: 'CT', color: '#FF822D' },
  { time: '09:55', text: 'Haryana: INC and BJP tied at 5 leads each', tag: 'HR', color: '#4271FE' },
  { time: '09:50', text: 'Delhi: AAP-INC alliance leads in 4/7', tag: 'DL', color: '#14C1D7' },
  { time: '09:45', text: 'Uttarakhand: BJP clean sweep 5/5 leads', tag: 'UK', color: '#FF822D' },
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
        <AnimatePresence initial={false}>
          {FEED_ITEMS.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-start gap-1.5 text-[10px] py-1 border-b border-[var(--t-border)]"
            >
              <span className="text-[var(--t-textMut)] flex-shrink-0 mt-0.5">{item.time}</span>
              <span
                className="px-1 rounded text-[9px] font-bold flex-shrink-0 mt-0.5"
                style={{ backgroundColor: item.color + '22', color: item.color }}
              >
                {item.tag}
              </span>
              <span className="text-[var(--t-textSec)] leading-tight">{item.text}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <div className="mt-1 text-[10px] text-[var(--t-textMut)] flex items-center gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-green-400 pulse-dot inline-block" />
        {count} updates today
      </div>
    </div>
  );
}
