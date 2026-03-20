"use client";

import dynamic from "next/dynamic";
import { useState, useEffect, useRef, useMemo } from "react";
import {
  TrendingUp, BarChart2, Download, Radio, GitCompare, Sun, Moon, Menu, X,
} from "lucide-react";
import {
  motion, useMotionValue, useTransform, useSpring, AnimatePresence,
} from "framer-motion";
import {
  ELECTION_DATA_BY_YEAR, PARTY_COLORS,
  PARTIES_BY_YEAR, ALLIANCES_BY_YEAR, STATE_DATA_BY_YEAR,
  SENTIMENT_BY_YEAR, TICKER_BY_YEAR,
} from "@/data/dummy";
import { useTheme } from "@/context/ThemeContext";

// ── Dynamic imports ───────────────────────────────────────────────────────────
const IndiaMap            = dynamic(() => import("@/components/charts/IndiaMap"),                 { ssr: false });
const VoteSharePie        = dynamic(() => import("@/components/charts/VoteSharePie"),             { ssr: false });
const ConstituencyScatter = dynamic(() => import("@/components/charts/ConstituencyScatter"),      { ssr: false });
const SeatShareArea       = dynamic(() => import("@/components/charts/SeatShareArea"),            { ssr: false });
const StatePerformanceChart = dynamic(() => import("@/components/charts/StatePerformanceChart"),  { ssr: false });
const VoteShareTrendLine  = dynamic(() => import("@/components/charts/VoteShareTrendLine"),       { ssr: false });
const CoalitionDonut      = dynamic(() => import("@/components/charts/CoalitionDonut"),           { ssr: false });
const SentimentSparkline  = dynamic(() => import("@/components/charts/SentimentSparkline"),       { ssr: false });
const SentimentGauge      = dynamic(() => import("@/components/charts/SentimentGauge"),           { ssr: false });
const CandidateProfile    = dynamic(() => import("@/components/dashboard/CandidateProfile"),      { ssr: false });
const LiveFeed            = dynamic(() => import("@/components/dashboard/LiveFeed"),              { ssr: false });
const FiltersPanel        = dynamic(() => import("@/components/dashboard/FiltersPanel"),          { ssr: false });

// ── Motion variants ───────────────────────────────────────────────────────────
const cardReveal = {
  hidden: { opacity: 0, y: 22, scale: 0.97 },
  visible: (i = 0) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { delay: i * 0.07, duration: 0.55, ease: [0.23, 1, 0.32, 1] },
  }),
};
const slideLeft  = { hidden: { opacity: 0, x: -28 }, visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.23,1,0.32,1] } } };
const slideRight = { hidden: { opacity: 0, x:  28 }, visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.23,1,0.32,1] } } };
const fadeIn     = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.5 } } };

// ── Filter defaults ───────────────────────────────────────────────────────────
const FILTER_DEFAULTS = {
  year: "2024", region: "All India", state: "All States",
  party: "All Parties", alliance: "All Alliances", phase: "All Phases",
  conType: "All Types", margin: "Any Margin", turnout: "Any Turnout",
  status: "All Results", dateFrom: "2024-04-19", dateTo: "2024-06-01",
};

// ── Filter lookup tables ──────────────────────────────────────────────────────
const REGION_CODES = {
  "North India":     ["UP", "HR", "HP", "PB", "UK", "JK", "DL", "CH", "RJ"],
  "South India":     ["TN", "KA", "KL", "AP", "TS", "LD"],
  "East India":      ["WB", "OD", "BR", "JH", "AS"],
  "West India":      ["MH", "GJ", "GA", "DD", "DN"],
  "Central India":   ["MP", "CT"],
  "Northeast India": ["AR", "ML", "MN", "MZ", "NL", "SK", "TR", "AN"],
};

const STATE_NAME_TO_CODE = {
  "Uttar Pradesh": "UP", "Maharashtra": "MH", "West Bengal": "WB",
  "Bihar": "BR", "Tamil Nadu": "TN", "Rajasthan": "RJ", "Gujarat": "GJ",
  "Madhya Pradesh": "MP", "Andhra Pradesh": "AP", "Karnataka": "KA",
  "Punjab": "PB", "Telangana": "TS", "Kerala": "KL", "Odisha": "OD",
  "Haryana": "HR", "Delhi": "DL", "Assam": "AS", "Jharkhand": "JH",
  "Chhattisgarh": "CT", "Uttarakhand": "UK", "Himachal Pradesh": "HP",
  "Tripura": "TR", "Goa": "GA", "Manipur": "MN", "Meghalaya": "ML",
  "Nagaland": "NL", "Arunachal Pradesh": "AR", "Mizoram": "MZ", "Sikkim": "SK",
};

// Votes cast per election year (Crores) — totalVoters × turnout%
const VOTES_CAST_CR = {
  '1999': 36.5, '2004': 38.9, '2009': 41.7,
  '2014': 54.1, '2019': 61.3, '2024': 63.8,
};
const YEAR_ORDER = ['1999', '2004', '2009', '2014', '2019', '2024'];

const ALLIANCE_PARTIES = {
  "NDA":   ["BJP", "TDP", "JDU", "SHS", "NCP", "AINRC", "NPP", "NDPP"],
  "INDIA": ["INC", "SP", "TMC", "DMK", "AAP", "JMM", "CPI(M)", "VCK", "RJD"],
};

// ── All states data (Lok Sabha 2024) ─────────────────────────────────────────
const ALL_STATES_DATA = [
  { id: "UP", state: "Uttar Pradesh",  seats: 80, party: "SP",  won: 37, color: "#F04F5C", alliance: "INDIA",     region: "North India"     },
  { id: "RJ", state: "Rajasthan",      seats: 25, party: "BJP", won: 14, color: "#FF822D", alliance: "NDA",       region: "North India"     },
  { id: "HR", state: "Haryana",        seats: 10, party: "BJP", won: 5,  color: "#FF822D", alliance: "NDA",       region: "North India"     },
  { id: "PB", state: "Punjab",         seats: 13, party: "INC", won: 7,  color: "#4271FE", alliance: "INDIA",     region: "North India"     },
  { id: "DL", state: "Delhi",          seats: 7,  party: "BJP", won: 7,  color: "#FF822D", alliance: "NDA",       region: "North India"     },
  { id: "HP", state: "Himachal Pradesh",seats: 4, party: "INC", won: 4,  color: "#4271FE", alliance: "INDIA",     region: "North India"     },
  { id: "WB", state: "West Bengal",    seats: 42, party: "TMC", won: 29, color: "#15B77E", alliance: "INDIA",     region: "East India"      },
  { id: "BR", state: "Bihar",          seats: 40, party: "JDU", won: 12, color: "#9061F9", alliance: "NDA",       region: "East India"      },
  { id: "OD", state: "Odisha",         seats: 21, party: "BJP", won: 20, color: "#FF822D", alliance: "NDA",       region: "East India"      },
  { id: "JH", state: "Jharkhand",      seats: 14, party: "BJP", won: 8,  color: "#FF822D", alliance: "NDA",       region: "East India"      },
  { id: "AS", state: "Assam",          seats: 14, party: "BJP", won: 9,  color: "#FF822D", alliance: "NDA",       region: "Northeast India" },
  { id: "MH", state: "Maharashtra",    seats: 48, party: "BJP", won: 23, color: "#FF822D", alliance: "NDA",       region: "West India"      },
  { id: "GJ", state: "Gujarat",        seats: 26, party: "BJP", won: 26, color: "#FF822D", alliance: "NDA",       region: "West India"      },
  { id: "GA", state: "Goa",            seats: 2,  party: "BJP", won: 2,  color: "#FF822D", alliance: "NDA",       region: "West India"      },
  { id: "MP", state: "Madhya Pradesh", seats: 29, party: "BJP", won: 29, color: "#FF822D", alliance: "NDA",       region: "Central India"   },
  { id: "CT", state: "Chhattisgarh",   seats: 11, party: "BJP", won: 10, color: "#FF822D", alliance: "NDA",       region: "Central India"   },
  { id: "TN", state: "Tamil Nadu",     seats: 39, party: "DMK", won: 22, color: "#B261EC", alliance: "INDIA",     region: "South India"     },
  { id: "KA", state: "Karnataka",      seats: 28, party: "BJP", won: 17, color: "#FF822D", alliance: "NDA",       region: "South India"     },
  { id: "KL", state: "Kerala",         seats: 20, party: "INC", won: 18, color: "#4271FE", alliance: "INDIA",     region: "South India"     },
  { id: "AP", state: "Andhra Pradesh", seats: 25, party: "TDP", won: 16, color: "#14C1D7", alliance: "NDA",       region: "South India"     },
  { id: "TS", state: "Telangana",      seats: 17, party: "INC", won: 8,  color: "#4271FE", alliance: "INDIA",     region: "South India"     },
  { id: "JK", state: "Jammu & Kashmir",seats: 90, party: "NC",  won: 42, color: "#F04F5C", alliance: "INDIA",     region: "North India"     },
];

// ── Motion helpers ────────────────────────────────────────────────────────────
function AuroraBg({ isDark }) {
  if (!isDark) return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #f0f4ff 0%, #fef6ee 50%, #f0f9f4 100%)" }} />
      <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
    </div>
  );
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <div className="absolute inset-0" style={{ background: "#03040d" }} />
      <div className="aurora aurora-1" /><div className="aurora aurora-2" /><div className="aurora aurora-3" />
      <div className="absolute inset-0 bg-grid" />
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 50%, transparent 35%, rgba(3,4,13,0.88) 100%)" }} />
    </div>
  );
}

function LiveClock() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    tick(); const id = setInterval(tick, 1000); return () => clearInterval(id);
  }, []);
  return <span className="font-mono text-[10px] tabular-nums" style={{ color: "var(--t-accent)" }}>{time}</span>;
}

function AnimCounter({ target, duration = 1400, suffix = "", prefix = "" }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const rafRef = useRef(null);
  useEffect(() => {
    // Cancel any in-progress animation
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setVal(0);
    let start = null;
    const step = ts => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setVal(Math.round((1 - Math.pow(2, -10 * p)) * target));
      if (p < 1) rafRef.current = requestAnimationFrame(step);
    };
    // Only animate if element is visible, else set value immediately
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      if (rect.top < window.innerHeight) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        setVal(target);
      }
    }
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [target, duration]);
  return <span ref={ref}>{prefix}{val.toLocaleString("en-IN")}{suffix}</span>;
}

function TiltCard({ children, className = "", intensity = 7 }) {
  const ref = useRef(null);
  const mx = useMotionValue(0); const my = useMotionValue(0);
  const srX = useSpring(useTransform(my, [-80, 80], [ intensity, -intensity]), { stiffness: 300, damping: 30 });
  const srY = useSpring(useTransform(mx, [-80, 80], [-intensity,  intensity]), { stiffness: 300, damping: 30 });
  const onMove  = e => { const r = ref.current?.getBoundingClientRect(); if (!r) return; mx.set(e.clientX - (r.left + r.width/2)); my.set(e.clientY - (r.top + r.height/2)); };
  const onLeave = () => { mx.set(0); my.set(0); };
  return <motion.div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} style={{ rotateX: srX, rotateY: srY, transformStyle: "preserve-3d", perspective: 900 }} className={className}>{children}</motion.div>;
}

function GlassCard({ title, children, className = "", headerRight, action, onAction, custom = 0 }) {
  return (
    <motion.div variants={cardReveal} initial="hidden" animate="visible" custom={custom} whileHover={{ y: -3, transition: { duration: 0.2 } }} className={`relative overflow-hidden rounded-2xl glass-card flex flex-col ${className}`}>
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />
      {title && (
        <div className="flex items-center justify-between px-1 py-2 border-b border-[var(--t-border)] flex-shrink-0 h-2">
          <span className="text-[10px] font-bold tracking-widest uppercase text-[var(--t-textMut)]">{title}</span>
          {headerRight || (action && <button onClick={onAction} className="text-[10px] font-semibold hover:opacity-80" style={{ color: "var(--t-accent)" }}>{action}</button>)}
        </div>
      )}
      <div className="flex-1 p-2 min-h-0 overflow-hidden">{children}</div>
    </motion.div>
  );
}

function NeonStatCard({ title, value, sub1, sub2, color = "#FF822D", children, index = 0 }) {
  return (
    <motion.div variants={cardReveal} initial="hidden" animate="visible" custom={index} whileHover={{ scale: 1.02, y: -2, transition: { duration: 0.2 } }} className="glass-card rounded-xl p-2.5 flex flex-col gap-1 relative overflow-hidden flex-1 min-w-[110px] cursor-default">
      <div className="absolute inset-x-0 top-0 h-0.5 rounded-t-xl" style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }} />
      <div className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider leading-tight text-[var(--t-textMut)]">{title}</div>
      <div className="text-base sm:text-xl font-black leading-tight" style={{ color, textShadow: `0 0 16px ${color}40` }}>{value}</div>
      {sub1 && <div className="text-[9px] truncate leading-tight text-[var(--t-textSec)]">{sub1}</div>}
      {sub2 && <div className="text-[9px] truncate leading-tight text-[var(--t-textMut)]">{sub2}</div>}
      {children}
    </motion.div>
  );
}

function CoalitionRaceBar({ label, seats, total, color, delay = 0 }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] font-black w-12 flex-shrink-0" style={{ color }}>{label}</span>
      <div className="flex-1 h-2.5 rounded-full overflow-hidden bg-[var(--t-bgCard)]">
        <motion.div className="h-full rounded-full" style={{ background: `linear-gradient(90deg, ${color}bb, ${color})`, boxShadow: `0 0 10px ${color}55` }} initial={{ width: 0 }} animate={{ width: `${(seats / total) * 100}%` }} transition={{ duration: 1.3, delay, ease: [0.23, 1, 0.32, 1] }} />
      </div>
      <motion.span className="text-[11px] font-black w-8 text-right flex-shrink-0" style={{ color }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: delay + 0.6 }}>{seats}</motion.span>
    </div>
  );
}

function CoalitionRaceWidget({ alliancesData = [], majorityMark = 272 }) {
  const total  = alliancesData.reduce((s, a) => s + a.seats, 0) || 543;
  const leader = alliancesData.reduce((a, b) => (a.seats > b.seats ? a : b), alliancesData[0] || { seats: 0, name: '—' });
  const margin = leader.seats - majorityMark;
  return (
    <div className="space-y-3 pt-1">
      {alliancesData.map((a, i) => (
        <CoalitionRaceBar key={a.name} label={a.name} seats={a.seats} total={total} color={a.color} delay={0.15 + i * 0.15} />
      ))}
      <div className="pt-2 border-t border-[var(--t-border)] flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
          <span className="text-[9px] text-[var(--t-textMut)]">Majority: {majorityMark}</span>
        </div>
        <span className="text-[10px] font-black" style={{ color: leader.color || "#FF822D" }}>
          {leader.name} {margin >= 0 ? `+${margin} ↑` : `${margin} ↓`}
        </span>
      </div>
    </div>
  );
}

// ── Ticker / static data ──────────────────────────────────────────────────────
const TICKER_ITEMS = [
  "Maharashtra: INC leads in 28/48 | Tamil Nadu: DMK sweeps 34/39 | Rajasthan: BJP 14/25",
  "Live Updates: INC – 99 seats | BJP – 240 seats | SP – 37 seats",
  "Maharashtra BJP 23-13 | Tamil Nadu DMK wins 22/39 | Rajasthan BJP sweeps 14/25",
];

const PARTIES_TICKER = [
  { name: "INC", color: "#4271FE", seats: 99  },
  { name: "TDP", color: "#14C1D7", seats: 16  },
  { name: "SP",  color: "#F04F5C", seats: 37  },
  { name: "NCP", color: "#F5A623", seats: 8   },
  { name: "JDU", color: "#9061F9", seats: 12  },
  { name: "BSP", color: "#8E9CAE", seats: 0   },
  { name: "CPI", color: "#f43f5e", seats: 4   },
  { name: "AAP", color: "#14C1D7", seats: 3   },
  { name: "TMC", color: "#15B77E", seats: 29  },
  { name: "DMK", color: "#B261EC", seats: 22  },
  { name: "BJP", color: "#FF822D", seats: 240 },
  { name: "SHS", color: "#FF822D", seats: 7   },
];

const SOCIAL_BUZZ = [
  { party: "BJP", platform: "𝕏",  engagement: "+38%", color: "#FF822D", seats: 55 },
  { party: "INC", platform: "𝕏",  engagement: "+45%", color: "#4271FE", seats: 45 },
  { party: "BJP", platform: "FB", engagement: "+41%", color: "#FF822D", seats: 41 },
  { party: "INC", platform: "FB", engagement: "+29%", color: "#4271FE", seats: 29 },
  { party: "TMC", platform: "IG", engagement: "+22%", color: "#15B77E", seats: 22 },
  { party: "AAP", platform: "YT", engagement: "+52%", color: "#14C1D7", seats: 60 },
  { party: "SP",  platform: "WA", engagement: "+18%", color: "#F04F5C", seats: 20 },
  { party: "BJP", platform: "IG", engagement: "+47%", color: "#FF822D", seats: 47 },
  { party: "DMK", platform: "𝕏",  engagement: "+31%", color: "#B261EC", seats: 31 },
  { party: "INC", platform: "YT", engagement: "+39%", color: "#4271FE", seats: 39 },
  { party: "TDP", platform: "FB", engagement: "+25%", color: "#14C1D7", seats: 25 },
  { party: "JDU", platform: "WA", engagement: "+15%", color: "#9061F9", seats: 15 },
  { party: "SS",  platform: "IG", engagement: "+28%", color: "#F5A623", seats: 28 },
];

const ALL_LIVE_STATES = [
  { state: "UP", BJP: 33, SP: 37,  INC: 6,  Others: 4, region: "North India" },
  { state: "MH", BJP: 23, INC: 13, SS: 9,   Others: 3, region: "West India"  },
  { state: "WB", TMC: 29, BJP: 12, INC: 1,  Others: 0, region: "East India"  },
  { state: "TN", DMK: 22, INC: 9,  BJP: 0,  Others: 8, region: "South India" },
  { state: "BR", JDU: 12, BJP: 17, INC: 3,  Others: 8, region: "East India"  },
  { state: "MP", BJP: 29, INC: 0,  Others: 0, region: "Central India" },
  { state: "KA", BJP: 17, INC: 9,  JDS: 2,  Others: 0, region: "South India" },
  { state: "GJ", BJP: 25, INC: 1,  Others: 0, region: "West India" },
  { state: "RJ", BJP: 14, INC: 8,  Others: 3, region: "North India" },
  { state: "AP", TDP: 16, YSRCP: 4, JSP: 2, BJP: 3, Others: 0, region: "South India" },
  { state: "JK", NC: 42, BJP: 29, INC: 6, Others: 13, region: "North India" },
];

const STATE_COLORS = {
  BJP: "#FF822D", INC: "#4271FE", SP: "#F04F5C", TMC: "#15B77E",
  DMK: "#B261EC", JDU: "#9061F9", SS: "#F5A623", Others: "#8E9CAE",
};

// ── Active filter pill ────────────────────────────────────────────────────────
function FilterPill({ label, onRemove }) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.85 }}
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold"
      style={{ background: "var(--t-accentBg)", color: "var(--t-accent)", border: "1px solid var(--t-borderHi)" }}
    >
      {label}
      <button onClick={onRemove} className="hover:opacity-70"><X size={9} /></button>
    </motion.span>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function Home() {
  const [activeFilters, setActiveFilters] = useState({ ...FILTER_DEFAULTS });
  const [selectedMapState, setSelectedMapState] = useState(null);
  const [liveUpdates, setLiveUpdates]           = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen]     = useState(false);
  const { themeName, toggle: toggleTheme }      = useTheme();
  const isDark = themeName === "dark";

  const selectedYear    = activeFilters.year;
  const yearData        = ELECTION_DATA_BY_YEAR[selectedYear] || ELECTION_DATA_BY_YEAR["2024"];
  const summary         = yearData.summary;
  const stateHighlights = yearData.stateHighlights;
  const yearParties     = PARTIES_BY_YEAR[selectedYear]   || PARTIES_BY_YEAR["2024"];
  const yearAlliances   = ALLIANCES_BY_YEAR[selectedYear] || ALLIANCES_BY_YEAR["2024"];
  const yearStates      = STATE_DATA_BY_YEAR[selectedYear] || STATE_DATA_BY_YEAR["2024"];
  const yearSentiment   = SENTIMENT_BY_YEAR[selectedYear] || SENTIMENT_BY_YEAR["2024"];
  const yearTicker      = TICKER_BY_YEAR[selectedYear]    || TICKER_BY_YEAR["2024"];

  // ── Derived filter logic ──────────────────────────────────────────────────
  const filteredKeyStates = useMemo(() => {
    // If a state was clicked on the map, show only that state
    if (selectedMapState) {
      const found = yearStates.find(s => s.id === selectedMapState.id);
      if (found) return [found];
      // fallback to ALL_STATES_DATA
      const fallback = ALL_STATES_DATA.find(s => s.id === selectedMapState.id);
      return fallback ? [fallback] : [];
    }
    let states = yearStates;
    if (activeFilters.region !== "All India") {
      const codes = REGION_CODES[activeFilters.region] || [];
      states = states.filter(s => codes.includes(s.id));
    }
    if (activeFilters.state !== "All States") {
      const code = STATE_NAME_TO_CODE[activeFilters.state];
      if (code) states = states.filter(s => s.id === code);
    }
    if (activeFilters.party !== "All Parties") {
      states = states.filter(s => s.party === activeFilters.party);
    }
    if (activeFilters.alliance !== "All Alliances") {
      states = states.filter(s => s.alliance === activeFilters.alliance);
    }
    return states.slice(0, 8);
  }, [activeFilters, yearStates, selectedMapState]);

  const filteredPartiesData = useMemo(() => {
    if (activeFilters.party !== "All Parties") {
      return yearParties.filter(p => p.party === activeFilters.party || p.party === "Others");
    }
    if (activeFilters.alliance !== "All Alliances") {
      const allowed = ALLIANCE_PARTIES[activeFilters.alliance] || [];
      return yearParties.filter(p => allowed.includes(p.party));
    }
    return yearParties;
  }, [activeFilters, yearParties]);

  const filteredLiveStates = useMemo(() => {
    let states = ALL_LIVE_STATES;
    if (activeFilters.region !== "All India") {
      const codes = REGION_CODES[activeFilters.region] || [];
      states = states.filter(s => codes.includes(s.state));
    }
    if (activeFilters.state !== "All States") {
      const code = STATE_NAME_TO_CODE[activeFilters.state];
      if (code) states = states.filter(s => s.state === code);
    }
    return states;
  }, [activeFilters]);

  // Map derived props
  const mapHighlightState = useMemo(() => {
    if (activeFilters.state !== "All States") return STATE_NAME_TO_CODE[activeFilters.state] || selectedMapState?.id;
    return selectedMapState?.id;
  }, [activeFilters.state, selectedMapState]);

  const mapExternalViewMode = activeFilters.alliance !== "All Alliances" ? "alliance" : null;
  const mapHighlightParty   = activeFilters.party !== "All Parties" ? activeFilters.party : null;

  // Active filter pills (non-default, displayable)
  const PILL_KEYS = ["region", "state", "party", "alliance", "phase"];
  const activePills = useMemo(() =>
    PILL_KEYS.filter(k => activeFilters[k] !== FILTER_DEFAULTS[k])
      .map(k => ({ key: k, label: `${k.charAt(0).toUpperCase() + k.slice(1)}: ${activeFilters[k]}` })),
    [activeFilters]
  );

  const clearFilter = key => setActiveFilters(f => ({ ...f, [key]: FILTER_DEFAULTS[key] }));
  const clearAll    = () => setActiveFilters({ ...FILTER_DEFAULTS });

  const handleApply = filters => setActiveFilters(f => ({ ...f, ...filters }));

  return (
    <div className="flex flex-col min-h-screen lg:h-screen lg:overflow-hidden relative bg-[var(--t-bg)] text-[var(--t-text)]">
      <AuroraBg isDark={isDark} />

      {/* ── Global SVG gradient defs (referenced by charts & map) ─────────── */}
      <svg width="0" height="0" style={{ position: 'absolute', pointerEvents: 'none' }}>
        <defs>
          <linearGradient id="grad-orange"   x1="0" y1="1" x2="0" y2="0"><stop offset="0%"   stopColor="#FF5500"/><stop offset="100%" stopColor="#FFB347"/></linearGradient>
          <linearGradient id="grad-orange-h" x1="0" y1="0" x2="1" y2="0"><stop offset="0%"   stopColor="#FF6B2B"/><stop offset="100%" stopColor="#FFAB5E"/></linearGradient>
          <linearGradient id="grad-blue"     x1="0" y1="1" x2="0" y2="0"><stop offset="0%"   stopColor="#1E50CC"/><stop offset="100%" stopColor="#78AAFF"/></linearGradient>
          <linearGradient id="grad-blue-h"   x1="0" y1="0" x2="1" y2="0"><stop offset="0%"   stopColor="#2B5FF5"/><stop offset="100%" stopColor="#7FB3FF"/></linearGradient>
          <linearGradient id="grad-red"      x1="0" y1="1" x2="0" y2="0"><stop offset="0%"   stopColor="#C82035"/><stop offset="100%" stopColor="#FF6E7A"/></linearGradient>
          <linearGradient id="grad-red-h"    x1="0" y1="0" x2="1" y2="0"><stop offset="0%"   stopColor="#E02540"/><stop offset="100%" stopColor="#FF7080"/></linearGradient>
          <linearGradient id="grad-green"    x1="0" y1="1" x2="0" y2="0"><stop offset="0%"   stopColor="#0A8055"/><stop offset="100%" stopColor="#3DE8A0"/></linearGradient>
          <linearGradient id="grad-green-h"  x1="0" y1="0" x2="1" y2="0"><stop offset="0%"   stopColor="#11996A"/><stop offset="100%" stopColor="#55EABB"/></linearGradient>
          <linearGradient id="grad-purple"   x1="0" y1="1" x2="0" y2="0"><stop offset="0%"   stopColor="#7E2ECC"/><stop offset="100%" stopColor="#CF9BFF"/></linearGradient>
          <linearGradient id="grad-purple-h" x1="0" y1="0" x2="1" y2="0"><stop offset="0%"   stopColor="#9040EE"/><stop offset="100%" stopColor="#D5AAFF"/></linearGradient>
          <linearGradient id="grad-cyan"     x1="0" y1="1" x2="0" y2="0"><stop offset="0%"   stopColor="#0894AA"/><stop offset="100%" stopColor="#5AE2F8"/></linearGradient>
          <linearGradient id="grad-cyan-h"   x1="0" y1="0" x2="1" y2="0"><stop offset="0%"   stopColor="#0FA8C2"/><stop offset="100%" stopColor="#69E8FF"/></linearGradient>
          <linearGradient id="grad-amber"    x1="0" y1="1" x2="0" y2="0"><stop offset="0%"   stopColor="#C87A00"/><stop offset="100%" stopColor="#FFD060"/></linearGradient>
          <linearGradient id="grad-gray"     x1="0" y1="1" x2="0" y2="0"><stop offset="0%"   stopColor="#506078"/><stop offset="100%" stopColor="#A8BCCC"/></linearGradient>
          <linearGradient id="map-orange-grad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%"   stopColor="#FF5500"/><stop offset="55%"  stopColor="#FF822D"/><stop offset="100%" stopColor="#FFBE6A"/></linearGradient>
        </defs>
      </svg>

      {/* ══ NAVBAR ══════════════════════════════════════════════════════════ */}
      <nav className="sticky top-0 z-50 border-b border-[var(--t-border)]" style={{ background: "var(--t-header)", backdropFilter: "blur(28px)" }}>
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg overflow-hidden border border-[var(--t-border)] flex-shrink-0">
              <img src="/icons.jpg" alt="ECI" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="text-[12px] font-black text-[var(--t-text)] leading-tight tracking-wide">
                ECI <span style={{ color: "var(--t-accent)" }}>Analytics</span>
              </div>
              <div className="text-[9px] text-[var(--t-textMut)] hidden xs:block leading-tight">Lok Sabha General Elections</div>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full border" style={{ background: "var(--t-accentBg)", borderColor: "var(--t-borderHi)" }}>
              <span className="w-1.5 h-1.5 rounded-full pulse-dot" style={{ background: "var(--t-accent)" }} />
              <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: "var(--t-accent)" }}>Live</span>
            </div>
          </div>

          {/* Year pills */}
          <div className="hidden md:flex items-center gap-0.5">
            {["2024", "2019", "2014", "2009"].map(yr => (
              <motion.button key={yr} onClick={() => setActiveFilters(f => ({ ...f, year: yr }))} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                className="px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all"
                style={selectedYear === yr
                  ? { background: "var(--t-accentBg)", color: "var(--t-accent)", border: "1px solid var(--t-borderHi)" }
                  : { color: "var(--t-textMut)", border: "1px solid transparent" }}
              >{yr}</motion.button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <LiveClock />
            <motion.button onClick={toggleTheme} whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.94 }} className="p-1.5 rounded-lg border border-[var(--t-border)] hover:border-[var(--t-borderHi)] bg-[var(--t-bgCard)] text-[var(--t-textSec)] hover:text-[var(--t-text)] transition-colors">
              {isDark ? <Sun size={13} /> : <Moon size={13} />}
            </motion.button>
            <div className="hidden sm:block">
              <FiltersPanel selectedYear={selectedYear} onApply={handleApply} />
            </div>
            <button className="sm:hidden p-1.5 rounded-lg border border-[var(--t-border)] bg-[var(--t-bgCard)] text-[var(--t-textSec)]" onClick={() => setMobileMenuOpen(o => !o)}>
              {mobileMenuOpen ? <X size={13} /> : <Menu size={13} />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: [0.23,1,0.32,1] }} className="sm:hidden border-t border-[var(--t-border)] overflow-hidden">
              <div className="px-4 py-3 flex flex-col gap-3">
                <FiltersPanel selectedYear={selectedYear} onApply={f => { handleApply(f); setMobileMenuOpen(false); }} />
                <div className="flex items-center gap-3 flex-wrap text-[10px] text-[var(--t-textSec)]">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <Radio size={10} className="text-green-500 p-1" /> Live Updates
                    <div onClick={() => setLiveUpdates(l => !l)} className={`w-7 h-3.5 rounded-full relative cursor-pointer transition-colors ${liveUpdates ? "bg-green-500" : "bg-[var(--t-bgCard)]"}`}>
                      <div className={`absolute top-0.5 w-2.5 h-2.5 bg-white rounded-full transition-all ${liveUpdates ? "left-4" : "left-0.5"}`} />
                    </div>
                  </label>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ══ ACTIVE FILTER PILLS ══════════════════════════════════════════════ */}
      <AnimatePresence>
        {activePills.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="border-b border-[var(--t-border)] px-4 py-1.5 flex items-center gap-2 flex-wrap relative z-10 overflow-hidden"
            style={{ background: "var(--t-accentBg)" }}
          >
            <span className="text-[9px] font-bold uppercase tracking-widest text-[var(--t-textMut)]">Filters:</span>
            {activePills.map(p => (
              <FilterPill key={p.key} label={p.label} onRemove={() => clearFilter(p.key)} />
            ))}
            <button onClick={clearAll} className="ml-auto text-[9px] font-bold text-[var(--t-textMut)] hover:text-[var(--t-accent)] transition-colors flex items-center gap-1">
              <X size={10} /> Clear All
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══ TOP STATS BAR ════════════════════════════════════════════════════ */}
      <div className="border-b border-[var(--t-border)] px-3 py-2.5 flex-shrink-0 relative z-10" style={{ background: "var(--t-sidebar)", backdropFilter: "blur(16px)" }}>
        <div className="grid grid-cols-2 sm:flex sm:flex-nowrap gap-2 overflow-x-auto">
          <NeonStatCard title="Sentiment" value="" color="#14C1D7" index={0}>
            <div className="h-7"><SentimentSparkline positive={yearSentiment.positive} negative={yearSentiment.negative} /></div>
            <div className="flex gap-2 text-[8px] mt-0.5">
              <span style={{ color: "#14C1D7" }}>▲ +{yearSentiment.positive}%</span>
              <span style={{ color: "#F04F5C" }}>▼ -{yearSentiment.negative}%</span>
            </div>
          </NeonStatCard>

          <NeonStatCard title="Seats Won" value={<AnimCounter key={selectedYear} target={summary.leadingParty.seats} />}
            sub1={`${summary.leadingParty.name} | Total: ${summary.totalSeats}`}
            sub2={`Decided: ${summary.seatsDecided}`} color="#4271FE" index={1} />

          <NeonStatCard title="Voter Turnout" value={<><AnimCounter key={selectedYear} target={summary.turnoutPercentage} />%</>}
            sub1="M: 67.1% | F: 65.8%" sub2={`Voters: ${summary.totalVoters}`} color="#15B77E" index={2} />

          <NeonStatCard title="Leading Alliance" value={summary.leadingParty.name}
            sub1={`${summary.leadingParty.seats} seats`} sub2={`Maj: ${summary.majorityMark}`}
            color={summary.leadingParty.color || "#FF822D"} index={3}>
            <div className="w-full rounded-full h-1 mt-1 overflow-hidden bg-[var(--t-bgCard)]">
              <motion.div className="h-1 rounded-full" style={{ background: "linear-gradient(90deg, #FF822D, #ff9a3c)", boxShadow: "0 0 8px rgba(255,107,0,0.5)" }}
                initial={{ width: 0 }} animate={{ width: `${(summary.leadingParty.seats / summary.totalSeats) * 100}%` }}
                transition={{ duration: 1.2, delay: 0.5, ease: [0.23,1,0.32,1] }} />
            </div>
          </NeonStatCard>

          <NeonStatCard title="Majority Mark" value={<AnimCounter key={selectedYear} target={summary.majorityMark} />}
            sub1={`Won: ${summary.leadingParty.seats}`}
            sub2={(() => { const m = summary.leadingParty.seats - summary.majorityMark; return `Margin: ${m >= 0 ? '+' : ''}${m}`; })()}
            color="#9061F9" index={4}>
            <div className="relative w-full h-3 mt-1">
              <svg viewBox="0 0 100 12" className="w-full h-full">
                <rect x="0" y="4" width="100" height="4" rx="2" fill="var(--t-bgCard)" />
                <rect x="0" y="4" width={`${(summary.majorityMark / summary.totalSeats) * 100}`} height="4" rx="2" fill="rgba(139,92,246,0.2)" />
                <rect x="0" y="4" width={`${(summary.leadingParty.seats / summary.totalSeats) * 100}`} height="4" rx="2" fill="#9061F9" />
                <line x1={`${(summary.majorityMark / summary.totalSeats) * 100}`} y1="1" x2={`${(summary.majorityMark / summary.totalSeats) * 100}`} y2="11" stroke="#F04F5C" strokeWidth="1" strokeDasharray="2" />
              </svg>
            </div>
          </NeonStatCard>

          {(() => {
            const cur  = VOTES_CAST_CR[selectedYear];
            const prev = VOTES_CAST_CR[YEAR_ORDER[YEAR_ORDER.indexOf(selectedYear) - 1]];
            const pct  = prev ? (((cur - prev) / prev) * 100).toFixed(1) : null;
            const color = pct !== null && parseFloat(pct) >= 0 ? '#15B77E' : '#F04F5C';
            return (
              <NeonStatCard
                title="New Votes %"
                value={pct !== null
                  ? <span style={{ color }}>{parseFloat(pct) >= 0 ? '+' : ''}{pct}%</span>
                  : <span style={{ color: '#8E9CAE' }}>—</span>}
                sub1={`Cast: ${cur} Cr`}
                sub2={prev ? `Prev: ${prev} Cr` : 'Base year'}
                color={pct !== null ? color : '#8E9CAE'} index={5}
              />
            );
          })()}

          {(() => {
            const nonVoterPct = (100 - summary.turnoutPercentage).toFixed(1);
            return (
              <NeonStatCard
                title="Votes Not Cast"
                value={<>{nonVoterPct}%</>}
                sub1={`Turnout: ${summary.turnoutPercentage}%`}
                sub2={`Non-Voters: ${nonVoterPct}%`}
                color="#F04F5C" index={6}
              />
            );
          })()}

        </div>
      </div>

      {/* ══ MAIN BODY ════════════════════════════════════════════════════════ */}
      <div className="flex flex-col lg:flex-row gap-3 p-3 flex-1 min-h-0 relative z-10 lg:overflow-hidden">

        {/* ── LEFT ──────────────────────────────────────────────────────── */}
        <motion.div variants={slideLeft} initial="hidden" animate="visible" className="flex flex-col gap-3 w-full lg:w-[288px] xl:w-[308px] lg:flex-shrink-0 overflow-y-auto min-h-0 pr-1 pb-1">
          <GlassCard title="Live Updates" headerRight={<span className="text-[10px] text-green-500 flex items-center gap-1 p-2 m-1"><span className="w-1.5 h-1.5 rounded-full bg-green-500 pulse-dot" />Live</span>} className="flex-1 min-h-[150px] p-1"><LiveFeed /></GlassCard>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-3">
            <GlassCard title="Sentiment Analysis" action={`+${yearSentiment.positive}/${yearSentiment.positive + yearSentiment.neutral}`} className="min-h-[195px] p-1">
              <SentimentGauge positive={yearSentiment.positive} neutral={yearSentiment.neutral} negative={yearSentiment.negative} />
            </GlassCard>
            <GlassCard title="Coalition Race" action={`${summary.totalSeats} seats`} className="min-h-[175px] p-1">
              <CoalitionRaceWidget alliancesData={yearAlliances} majorityMark={summary.majorityMark} />
            </GlassCard>
          </div>
          <GlassCard title="Candidate Profile" action="View All" onAction={() => {}} className="min-h-[240px] p-1 flex-shrink-0"><CandidateProfile /></GlassCard>
        </motion.div>

        {/* ── CENTER ────────────────────────────────────────────────────── */}
        <motion.div variants={fadeIn} initial="hidden" animate="visible" className="flex flex-col gap-3 w-full lg:flex-1 lg:min-w-0 overflow-y-auto min-h-0 pr-1 pb-1">
          <div className="flex flex-col lg:flex-row gap-3 flex-1 min-h-0">

            {/* India Map */}
            <div className="flex-1 min-w-0 glass-card rounded-2xl flex flex-col overflow-hidden h-[370px] sm:h-[420px] lg:h-auto lg:min-h-[500px]">
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-[var(--t-border)] flex-shrink-0">
                <span className="text-[10px] font-bold tracking-widest uppercase text-[var(--t-textMut)] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 pulse-dot" />
                  State-wise Election Results
                  {(mapHighlightParty || mapExternalViewMode) && (
                    <span className="ml-1 px-1.5 py-0.5 rounded text-[8px] font-bold" style={{ background: "var(--t-accentBg)", color: "var(--t-accent)" }}>
                      {mapHighlightParty || (mapExternalViewMode === "alliance" ? "By Alliance" : "")}
                    </span>
                  )}
                </span>
                <span className="text-[10px] font-mono font-bold" style={{ color: "var(--t-accent)" }}>{selectedYear}</span>
              </div>
              {/* Live ticker — directly below heading */}
              <div className="flex-shrink-0 border-b border-[var(--t-border)] py-1 px-3 overflow-hidden bg-[var(--t-sidebar)]">
                <div className="flex items-center gap-2.5">
                  <span className="text-[9px] font-black flex-shrink-0 uppercase tracking-widest" style={{ color: "var(--t-accent)" }}>Live</span>
                  <div className="flex-1 overflow-hidden">
                    <div className="flex gap-8 ticker-inner whitespace-nowrap">
                      {[...TICKER_ITEMS, ...TICKER_ITEMS].map((t, i) => (
                        <span key={i} className="text-[9px] flex-shrink-0 text-[var(--t-textMut)]">{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex-1 min-h-0 p-2 overflow-hidden">
                <IndiaMap
                  key={`${selectedYear}-${mapExternalViewMode}-${mapHighlightParty}`}
                  selectedYear={selectedYear}
                  onStateClick={setSelectedMapState}
                  highlightState={mapHighlightState}
                  stateData={stateHighlights}
                  externalViewMode={mapExternalViewMode}
                  highlightParty={mapHighlightParty}
                />
              </div>

            </div>

            {/* Key States panel */}
            <div className="w-full lg:w-[288px] xl:w-[316px] lg:flex-shrink-0 glass-card rounded-2xl flex flex-col overflow-hidden max-h-[120px] lg:max-h-none">
              <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-[var(--t-border)] flex-shrink-0">
                {selectedMapState ? (
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <button
                      onClick={() => setSelectedMapState(null)}
                      className="flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded transition-all hover:opacity-80"
                      style={{ background: "var(--t-accentBg)", color: "var(--t-accent)", border: "1px solid var(--t-borderHi)" }}
                    >
                      ← Back
                    </button>
                    <span className="text-[10px] font-bold truncate text-[var(--t-text)]">{selectedMapState.name}</span>
                  </div>
                ) : (
                  <span className="text-[10px] font-bold tracking-widest uppercase text-[var(--t-textMut)]">
                    Key States
                    {activePills.length > 0 && <span className="ml-1.5 text-[8px] px-1.5 py-0.5 rounded-full font-bold" style={{ background: "var(--t-accentBg)", color: "var(--t-accent)" }}>{filteredKeyStates.length}</span>}
                  </span>
                )}
                <span className="text-[9px] text-green-500 flex items-center gap-1 flex-shrink-0"><span className="w-1 h-1 rounded-full bg-green-500 pulse-dot" />live</span>
              </div>

              {filteredKeyStates.length === 0 ? (
                <div className="flex-1 flex items-center justify-center p-4">
                  <div className="text-center">
                    <div className="text-2xl mb-2">🗺️</div>
                    <div className="text-[11px] text-[var(--t-textMut)]">No states match current filters</div>
                    <button onClick={clearAll} className="mt-2 text-[10px] font-bold" style={{ color: "var(--t-accent)" }}>Clear filters</button>
                  </div>
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto px-2.5 py-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2 min-h-[160px]">
                  {filteredKeyStates.map((s, i) => (
                    <TiltCard key={s.id} intensity={5}>
                      <motion.div variants={cardReveal} initial="hidden" animate="visible" custom={i}
                        className="rounded-xl px-3 py-2.5 border cursor-pointer overflow-hidden"
                        style={{ background: `${s.color}08`, borderColor: `${s.color}22` }}
                        whileHover={{ borderColor: `${s.color}55` }}>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[11px] font-bold text-[var(--t-text)] truncate flex-1 mr-2">{s.state}</span>
                          <span className="text-[9px] font-black px-1.5 py-0.5 rounded flex-shrink-0" style={{ background: `${s.color}20`, color: s.color, border: `1px solid ${s.color}38` }}>{s.party}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 rounded-full h-1.5 overflow-hidden bg-[var(--t-bgCard)]">
                            <motion.div className="h-full rounded-full"
                              style={{ background: `linear-gradient(90deg, ${s.color}70, ${s.color})`, boxShadow: `0 0 5px ${s.color}55` }}
                              initial={{ width: 0 }} animate={{ width: `${(s.won / s.seats) * 100}%` }}
                              transition={{ duration: 1, delay: 0.3 + i * 0.1, ease: [0.23,1,0.32,1] }} />
                          </div>
                          <span className="text-[9px] text-[var(--t-textMut)] font-mono flex-shrink-0">
                            <span style={{ color: s.color }}>{s.won}</span>/{s.seats}
                          </span>
                        </div>
                        {/* Alliance badge */}
                        <div className="mt-1.5 flex items-center gap-1">
                          <span className="text-[8px] px-1.5 py-0.5 rounded-full font-bold"
                            style={{ background: s.alliance === "NDA" ? "rgba(255,107,0,0.12)" : s.alliance === "INDIA" ? "rgba(79,142,255,0.12)" : "rgba(100,116,139,0.12)",
                                     color: s.alliance === "NDA" ? "#FF822D" : s.alliance === "INDIA" ? "#4f8eff" : "#8E9CAE" }}>
                            {s.alliance}
                          </span>
                          <span className="text-[8px] text-[var(--t-textMut)]">{s.region}</span>
                        </div>
                      </motion.div>
                    </TiltCard>
                  ))}
                </div>
              )}

              {/* Live states mini bars */}
              {filteredLiveStates.length > 0 && (
                <div className="border-t border-[var(--t-border)] flex-shrink-0 px-3 py-2">
                  <div className="text-[9px] font-bold uppercase tracking-widest mb-2 text-[var(--t-textMut)]">Live States</div>
                  <div className="space-y-1.5 max-h-[150px] overflow-y-auto pr-1">
                    {filteredLiveStates.map((ls, i) => {
                      const entries = Object.entries(ls).filter(([k]) => k !== "state" && k !== "region");
                      const total = entries.reduce((a, [, v]) => a + v, 0);
                      return (
                        <div key={i} className="flex items-center gap-1.5">
                          <span className="text-[9px] text-[var(--t-textMut)] w-5 flex-shrink-0">{ls.state}</span>
                          <div className="flex-1 h-2 rounded-full overflow-hidden flex">
                            {entries.filter(([,v]) => v > 0).map(([party, v]) => (
                              <motion.div key={party} className="h-full" style={{ backgroundColor: STATE_COLORS[party] || "#8E9CAE" }}
                                initial={{ width: 0 }} animate={{ width: `${(v/total)*100}%` }}
                                transition={{ duration: 0.8, delay: i * 0.05 }} title={`${party}: ${v}`} />
                            ))}
                          </div>
                          <span className="text-[9px] text-[var(--t-textMut)] w-4 text-right flex-shrink-0">{total}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Bottom charts */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <GlassCard title="State Performance Index" action={selectedYear} className="min-h-[150px] p-1">
              <StatePerformanceChart stateData={filteredKeyStates} richData={filteredLiveStates} />
            </GlassCard>
            <GlassCard title="Seat Share Trend" action={selectedYear} className="min-h-[150px] p-1">
              <SeatShareArea
                activeParties={
                  activeFilters.party !== "All Parties"
                    ? [activeFilters.party]
                    : activeFilters.alliance !== "All Alliances"
                      ? (ALLIANCE_PARTIES[activeFilters.alliance] || [])
                      : []
                }
              />
            </GlassCard>
            <GlassCard title="Vote Share Trend" action={selectedYear} className="min-h-[150px] p-1">
              <VoteShareTrendLine
                highlightYear={selectedYear}
                highlightParty={activeFilters.party !== "All Parties" ? activeFilters.party : null}
              />
            </GlassCard>
          </div>
        </motion.div>

        {/* ── RIGHT ─────────────────────────────────────────────────────── */}
        <motion.div variants={slideRight} initial="hidden" animate="visible" className="flex flex-col gap-3 w-full lg:w-[308px] xl:w-[336px] lg:flex-shrink-0 overflow-y-auto min-h-0 pr-1 pb-1">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-3">
            <GlassCard title="National Vote Share" action={selectedYear} className="min-h-[280px] p-1">
              <VoteSharePie data={filteredPartiesData.map(p => ({ party: p.party, share: p.share }))} height={110} />
              {activeFilters.party !== "All Parties" || activeFilters.alliance !== "All Alliances" ? (
                <div className="mt-1 text-[9px] text-center text-[var(--t-textMut)]">
                  Filtered: {activeFilters.party !== "All Parties" ? activeFilters.party : activeFilters.alliance}
                </div>
              ) : null}
            </GlassCard>
            <GlassCard
              title={selectedMapState ? `${selectedMapState.name} — Constituencies` : "Constituency Analysis"}
              action={selectedMapState ? `${selectedMapState.seats || '?'} seats` : "Scatter"}
              className="min-h-[230px] p-1"
            >
              <ConstituencyScatter selectedState={selectedMapState} richState={selectedMapState ? filteredLiveStates[0] : null} selectedYear={selectedYear} />
            </GlassCard>
            <GlassCard title="Coalition Dynamics" action={selectedYear} className="min-h-[190px] p-1">
              <CoalitionDonut alliances={yearAlliances} majorityMark={summary.majorityMark} />
            </GlassCard>
          </div>

          <GlassCard title="Social Media Buzz" className="flex-1 min-h-[190px] p-2">
            <div className="space-y-2.5 overflow-y-auto h-full pr-1">
              {SOCIAL_BUZZ
                .filter(s => activeFilters.party === "All Parties" || s.party === activeFilters.party)
                .map((s, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.08, duration: 0.4 }} className="flex items-center gap-2">
                  <span className="text-[9px] font-bold w-4 flex-shrink-0" style={{ color: s.color }}>{s.platform}</span>
                  <span className="text-[10px] font-black w-7" style={{ color: s.color }}>{s.party}</span>
                  <div className="flex-1 rounded-full h-2 overflow-hidden bg-[var(--t-bgCard)]">
                    <motion.div className="h-full rounded-full"
                      style={{ background: `linear-gradient(90deg, ${s.color}70, ${s.color})`, boxShadow: `0 0 5px ${s.color}45` }}
                      initial={{ width: 0 }} animate={{ width: `${s.seats}%` }}
                      transition={{ duration: 1.1, delay: 0.5 + i * 0.1, ease: [0.23,1,0.32,1] }} />
                  </div>
                  <span className="text-green-500 text-[9px] flex-shrink-0 font-bold">{s.engagement}</span>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* ══ BOTTOM BAR ═══════════════════════════════════════════════════════ */}
      <div className="flex items-center border-t border-[var(--t-border)] px-3 py-2 gap-3 flex-shrink-0 relative z-10" style={{ background: "var(--t-sidebar)", backdropFilter: "blur(28px)" }}>
        <div className="flex-1 overflow-hidden relative min-w-0">
          <div className="flex items-center gap-1 ticker-inner" style={{ width: "max-content" }}>
            {[...yearTicker, ...yearTicker].map((p, i) => (
              <motion.div key={i} whileHover={{ scale: 1.1, y: -2 }} transition={{ duration: 0.15 }}
                onClick={() => setActiveFilters(f => ({ ...f, party: f.party === p.name ? "All Parties" : p.name }))}
                className="flex flex-col items-center justify-center w-10 h-8 rounded-lg cursor-pointer flex-shrink-0 transition-all"
                style={{
                  background: activeFilters.party === p.name ? `${p.color}28` : `${p.color}12`,
                  border: activeFilters.party === p.name ? `1px solid ${p.color}70` : `1px solid ${p.color}28`,
                }}>
                <span className="text-[9px] font-black" style={{ color: p.color }}>{p.name}</span>
                <span className="text-[7px] text-[var(--t-textMut)]">{p.seats}</span>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-3 flex-shrink-0">
          <label className="flex items-center gap-1.5 text-[10px] text-[var(--t-textSec)] cursor-pointer">
            <Radio size={10} className="text-green-500" /> Live
            <div onClick={() => setLiveUpdates(l => !l)} className={`w-7 h-3.5 rounded-full relative cursor-pointer transition-colors ${liveUpdates ? "bg-green-500" : "bg-[var(--t-bgCard)]"}`}>
              <div className={`absolute top-0.5 w-2.5 h-2.5 bg-white rounded-full transition-all ${liveUpdates ? "left-4" : "left-0.5"}`} />
            </div>
          </label>
          <button className="hidden md:flex items-center gap-1 text-[10px] text-[var(--t-textSec)] hover:text-[var(--t-text)] transition-colors"><TrendingUp size={10} /> Prediction</button>
          <button className="hidden md:flex items-center gap-1 text-[10px] text-[var(--t-textSec)] hover:text-[var(--t-text)] transition-colors"><GitCompare size={10} /> Compare</button>
          <div className="hidden lg:flex items-center gap-1 text-[10px] text-[var(--t-textMut)]"><BarChart2 size={10} /><span className="text-[var(--t-textSec)]">CSDS, NES</span></div>
          <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
            className="flex items-center gap-1.5 text-[10px] px-2.5 py-1.5 rounded-lg font-semibold"
            style={{ background: "var(--t-accentBg)", border: "1px solid var(--t-borderHi)", color: "var(--t-accent)" }}>
            <Download size={10} /> Export
          </motion.button>
          <div className="hidden lg:block text-[10px] text-[var(--t-textMut)] font-mono">© 2024 ECI | {selectedYear}</div>
        </div>
      </div>
    </div>
  );
}
