"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import {
  TrendingUp,
  BarChart2,
  Download,
  Radio,
  GitCompare,
  Sun,
  Moon,
  Menu,
  X,
} from "lucide-react";
import { motion } from "framer-motion";
import { ELECTION_DATA_BY_YEAR, PARTY_COLORS } from "@/data/dummy";
import { useTheme } from "@/context/ThemeContext";

// ── Dynamic imports (no SSR) ──────────────────────────────────────────────────
const IndiaMap           = dynamic(() => import("@/components/charts/IndiaMap"),                    { ssr: false });
const VoteSharePie       = dynamic(() => import("@/components/charts/VoteSharePie"),                { ssr: false });
const ConstituencyScatter= dynamic(() => import("@/components/charts/ConstituencyScatter"),         { ssr: false });
const SeatShareArea      = dynamic(() => import("@/components/charts/SeatShareArea"),               { ssr: false });
const StatePerformanceChart = dynamic(() => import("@/components/charts/StatePerformanceChart"),    { ssr: false });
const VoteShareTrendLine = dynamic(() => import("@/components/charts/VoteShareTrendLine"),          { ssr: false });
const CoalitionDonut     = dynamic(() => import("@/components/charts/CoalitionDonut"),              { ssr: false });
const CoalitionRose      = dynamic(() => import("@/components/charts/CoalitionRose"),               { ssr: false });
const SentimentSparkline = dynamic(() => import("@/components/charts/SentimentSparkline"),          { ssr: false });
const SentimentGauge     = dynamic(() => import("@/components/charts/SentimentGauge"),              { ssr: false });
const CandidateProfile   = dynamic(() => import("@/components/dashboard/CandidateProfile"),         { ssr: false });
const LiveFeed           = dynamic(() => import("@/components/dashboard/LiveFeed"),                 { ssr: false });
const FiltersPanel       = dynamic(() => import("@/components/dashboard/FiltersPanel"),             { ssr: false });

// ── Animation variants ────────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.06, duration: 0.35, ease: "easeOut" },
  }),
};
const fadeIn    = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.4 } } };
const slideLeft = { hidden: { opacity: 0, x: -24 }, visible: { opacity: 1, x: 0, transition: { duration: 0.4 } } };
const slideRight= { hidden: { opacity: 0, x:  24 }, visible: { opacity: 1, x: 0, transition: { duration: 0.4 } } };

// ── Card wrapper ──────────────────────────────────────────────────────────────
function DCard({ title, children, className = "", action, headerRight }) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      whileHover={{ scale: 1.005, transition: { duration: 0.15 } }}
      className={`bg-[var(--t-bgCardSolid)] border border-[var(--t-border)] rounded-lg flex flex-col ${className}`}
    >
      {title && (
        <div className="flex items-center justify-between px-2.5 py-1.5 border-b border-[var(--t-border)] flex-shrink-0">
          <span className="text-[11px] font-semibold text-[var(--t-textSec)] tracking-wide truncate mr-2">
            {title}
          </span>
          {headerRight || (action && (
            <span className="text-[10px] text-blue-400 cursor-pointer hover:text-blue-300 flex-shrink-0">
              {action}
            </span>
          ))}
        </div>
      )}
      <div className="flex-1 p-2 min-h-0 overflow-hidden">{children}</div>
    </motion.div>
  );
}

// ── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({ title, value, sub1, sub2, sub3, color = "#3b82f6", children, index = 0 }) {
  return (
    <motion.div
      variants={fadeUp}
      custom={index}
      initial="hidden"
      animate="visible"
      whileHover={{ scale: 1.03, y: -2, transition: { duration: 0.18 } }}
      className="bg-[var(--t-bgCardSolid)] border border-[var(--t-border)] rounded-lg p-2 sm:p-2.5 flex flex-col gap-0.5 sm:gap-1 hover:border-[var(--t-borderHi)] transition-colors relative overflow-hidden flex-1 min-w-[110px] sm:min-w-[140px]"
    >
      <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-lg" style={{ backgroundColor: color }} />
      <div className="text-[9px] sm:text-[10px] text-[var(--t-textSec)] font-medium leading-tight">{title}</div>
      <div className="text-base sm:text-lg font-bold" style={{ color }}>{value}</div>
      {sub1 && <div className="text-[9px] sm:text-[10px] text-[var(--t-textSec)] truncate">{sub1}</div>}
      {sub2 && <div className="text-[9px] sm:text-[10px] text-[var(--t-textMut)] truncate">{sub2}</div>}
      {sub3 && <div className="hidden sm:block text-[9px] text-[var(--t-textMut)] truncate">{sub3}</div>}
      {children}
    </motion.div>
  );
}

// ── Static data ───────────────────────────────────────────────────────────────
const KEY_STATES = [
  { state: "Uttar Pradesh", seats: 80, party: "SP",  won: 37, color: "#ef4444" },
  { state: "Maharashtra",   seats: 48, party: "BJP", won: 23, color: "#f97316" },
  { state: "West Bengal",   seats: 42, party: "TMC", won: 29, color: "#22c55e" },
  { state: "Madhya Pradesh",seats: 29, party: "BJP", won: 29, color: "#f97316" },
  { state: "Bihar",         seats: 40, party: "JDU", won: 12, color: "#6366f1" },
  { state: "Tamil Nadu",    seats: 39, party: "DMK", won: 22, color: "#7c3aed" },
];

const LIVE_STATES = [
  { state: "UP", BJP: 33, SP: 37, INC: 6,  Others: 4 },
  { state: "MH", BJP: 23, INC: 13, SS: 9,  Others: 3 },
  { state: "WB", TMC: 29, BJP: 12, INC: 1, Others: 0 },
  { state: "TN", DMK: 22, INC: 9,  BJP: 0, Others: 8 },
  { state: "BR", JDU: 12, BJP: 17, INC: 3, Others: 8 },
];

const TICKER_ITEMS = [
  "Maharashtra: INC leads in 28/48 | Tamil Nadu: DMK sweeps 34/39 | Rajasthan: BJP 14/25",
  "Live Updates: INC – 99 seats | BJP – 240 seats | SP – 37 seats",
  "Maharashtra BJP 23-13 | Tamil Nadu DMK wins 22/39 | Rajasthan BJP sweeps 14/25",
];

const PARTIES_TICKER = [
  { name: "INC", color: "#6366f1", seats: 99  },
  { name: "TDP", color: "#06b6d4", seats: 16  },
  { name: "SP",  color: "#ef4444", seats: 37  },
  { name: "NCP", color: "#f59e0b", seats: 8   },
  { name: "JDU", color: "#8b5cf6", seats: 12  },
  { name: "BSP", color: "#94a3b8", seats: 0   },
  { name: "CPI", color: "#f43f5e", seats: 4   },
  { name: "AAP", color: "#14b8a6", seats: 3   },
  { name: "TMC", color: "#22c55e", seats: 29  },
  { name: "DMK", color: "#a855f7", seats: 22  },
  { name: "BJP", color: "#f97316", seats: 240 },
  { name: "SHS", color: "#fb923c", seats: 7   },
];

const SOCIAL_BUZZ = [
  { party: "INC", platform: "𝕏",  engagement: "+45%", color: "#6366f1", seats: 45 },
  { party: "BJP", platform: "𝕏",  engagement: "+38%", color: "#f97316", seats: 55 },
  { party: "INC", platform: "FB", engagement: "+29%", color: "#14b8a6", seats: 29 },
  { party: "BJP", platform: "FB", engagement: "+41%", color: "#f97316", seats: 41 },
  { party: "TMC", platform: "IG", engagement: "+22%", color: "#22c55e", seats: 22 },
];

const STATE_COLORS = {
  BJP: "#f97316", INC: "#6366f1", SP: "#ef4444", TMC: "#22c55e",
  DMK: "#a855f7", JDU: "#8b5cf6", SS: "#f59e0b", Others: "#94a3b8",
};

// ── Page ──────────────────────────────────────────────────────────────────────
export default function Home() {
  const [selectedYear, setSelectedYear]     = useState("2024");
  const [selectedMapState, setSelectedMapState] = useState(null);
  const [liveUpdates, setLiveUpdates]       = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { themeName, toggle: toggleTheme }  = useTheme();

  const yearData     = ELECTION_DATA_BY_YEAR[selectedYear] || ELECTION_DATA_BY_YEAR["2024"];
  const summary      = yearData.summary;
  const partiesData  = yearData.parties;
  const stateHighlights = yearData.stateHighlights;

  return (
    <div className="flex flex-col min-h-screen lg:h-screen bg-[var(--t-bg)] lg:overflow-hidden text-[var(--t-text)]">

      {/* ══ NAVBAR ══════════════════════════════════════════════════════════ */}
      <nav className="sticky top-0 z-50 bg-[var(--t-sidebar)] border-b border-[var(--t-border)]">
        <div className="flex items-center justify-between px-3 py-1.5">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md overflow-hidden border border-[var(--t-border)] flex-shrink-0">
              <img src="/icons.jpg" alt="ECI Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="text-[11px] font-bold text-[var(--t-text)] leading-tight">ECI Election Analytics</div>
              <div className="text-[9px] text-[var(--t-textMut)] leading-tight hidden xs:block">General Elections Dashboard</div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              title={`Switch to ${themeName === "dark" ? "light" : "dark"} theme`}
              className="p-1.5 rounded-lg border border-[var(--t-border)] hover:border-[var(--t-accent)] bg-[var(--t-bgCardSolid)] hover:bg-[var(--t-accentBg)] text-[var(--t-textSec)] hover:text-[var(--t-accent)] transition-all"
            >
              {themeName === "dark" ? <Sun size={13} /> : <Moon size={13} />}
            </button>
            <div className="hidden sm:block">
              <FiltersPanel selectedYear={selectedYear} onApply={({ year }) => setSelectedYear(year)} />
            </div>
            {/* Mobile menu toggle */}
            <button
              className="sm:hidden p-1.5 rounded-lg border border-[var(--t-border)] bg-[var(--t-bgCardSolid)] text-[var(--t-textSec)]"
              onClick={() => setMobileMenuOpen(o => !o)}
            >
              {mobileMenuOpen ? <X size={13} /> : <Menu size={13} />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden border-t border-[var(--t-border)] px-3 py-2 flex flex-col gap-2">
            <FiltersPanel selectedYear={selectedYear} onApply={({ year }) => { setSelectedYear(year); setMobileMenuOpen(false); }} />
            <div className="flex items-center gap-3 flex-wrap text-[10px] text-[var(--t-textSec)]">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <Radio size={10} className="text-green-400" />
                Live Updates
                <div
                  onClick={() => setLiveUpdates(l => !l)}
                  className={`w-7 h-3.5 rounded-full relative cursor-pointer ${liveUpdates ? "bg-green-500" : "bg-slate-600"}`}
                >
                  <div className={`absolute top-0.5 w-2.5 h-2.5 bg-white rounded-full transition-all ${liveUpdates ? "left-4" : "left-0.5"}`} />
                </div>
              </label>
              <button className="flex items-center gap-1 hover:text-[var(--t-text)]"><TrendingUp size={10} /> Prediction</button>
              <button className="flex items-center gap-1 hover:text-[var(--t-text)]"><GitCompare size={10} /> Compare</button>
              <button className="flex items-center gap-1 bg-blue-600 hover:bg-blue-500 text-white px-2 py-1 rounded">
                <Download size={10} /> Export
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* ══ TOP STATS BAR ════════════════════════════════════════════════════ */}
      <div className="bg-[var(--t-sidebar)] border-b border-[var(--t-border)] px-2 sm:px-3 py-2 flex-shrink-0">
        {/* Mobile: 2-col grid  |  sm+: horizontal flex */}
        <div className="grid grid-cols-2 sm:flex sm:flex-nowrap gap-2 overflow-x-auto">

          {/* Sentiment sparkline card */}
          <StatCard title="Sentiment" value="" color="#14b8a6" index={0}>
            <div className="h-7 mt-0.5">
              <SentimentSparkline />
            </div>
            <div className="flex gap-2 text-[8px] sm:text-[9px] mt-0.5">
              <span style={{ color: "#14b8a6" }}>▲ +54%</span>
              <span className="text-red-400">▼ -46%</span>
            </div>
          </StatCard>

          <StatCard
            title="Total Seats"
            value={summary.totalSeats}
            sub1={`Ph1: ${Math.floor(summary.totalSeats * 0.27)} | Ph2: ${Math.floor(summary.totalSeats * 0.32)}`}
            sub2={`Decided: ${summary.seatsDecided}`}
            color="#6366f1"
            index={1}
          />

          <StatCard
            title="Voter Turnout"
            value={`${summary.turnoutPercentage}%`}
            sub1="M: 67.1% | F: 65.8%"
            sub2={`Voters: ${summary.totalVoters}`}
            sub3="Avg: 65.4%"
            color="#22c55e"
            index={2}
          />

          <StatCard
            title="Leading Alliance"
            value={summary.leadingParty.name}
            sub1={`${summary.leadingParty.seats} seats`}
            sub2={`Maj: ${summary.majorityMark}`}
            color={summary.leadingParty.color || "#f97316"}
            index={3}
          >
            <div className="w-full bg-[var(--t-bgCard)] rounded-full h-1 mt-1 overflow-hidden">
              <motion.div
                className="h-1 rounded-full bg-orange-500"
                initial={{ width: 0 }}
                animate={{ width: `${(summary.leadingParty.seats / summary.totalSeats) * 100}%` }}
                transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
              />
            </div>
          </StatCard>

          <StatCard
            title="Majority Mark"
            value={`${summary.majorityMark}`}
            sub1={`Current: ${summary.leadingParty.seats}`}
            sub2={`Margin: +${summary.leadingParty.seats - summary.majorityMark}`}
            color="#8b5cf6"
            index={4}
          >
            <div className="relative w-full h-3 mt-1">
              <svg viewBox="0 0 100 12" className="w-full h-full">
                <rect x="0" y="4" width="100" height="4" rx="2" fill="var(--t-border)" />
                <rect x="0" y="4" width={`${(summary.majorityMark / summary.totalSeats) * 100}`} height="4" rx="2" fill="#8b5cf6" fillOpacity="0.25" />
                <rect x="0" y="4" width={`${(summary.leadingParty.seats / summary.totalSeats) * 100}`} height="4" rx="2" fill="#8b5cf6" />
                <line
                  x1={`${(summary.majorityMark / summary.totalSeats) * 100}`} y1="1"
                  x2={`${(summary.majorityMark / summary.totalSeats) * 100}`} y2="11"
                  stroke="#ef4444" strokeWidth="1" strokeDasharray="2"
                />
              </svg>
            </div>
          </StatCard>

          {/* Coalition mini card */}
          <div className="col-span-2 sm:col-span-1 bg-[var(--t-bgCardSolid)] border border-[var(--t-border)] rounded-lg p-2 flex-1 min-w-[160px] hover:border-[var(--t-borderHi)] transition-colors relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-lg bg-gradient-to-r from-teal-400 via-violet-500 to-pink-500" />
            <div className="text-[9px] sm:text-[10px] text-[var(--t-textSec)] font-medium mb-1">Coalition Dynamics</div>
            <CoalitionDonut />
          </div>
        </div>
      </div>

      {/* ══ MAIN BODY ════════════════════════════════════════════════════════ */}
      <div className="flex flex-col xl:flex-row gap-2 p-2 xl:flex-1 xl:min-h-0 overflow-y-auto xl:overflow-hidden">

        {/* ── LEFT COLUMN ───────────────────────────────────────────────── */}
        <motion.div
          variants={slideLeft}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-2 w-full xl:w-[320px] xl:flex-shrink-0"
        >
          {/* Sentiment + Coalition side-by-side on mobile/tablet, stacked on xl */}
          <div className="grid grid-cols-2 xl:grid-cols-1 gap-2">
            <DCard title="Sentiment Analysis" action="+17/95" className="min-h-[155px]">
              <SentimentGauge />
            </DCard>
            <DCard title="Coalition Race" action="543 seats" className="min-h-[155px]">
              <CoalitionRose />
            </DCard>
          </div>

          {/* Candidate Profile */}
          <DCard title="Candidate Profile" action="View All" className="flex-1 min-h-[200px] xl:min-h-0">
            <CandidateProfile />
          </DCard>

          {/* Live updates */}
          <DCard
            title="Live Updates"
            headerRight={
              <span className="text-[10px] text-green-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 pulse-dot inline-block" />
                Live
              </span>
            }
            className="h-[130px]"
          >
            <LiveFeed />
          </DCard>
        </motion.div>

        {/* ── CENTER COLUMN ─────────────────────────────────────────────── */}
        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-2 w-full xl:flex-1 xl:min-w-0"
        >
          {/* Map + Key States */}
          <div className="flex flex-col lg:flex-row gap-2 flex-1 min-h-0">

            {/* India Map */}
            <div className="flex-1 min-w-0 bg-[var(--t-bgCardSolid)] border border-[var(--t-border)] rounded-lg flex flex-col overflow-hidden h-[320px] sm:h-[380px] lg:h-auto">
              <div className="flex items-center justify-between px-2.5 py-1.5 border-b border-[var(--t-border)] flex-shrink-0">
                <span className="text-[11px] font-semibold text-[var(--t-textSec)] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 pulse-dot inline-block" />
                  State-wise Election Results Map
                </span>
                <span className="text-[10px] text-blue-400">{selectedYear}</span>
              </div>
              <div className="flex-1 min-h-0 p-1.5 overflow-hidden">
                <IndiaMap
                  key={selectedYear}
                  selectedYear={selectedYear}
                  onStateClick={setSelectedMapState}
                  highlightState={selectedMapState?.id}
                  stateData={stateHighlights}
                />
              </div>
              {/* Results ticker */}
              <div className="flex-shrink-0 border-t border-[var(--t-border)] bg-[var(--t-sidebar)] py-1 px-2 overflow-hidden">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-bold text-orange-400 flex-shrink-0 uppercase">Live</span>
                  <div className="flex-1 overflow-hidden">
                    <div className="flex gap-6 ticker-inner whitespace-nowrap">
                      {[...TICKER_ITEMS, ...TICKER_ITEMS].map((t, i) => (
                        <span key={i} className="text-[9px] text-[var(--t-textSec)] flex-shrink-0">{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Key States panel */}
            <div className="w-full lg:w-[240px] xl:w-[260px] lg:flex-shrink-0 bg-[var(--t-bgCardSolid)] border border-[var(--t-border)] rounded-lg flex flex-col overflow-hidden max-h-[400px] lg:max-h-none">
              <div className="flex items-center justify-between px-2.5 py-1.5 border-b border-[var(--t-border)] flex-shrink-0">
                <span className="text-[10px] font-bold text-[var(--t-textSec)] tracking-widest uppercase">Key States</span>
                <span className="text-[9px] text-green-400 flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-green-400 pulse-dot inline-block" />live
                </span>
              </div>

              {/* State rows — 2-col grid on mobile, 1-col on lg */}
              <div className="flex-1 overflow-y-auto px-2 py-1 grid grid-cols-2 lg:grid-cols-1 gap-1.5 min-h-0">
                {KEY_STATES.map((s, i) => (
                  <motion.div
                    key={i}
                    variants={fadeUp}
                    custom={i}
                    initial="hidden"
                    animate="visible"
                    whileHover={{ scale: 1.02 }}
                    className="bg-[var(--t-bgCard)] rounded-md px-2 py-1.5 border border-[var(--t-border)] hover:border-[var(--t-borderHi)] transition-colors cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-semibold text-[var(--t-text)] truncate flex-1 mr-1">{s.state}</span>
                      <span
                        className="text-[9px] font-black px-1.5 py-0.5 rounded flex-shrink-0"
                        style={{ backgroundColor: s.color + "25", color: s.color, border: `1px solid ${s.color}55` }}
                      >{s.party}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="flex-1 bg-[var(--t-bgCard)] rounded-full h-1 overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ backgroundColor: s.color }}
                          initial={{ width: 0 }}
                          animate={{ width: `${(s.won / s.seats) * 100}%` }}
                          transition={{ duration: 0.8, delay: 0.2 + i * 0.08 }}
                        />
                      </div>
                      <span className="text-[9px] text-[var(--t-textSec)] flex-shrink-0 font-mono">
                        {s.won}<span className="text-[var(--t-textMut)]">/{s.seats}</span>
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Live states mini chart */}
              <div className="border-t border-[var(--t-border)] flex-shrink-0">
                <div className="px-2.5 py-1 text-[9px] font-bold text-[var(--t-textMut)] uppercase tracking-widest">Live States</div>
                <div className="px-2 pb-2 space-y-1">
                  {LIVE_STATES.map((ls, i) => {
                    const entries = Object.entries(ls).filter(([k]) => k !== "state");
                    const total   = entries.reduce((a, [, v]) => a + v, 0);
                    return (
                      <div key={i} className="flex items-center gap-1">
                        <span className="text-[9px] text-[var(--t-textMut)] w-5 flex-shrink-0">{ls.state}</span>
                        <div className="flex-1 h-2 rounded-full overflow-hidden flex">
                          {entries.filter(([, v]) => v > 0).map(([party, v]) => (
                            <div
                              key={party}
                              className="h-full"
                              style={{ width: `${(v / total) * 100}%`, backgroundColor: STATE_COLORS[party] || "#64748b" }}
                              title={`${party}: ${v}`}
                            />
                          ))}
                        </div>
                        <span className="text-[9px] text-[var(--t-textMut)] w-4 text-right flex-shrink-0">{total}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Legend */}
              <div className="px-2 py-1.5 border-t border-[var(--t-border)] flex flex-wrap gap-x-2 gap-y-0.5 flex-shrink-0">
                {Object.entries(PARTY_COLORS).map(([p, c]) => (
                  <div key={p} className="flex items-center gap-0.5">
                    <div className="w-1.5 h-1.5 rounded-sm" style={{ backgroundColor: c }} />
                    <span className="text-[8px] text-[var(--t-textMut)]">{p}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom charts row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <DCard title="State Performance Index" action="+11" className="min-h-[180px]">
              <StatePerformanceChart />
            </DCard>
            <DCard title="Seat Share Trend" action="+9" className="min-h-[180px]">
              <SeatShareArea />
            </DCard>
            <DCard title="Vote Share Trend" action="+8" className="min-h-[180px]">
              <VoteShareTrendLine />
            </DCard>
          </div>
        </motion.div>

        {/* ── RIGHT COLUMN ──────────────────────────────────────────────── */}
        <motion.div
          variants={slideRight}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-2 w-full xl:w-[360px] xl:flex-shrink-0"
        >
          {/* Vote share + Constituency side-by-side on mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-2">
            <DCard title="National Vote Share" action="2024" className="min-h-[273px]">
              <VoteSharePie
                data={partiesData.map((p) => ({ party: p.party, share: p.share }))}
                height={110}
              />
            </DCard>

            <DCard title="Constituency Analysis" action="Scatter" className="min-h-[200px] xl:flex-1">
              <ConstituencyScatter />
            </DCard>
          </div>

          <DCard title="Social Media Buzz" className="min-h-[160px]">
            <div className="space-y-1.5">
              {SOCIAL_BUZZ.map((s, i) => (
                <div key={i} className="flex items-center gap-1.5 text-[10px]">
                  <span className="text-[9px] font-bold w-4 flex-shrink-0" style={{ color: s.color }}>
                    {s.platform === "Twitter" ? "𝕏" : s.platform}
                  </span>
                  <span className="font-semibold w-6" style={{ color: s.color }}>{s.party}</span>
                  <div className="flex-1 bg-[var(--t-bgCard)] rounded-full h-1.5 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${s.seats}%`, backgroundColor: s.color, opacity: 0.8 }}
                    />
                  </div>
                  <span className="text-green-400 text-[9px] flex-shrink-0">{s.engagement}</span>
                </div>
              ))}
            </div>
          </DCard>
        </motion.div>
      </div>

      {/* ══ BOTTOM BAR ═══════════════════════════════════════════════════════ */}
      <div className="flex items-center bg-[var(--t-sidebar)] border-t border-[var(--t-border)] px-2 sm:px-3 py-1.5 gap-3 flex-shrink-0">
        {/* Party ticker */}
        <div className="flex-1 overflow-hidden relative min-w-0">
          <div className="flex items-center gap-1 ticker-inner" style={{ width: "max-content" }}>
            {[...PARTIES_TICKER, ...PARTIES_TICKER].map((p, i) => (
              <div
                key={i}
                className="flex flex-col items-center justify-center w-9 h-7 sm:w-10 sm:h-8 rounded cursor-pointer hover:brightness-125 transition-all flex-shrink-0"
                style={{ backgroundColor: p.color + "22", border: `1px solid ${p.color}44` }}
              >
                <span className="text-[8px] sm:text-[9px] font-black" style={{ color: p.color }}>{p.name}</span>
                <span className="text-[7px] sm:text-[8px] text-[var(--t-textMut)]">{p.seats}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop controls */}
        <div className="hidden sm:flex items-center gap-3 flex-shrink-0">
          <label className="flex items-center gap-1.5 text-[10px] text-[var(--t-textSec)] cursor-pointer">
            <Radio size={10} className="text-green-400" />
            Live
            <div
              onClick={() => setLiveUpdates(l => !l)}
              className={`w-7 h-3.5 rounded-full relative cursor-pointer ${liveUpdates ? "bg-green-500" : "bg-slate-600"}`}
            >
              <div className={`absolute top-0.5 w-2.5 h-2.5 bg-white rounded-full transition-all ${liveUpdates ? "left-4" : "left-0.5"}`} />
            </div>
          </label>
          <button className="hidden md:flex items-center gap-1 text-[10px] text-[var(--t-textSec)] hover:text-[var(--t-text)]">
            <TrendingUp size={10} /> Prediction
          </button>
          <button className="hidden md:flex items-center gap-1 text-[10px] text-[var(--t-textSec)] hover:text-[var(--t-text)]">
            <GitCompare size={10} /> Compare
          </button>
          <div className="hidden lg:flex items-center gap-1 text-[10px] text-[var(--t-textMut)]">
            <BarChart2 size={10} /> <span className="text-[var(--t-textSec)]">CSDS, NES</span>
          </div>
          <button className="flex items-center gap-1 text-[10px] bg-blue-600 hover:bg-blue-500 text-white px-2 py-1 rounded">
            <Download size={10} /> Export
          </button>
          <div className="hidden lg:block text-[10px] text-[var(--t-textMut)]">© 2024 ECI | {selectedYear}</div>
        </div>
      </div>
    </div>
  );
}
