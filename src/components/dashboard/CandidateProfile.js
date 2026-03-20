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

  {
    name: 'Amit Shah',
    party: 'BJP',
    constituency: 'Gandhinagar, GJ',
    age: 60,
    education: 'BSc Biochemistry',
    assets: '₹65.67 Cr',
    cases: 0,
    votes: '8,33,000',
    margin: '7,40,000',
    color: '#f97316',
    initials: 'AS',
  },
  {
    name: 'Smriti Irani',
    party: 'BJP',
    constituency: 'Amethi, UP',
    age: 48,
    education: 'BCom (Incomplete)',
    assets: '₹11.12 Cr',
    cases: 0,
    votes: '4,50,000',
    margin: '55,000',
    color: '#f97316',
    initials: 'SI',
  },
  {
    name: 'Priyanka Gandhi',
    party: 'INC',
    constituency: 'Wayanad, KL',
    age: 52,
    education: 'BA Psychology',
    assets: '₹12.00 Cr',
    cases: 0,
    votes: '5,20,000',
    margin: '2,00,000',
    color: '#1e3a8a',
    initials: 'PG',
  },
  {
    name: 'Mamata Banerjee',
    party: 'AITC',
    constituency: 'Bhabanipur, WB',
    age: 69,
    education: 'LLB',
    assets: '₹15.38 Lakh',
    cases: 0,
    votes: '85,000',
    margin: '58,000',
    color: '#22c55e',
    initials: 'MB',
  },
  {
    name: 'Arvind Kejriwal',
    party: 'AAP',
    constituency: 'New Delhi, DL',
    age: 56,
    education: 'IIT Kharagpur (BTech)',
    assets: '₹3.40 Cr',
    cases: 0,
    votes: '57,000',
    margin: '21,000',
    color: '#0ea5e9',
    initials: 'AK',
  },
  {
    name: 'Tejashwi Yadav',
    party: 'RJD',
    constituency: 'Raghopur, BR',
    age: 35,
    education: '12th Pass',
    assets: '₹5.88 Cr',
    cases: 0,
    votes: '1,20,000',
    margin: '35,000',
    color: '#16a34a',
    initials: 'TY',
  },
  {
    name: 'Yogi Adityanath',
    party: 'BJP',
    constituency: 'Gorakhpur, UP',
    age: 52,
    education: 'BSc Mathematics',
    assets: '₹1.54 Cr',
    cases: 0,
    votes: '5,10,000',
    margin: '1,03,000',
    color: '#f97316',
    initials: 'YA',
  },
];

export default function CandidateProfile() {
  const [idx, setIdx] = useState(0);
  const c = CANDIDATES[idx];

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-1.5 mb-1">
        {/* Avatar */}
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-[10px] flex-shrink-0 border-2"
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

      <div className="grid grid-cols-2 gap-0.5 text-[9px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-2 gap-0.5 col-span-2 content-start"
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
                initial={{ opacity: 0, y: 3 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="bg-[var(--t-bgCard)] rounded px-1 py-[2px] border border-transparent hover:border-[var(--t-border)] transition-colors leading-tight"
              >
                <div className="text-[var(--t-textMut)] leading-none p-1">{k}</div>
                <div className="text-[var(--t-text)] font-semibold truncate leading-none p-1">{v}</div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-between mt-1">
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
