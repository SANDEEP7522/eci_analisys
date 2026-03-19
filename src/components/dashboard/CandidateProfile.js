'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CANDIDATES = [
  {
    name: 'Narendra Modi',
    party: 'BJP',
    constituency: 'Varanasi, UP',
    age: 74,
    education: 'MA Political Science',
    assets: '₹2.85 Cr',
    cases: 0,
    votes: '6,12,970',
    margin: '1,52,513',
    color: '#f97316',
    initials: 'NM',
  },
  {
    name: 'Rahul Gandhi',
    party: 'INC',
    constituency: 'Raebareli, UP',
    age: 53,
    education: 'MPhil Cambridge',
    assets: '₹20.22 Cr',
    cases: 2,
    votes: '6,84,597',
    margin: '3,90,030',
    color: '#1e3a8a',
    initials: 'RG',
  },
  {
    name: 'Akhilesh Yadav',
    party: 'SP',
    constituency: 'Kannauj, UP',
    age: 51,
    education: 'MA Environmental Science',
    assets: '₹74.96 Cr',
    cases: 1,
    votes: '6,27,472',
    margin: '1,70,922',
    color: '#ef4444',
    initials: 'AY',
  },
];

export default function CandidateProfile() {
  const [idx, setIdx] = useState(0);
  const c = CANDIDATES[idx];

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 mb-2">
        {/* Avatar */}
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 border-2"
          style={{ backgroundColor: c.color + '33', borderColor: c.color }}
        >
          {c.initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-bold text-[var(--t-text)] text-xs truncate">{c.name}</div>
          <div className="text-[10px] text-[var(--t-textSec)]">{c.constituency}</div>
        </div>
        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: c.color + '22', color: c.color }}>{c.party}</span>
      </div>

      <div className="grid grid-cols-2 gap-1 text-[10px] flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-2 gap-1 col-span-2"
          >
            {[
              ['Age', c.age + ' yrs'],
              ['Education', c.education],
              ['Assets', c.assets],
              ['Cases', c.cases === 0 ? 'None' : c.cases],
              ['Votes', c.votes],
              ['Margin', c.margin],
            ].map(([k, v], i) => (
              <motion.div
                key={k}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-[var(--t-bgCard)] rounded px-2 py-1 border border-transparent hover:border-[var(--t-border)] transition-colors"
              >
                <div className="text-[var(--t-textMut)]">{k}</div>
                <div className="text-[var(--t-text)] font-semibold truncate">{v}</div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-between mt-2">
        <button onClick={() => setIdx((idx - 1 + CANDIDATES.length) % CANDIDATES.length)} className="p-1 rounded hover:bg-[var(--t-bgCard)] text-[var(--t-textSec)]">
          <ChevronLeft size={14} />
        </button>
        <div className="flex gap-1">
          {CANDIDATES.map((_, i) => (
            <div key={i} className={`w-1.5 h-1.5 rounded-full transition-colors`} style={{ backgroundColor: i === idx ? '#6366f1' : 'var(--t-border)' }} />
          ))}
        </div>
        <button onClick={() => setIdx((idx + 1) % CANDIDATES.length)} className="p-1 rounded hover:bg-[var(--t-bgCard)] text-[var(--t-textSec)]">
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
