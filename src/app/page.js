"use client";

import dynamic from "next/dynamic";
import { useState, useEffect, useRef } from "react";
import {
  TrendingUp, BarChart2, Download, Radio, GitCompare, Sun, Moon, Menu, X,
} from "lucide-react";
import {
  motion, useMotionValue, useTransform, useSpring, AnimatePresence,
} from "framer-motion";
import { ELECTION_DATA_BY_YEAR, PARTY_COLORS } from "@/data/dummy";
import { useTheme } from "@/context/ThemeContext";

// ── Dynamic imports ───────────────────────────────────────────────────────────
const IndiaMap            = dynamic(() => import("@/components/charts/IndiaMap"),                 { ssr: false });
const VoteSharePie        = dynamic(() => import("@/components/charts/VoteSharePie"),             { ssr: false });
const ConstituencyScatter = dynamic(() => import("@/components/charts/ConstituencyScatter"),      { ssr: false });
const SeatShareArea       = dynamic(() => import("@/components/charts/SeatShareArea"),            { ssr: false });
const StatePerformanceChart = dynamic(() => import("@/components/charts/StatePerformanceChart"),  { ssr: false });
const VoteShareTrendLine  = dynamic(() => import("@/components/charts/VoteShareTrendLine"),       { ssr: false });
const CoalitionDonut      = dynamic(() => import("@/components/charts/CoalitionDonut"),           { ssr: false });
const CoalitionRose       = dynamic(() => import("@/components/charts/CoalitionRose"),            { ssr: false });
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

// ── Theme-aware background ────────────────────────────────────────────────────
function AuroraBg({ isDark }) {
  if (!isDark) {
    return (
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #f0f4ff 0%, #fef6ee 50%, #f0f9f4 100%)" }} />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>
    );
  }
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <div className="absolute inset-0" style={{ background: "#03040d" }} />
      <div className="aurora aurora-1" />
      <div className="aurora aurora-2" />
      <div className="aurora aurora-3" />
      <div className="absolute inset-0 bg-grid" />
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse at 50% 50%, transparent 35%, rgba(3,4,13,0.88) 100%)" }}
      />
    </div>
  );
}

// ── Live clock ────────────────────────────────────────────────────────────────
function LiveClock() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const tick = () =>
      setTime(new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <span className="font-mono text-[10px] tabular-nums" style={{ color: "var(--t-accent)" }}>
      {time}
    </span>
  );
}

// ── Animated counter ──────────────────────────────────────────────────────────
function AnimCounter({ target, duration = 1400, suffix = "", prefix = "" }) {
  const [val, setVal] = useState(0);
  const ref  = useRef(null);
  const done = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !done.current) {
        done.current = true;
        let start = null;
        const step = ts => {
          if (!start) start = ts;
          const p = Math.min((ts - start) / duration, 1);
          const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
          setVal(Math.round(eased * target));
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      }
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [target, duration]);
  return <span ref={ref}>{prefix}{val.toLocaleString("en-IN")}{suffix}</span>;
}

// ── 3D Tilt card ──────────────────────────────────────────────────────────────
function TiltCard({ children, className = "", intensity = 7 }) {
  const ref  = useRef(null);
  const mx   = useMotionValue(0);
  const my   = useMotionValue(0);
  const rotX = useTransform(my, [-80, 80], [ intensity, -intensity]);
  const rotY = useTransform(mx, [-80, 80], [-intensity,  intensity]);
  const srX  = useSpring(rotX, { stiffness: 300, damping: 30 });
  const srY  = useSpring(rotY, { stiffness: 300, damping: 30 });

  const onMove  = e => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    mx.set(e.clientX - (r.left + r.width  / 2));
    my.set(e.clientY - (r.top  + r.height / 2));
  };
  const onLeave = () => { mx.set(0); my.set(0); };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX: srX, rotateY: srY, transformStyle: "preserve-3d", perspective: 900 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ── Glassmorphic card ─────────────────────────────────────────────────────────
function GlassCard({ title, children, className = "", headerRight, action, onAction, custom = 0 }) {
  return (
    <motion.div
      variants={cardReveal}
      initial="hidden"
      animate="visible"
      custom={custom}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className={`relative overflow-hidden rounded-2xl glass-card flex flex-col ${className}`}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />
      {title && (
        <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-[var(--t-border)] flex-shrink-0">
          <span className="text-[10px] font-bold tracking-widest uppercase text-[var(--t-textMut)]">
            {title}
          </span>
          {headerRight || (action && (
            <button onClick={onAction} className="text-[10px] font-semibold hover:opacity-80" style={{ color: "var(--t-accent)" }}>
              {action}
            </button>
          ))}
        </div>
      )}
      <div className="flex-1 p-2.5 min-h-0 overflow-hidden">{children}</div>
    </motion.div>
  );
}

// ── Neon stat card ────────────────────────────────────────────────────────────
function NeonStatCard({ title, value, sub1, sub2, color = "#ff6b00", children, index = 0 }) {
  return (
    <motion.div
      variants={cardReveal}
      initial="hidden"
      animate="visible"
      custom={index}
      whileHover={{ scale: 1.02, y: -2, transition: { duration: 0.2 } }}
      className="glass-card rounded-xl p-2.5 flex flex-col gap-1 relative overflow-hidden flex-1 min-w-[110px] cursor-default"
    >
      <div
        className="absolute inset-x-0 top-0 h-0.5 rounded-t-xl"
        style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }}
      />
      <div className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider leading-tight text-[var(--t-textMut)]">
        {title}
      </div>
      <div
        className="text-base sm:text-xl font-black leading-tight"
        style={{ color, textShadow: `0 0 16px ${color}40` }}
      >
        {value}
      </div>
      {sub1 && <div className="text-[9px] truncate leading-tight text-[var(--t-textSec)]">{sub1}</div>}
      {sub2 && <div className="text-[9px] truncate leading-tight text-[var(--t-textMut)]">{sub2}</div>}
      {children}
    </motion.div>
  );
}

// ── Coalition race bar ────────────────────────────────────────────────────────
function CoalitionRaceBar({ label, seats, total, color, delay = 0 }) {
  const pct = (seats / total) * 100;
  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] font-black w-12 flex-shrink-0" style={{ color }}>{label}</span>
      <div className="flex-1 h-2.5 rounded-full overflow-hidden bg-[var(--t-bgCard)]">
        <motion.div
          className="h-full rounded-full"
          style={{
            background: `linear-gradient(90deg, ${color}bb, ${color})`,
            boxShadow: `0 0 10px ${color}55`,
          }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1.3, delay, ease: [0.23, 1, 0.32, 1] }}
        />
      </div>
      <motion.span
        className="text-[11px] font-black w-8 text-right flex-shrink-0"
        style={{ color }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay + 0.6 }}
      >
        {seats}
      </motion.span>
    </div>
  );
}

function CoalitionRaceWidget() {
  return (
    <div className="space-y-3 pt-1">
      <CoalitionRaceBar label="NDA"    seats={293} total={543} color="#ff6b00" delay={0.15} />
      <CoalitionRaceBar label="INDIA"  seats={231} total={543} color="#4f8eff" delay={0.30} />
      <CoalitionRaceBar label="Others" seats={19}  total={543} color="#94a3b8" delay={0.45} />
      <div className="pt-2 border-t border-[var(--t-border)] flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
          <span className="text-[9px] text-[var(--t-textMut)]">Majority: 272</span>
        </div>
        <span className="text-[10px] font-black" style={{ color: "#ff6b00" }}>NDA +21 ↑</span>
      </div>
    </div>
  );
}

// ── Static data ───────────────────────────────────────────────────────────────
const KEY_STATES = [
  { state: "Uttar Pradesh",  seats: 80, party: "SP",  won: 37, color: "#ef4444" },
  { state: "Maharashtra",    seats: 48, party: "BJP", won: 23, color: "#ff6b00" },
  { state: "West Bengal",    seats: 42, party: "TMC", won: 29, color: "#22c55e" },
  { state: "Madhya Pradesh", seats: 29, party: "BJP", won: 29, color: "#ff6b00" },
  { state: "Bihar",          seats: 40, party: "JDU", won: 12, color: "#8b5cf6" },
  { state: "Tamil Nadu",     seats: 39, party: "DMK", won: 22, color: "#a855f7" },
];

const LIVE_STATES = [
  { state: "UP", BJP: 33, SP: 37,  INC: 6,  Others: 4 },
  { state: "MH", BJP: 23, INC: 13, SS: 9,   Others: 3 },
  { state: "WB", TMC: 29, BJP: 12, INC: 1,  Others: 0 },
  { state: "TN", DMK: 22, INC: 9,  BJP: 0,  Others: 8 },
  { state: "BR", JDU: 12, BJP: 17, INC: 3,  Others: 8 },
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
  { name: "BJP", color: "#ff6b00", seats: 240 },
  { name: "SHS", color: "#fb923c", seats: 7   },
];

const SOCIAL_BUZZ = [
  { party: "BJP", platform: "𝕏",  engagement: "+38%", color: "#ff6b00", seats: 55 },
  { party: "INC", platform: "𝕏",  engagement: "+45%", color: "#6366f1", seats: 45 },
  { party: "BJP", platform: "FB", engagement: "+41%", color: "#ff6b00", seats: 41 },
  { party: "INC", platform: "FB", engagement: "+29%", color: "#6366f1", seats: 29 },
  { party: "TMC", platform: "IG", engagement: "+22%", color: "#22c55e", seats: 22 },
];

const STATE_COLORS = {
  BJP: "#ff6b00", INC: "#6366f1", SP: "#ef4444", TMC: "#22c55e",
  DMK: "#a855f7", JDU: "#8b5cf6", SS: "#f59e0b", Others: "#64748b",
};

// ── Page ──────────────────────────────────────────────────────────────────────
export default function Home() {
  const [selectedYear, setSelectedYear]         = useState("2024");
  const [selectedMapState, setSelectedMapState] = useState(null);
  const [liveUpdates, setLiveUpdates]           = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen]     = useState(false);
  const { themeName, toggle: toggleTheme }      = useTheme();
  const isDark = themeName === "dark";

  const yearData        = ELECTION_DATA_BY_YEAR[selectedYear] || ELECTION_DATA_BY_YEAR["2024"];
  const summary         = yearData.summary;
  const partiesData     = yearData.parties;
  const stateHighlights = yearData.stateHighlights;

  return (
    <div className="flex flex-col min-h-screen relative bg-[var(--t-bg)] text-[var(--t-text)]">
      <AuroraBg isDark={isDark} />

      {/* ══ NAVBAR ══════════════════════════════════════════════════════════ */}
      <nav
        className="sticky top-0 z-50 border-b border-[var(--t-border)]"
        style={{ background: "var(--t-header)", backdropFilter: "blur(28px)" }}
      >
        <div className="flex items-center justify-between px-4 py-2">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg overflow-hidden border border-[var(--t-border)] flex-shrink-0">
              <img src="/icons.jpg" alt="ECI" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="text-[12px] font-black text-[var(--t-text)] leading-tight tracking-wide">
                ECI{" "}
                <span style={{ color: "var(--t-accent)" }}>Analytics</span>
              </div>
              <div className="text-[9px] text-[var(--t-textMut)] hidden xs:block leading-tight">
                Lok Sabha General Elections
              </div>
            </div>
            {/* Live badge */}
            <div
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full border"
              style={{ background: "var(--t-accentBg)", borderColor: "var(--t-borderHi)" }}
            >
              <span className="w-1.5 h-1.5 rounded-full pulse-dot" style={{ background: "var(--t-accent)" }} />
              <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: "var(--t-accent)" }}>Live</span>
            </div>
          </div>

          {/* Center: year pills */}
          <div className="hidden md:flex items-center gap-0.5">
            {["2024", "2019", "2014", "2009"].map(yr => (
              <motion.button
                key={yr}
                onClick={() => setSelectedYear(yr)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all"
                style={
                  selectedYear === yr
                    ? {
                        background: "var(--t-accentBg)",
                        color: "var(--t-accent)",
                        border: "1px solid var(--t-borderHi)",
                      }
                    : {
                        color: "var(--t-textMut)",
                        border: "1px solid transparent",
                      }
                }
              >
                {yr}
              </motion.button>
            ))}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <LiveClock />
            <motion.button
              onClick={toggleTheme}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
              className="p-1.5 rounded-lg border border-[var(--t-border)] hover:border-[var(--t-borderHi)] bg-[var(--t-bgCard)] text-[var(--t-textSec)] hover:text-[var(--t-text)] transition-colors"
            >
              {isDark ? <Sun size={13} /> : <Moon size={13} />}
            </motion.button>
            <div className="hidden sm:block">
              <FiltersPanel selectedYear={selectedYear} onApply={({ year }) => setSelectedYear(year)} />
            </div>
            <button
              className="sm:hidden p-1.5 rounded-lg border border-[var(--t-border)] bg-[var(--t-bgCard)] text-[var(--t-textSec)]"
              onClick={() => setMobileMenuOpen(o => !o)}
            >
              {mobileMenuOpen ? <X size={13} /> : <Menu size={13} />}
            </button>
          </div>
        </div>

        {/* Mobile slide-down */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
              className="sm:hidden border-t border-[var(--t-border)] overflow-hidden"
            >
              <div className="px-4 py-3 flex flex-col gap-3">
                <FiltersPanel
                  selectedYear={selectedYear}
                  onApply={({ year }) => { setSelectedYear(year); setMobileMenuOpen(false); }}
                />
                <div className="flex items-center gap-3 flex-wrap text-[10px] text-[var(--t-textSec)]">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <Radio size={10} className="text-green-500" />
                    Live Updates
                    <div
                      onClick={() => setLiveUpdates(l => !l)}
                      className={`w-7 h-3.5 rounded-full relative cursor-pointer transition-colors ${liveUpdates ? "bg-green-500" : "bg-[var(--t-bgCard)]"}`}
                    >
                      <div className={`absolute top-0.5 w-2.5 h-2.5 bg-white rounded-full transition-all ${liveUpdates ? "left-4" : "left-0.5"}`} />
                    </div>
                  </label>
                  <button
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-semibold"
                    style={{ background: "var(--t-accentBg)", color: "var(--t-accent)", border: "1px solid var(--t-borderHi)" }}
                  >
                    <Download size={10} /> Export
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ══ TOP STATS BAR ════════════════════════════════════════════════════ */}
      <div
        className="border-b border-[var(--t-border)] px-3 py-2.5 flex-shrink-0 relative z-10"
        style={{ background: "var(--t-sidebar)", backdropFilter: "blur(16px)" }}
      >
        <div className="grid grid-cols-2 sm:flex sm:flex-nowrap gap-2 overflow-x-auto">

          <NeonStatCard title="Sentiment" value="" color="#14b8a6" index={0}>
            <div className="h-7"><SentimentSparkline /></div>
            <div className="flex gap-2 text-[8px] mt-0.5">
              <span style={{ color: "#14b8a6" }}>▲ +54%</span>
              <span style={{ color: "#ef4444" }}>▼ -46%</span>
            </div>
          </NeonStatCard>

          <NeonStatCard
            title="Total Seats"
            value={<AnimCounter target={summary.totalSeats} />}
            sub1={`Ph1: ${Math.floor(summary.totalSeats * 0.27)} | Ph2: ${Math.floor(summary.totalSeats * 0.32)}`}
            sub2={`Decided: ${summary.seatsDecided}`}
            color="#6366f1"
            index={1}
          />

          <NeonStatCard
            title="Voter Turnout"
            value={<><AnimCounter target={summary.turnoutPercentage} />%</>}
            sub1="M: 67.1% | F: 65.8%"
            sub2={`Voters: ${summary.totalVoters}`}
            color="#22c55e"
            index={2}
          />

          <NeonStatCard
            title="Leading Alliance"
            value={summary.leadingParty.name}
            sub1={`${summary.leadingParty.seats} seats`}
            sub2={`Maj: ${summary.majorityMark}`}
            color={summary.leadingParty.color || "#ff6b00"}
            index={3}
          >
            <div className="w-full rounded-full h-1 mt-1 overflow-hidden bg-[var(--t-bgCard)]">
              <motion.div
                className="h-1 rounded-full"
                style={{ background: "linear-gradient(90deg, #ff6b00, #ff9a3c)", boxShadow: "0 0 8px rgba(255,107,0,0.5)" }}
                initial={{ width: 0 }}
                animate={{ width: `${(summary.leadingParty.seats / summary.totalSeats) * 100}%` }}
                transition={{ duration: 1.2, delay: 0.5, ease: [0.23, 1, 0.32, 1] }}
              />
            </div>
          </NeonStatCard>

          <NeonStatCard
            title="Majority Mark"
            value={`${summary.majorityMark}`}
            sub1={`Current: ${summary.leadingParty.seats}`}
            sub2={`Margin: +${summary.leadingParty.seats - summary.majorityMark}`}
            color="#8b5cf6"
            index={4}
          >
            <div className="relative w-full h-3 mt-1">
              <svg viewBox="0 0 100 12" className="w-full h-full">
                <rect x="0" y="4" width="100" height="4" rx="2" fill="var(--t-bgCard)" />
                <rect x="0" y="4" width={`${(summary.majorityMark / summary.totalSeats) * 100}`} height="4" rx="2" fill="rgba(139,92,246,0.2)" />
                <rect x="0" y="4" width={`${(summary.leadingParty.seats / summary.totalSeats) * 100}`} height="4" rx="2" fill="#8b5cf6" />
                <line
                  x1={`${(summary.majorityMark / summary.totalSeats) * 100}`} y1="1"
                  x2={`${(summary.majorityMark / summary.totalSeats) * 100}`} y2="11"
                  stroke="#ef4444" strokeWidth="1" strokeDasharray="2"
                />
              </svg>
            </div>
          </NeonStatCard>

          {/* Coalition mini */}
          <motion.div
            variants={cardReveal}
            initial="hidden"
            animate="visible"
            custom={5}
            className="col-span-2 sm:col-span-1 glass-card rounded-xl p-2.5 flex-1 min-w-[160px] relative overflow-hidden"
          >
            <div
              className="absolute inset-x-0 top-0 h-0.5"
              style={{ background: "linear-gradient(90deg, transparent, var(--t-accent) 30%, #138808 70%, transparent)" }}
            />
            <div className="text-[10px] font-bold uppercase tracking-widest mb-1.5 text-[var(--t-textMut)]">
              Coalition Dynamics
            </div>
            <CoalitionDonut />
          </motion.div>
        </div>
      </div>

      {/* ══ MAIN BODY ════════════════════════════════════════════════════════ */}
      <div className="flex flex-col lg:flex-row gap-3 p-3 lg:flex-1 lg:min-h-0 relative z-10">

        {/* ── LEFT COLUMN ───────────────────────────────────────────────── */}
        <motion.div
          variants={slideLeft}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-3 w-full lg:w-[288px] xl:w-[308px] lg:flex-shrink-0"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-3">
            <GlassCard title="Sentiment Analysis" action="+17/95" className="min-h-[155px]">
              <SentimentGauge />
            </GlassCard>
            <GlassCard title="Coalition Race" action="543 seats" className="min-h-[155px]">
              <CoalitionRaceWidget />
            </GlassCard>
          </div>

          <GlassCard
            title="Candidate Profile"
            action="View All"
            onAction={() => {}}
            className="flex-1 min-h-[200px] xl:min-h-0"
          >
            <CandidateProfile />
          </GlassCard>

          <GlassCard
            title="Live Updates"
            headerRight={
              <span className="text-[10px] text-green-500 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 pulse-dot" />
                Live
              </span>
            }
            className="h-[130px]"
          >
            <LiveFeed />
          </GlassCard>
        </motion.div>

        {/* ── CENTER COLUMN ─────────────────────────────────────────────── */}
        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-3 w-full lg:flex-1 lg:min-w-0"
        >
          <div className="flex flex-col lg:flex-row gap-3 flex-1 min-h-0">

            {/* India Map */}
            <div className="flex-1 min-w-0 glass-card rounded-2xl flex flex-col overflow-hidden h-[360px] sm:h-[420px] lg:h-auto">
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-[var(--t-border)] flex-shrink-0">
                <span className="text-[10px] font-bold tracking-widest uppercase text-[var(--t-textMut)] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 pulse-dot" />
                  State-wise Election Results
                </span>
                <span className="text-[10px] font-mono font-bold" style={{ color: "var(--t-accent)" }}>
                  {selectedYear}
                </span>
              </div>
              <div className="flex-1 min-h-0 p-2 overflow-hidden">
                <IndiaMap
                  key={selectedYear}
                  selectedYear={selectedYear}
                  onStateClick={setSelectedMapState}
                  highlightState={selectedMapState?.id}
                  stateData={stateHighlights}
                />
              </div>
              {/* Ticker */}
              <div className="flex-shrink-0 border-t border-[var(--t-border)] py-1.5 px-3 overflow-hidden bg-[var(--t-sidebar)]">
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
            </div>

            {/* Key States panel */}
            <div className="w-full lg:w-[238px] xl:w-[252px] lg:flex-shrink-0 glass-card rounded-2xl flex flex-col overflow-hidden max-h-[400px] lg:max-h-none">
              <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-[var(--t-border)] flex-shrink-0">
                <span className="text-[10px] font-bold tracking-widest uppercase text-[var(--t-textMut)]">Key States</span>
                <span className="text-[9px] text-green-500 flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-green-500 pulse-dot" />live
                </span>
              </div>

              <div className="flex-1 overflow-y-auto px-2.5 py-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2 min-h-0">
                {KEY_STATES.map((s, i) => (
                  <TiltCard key={i} intensity={5}>
                    <motion.div
                      variants={cardReveal}
                      initial="hidden"
                      animate="visible"
                      custom={i}
                      className="rounded-xl px-3 py-2.5 border cursor-pointer overflow-hidden"
                      style={{
                        background: `${s.color}08`,
                        borderColor: `${s.color}22`,
                      }}
                      whileHover={{ borderColor: `${s.color}55` }}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[11px] font-bold text-[var(--t-text)] truncate flex-1 mr-2">{s.state}</span>
                        <span
                          className="text-[9px] font-black px-1.5 py-0.5 rounded flex-shrink-0"
                          style={{ background: `${s.color}20`, color: s.color, border: `1px solid ${s.color}38` }}
                        >
                          {s.party}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 rounded-full h-1.5 overflow-hidden bg-[var(--t-bgCard)]">
                          <motion.div
                            className="h-full rounded-full"
                            style={{
                              background: `linear-gradient(90deg, ${s.color}70, ${s.color})`,
                              boxShadow: `0 0 5px ${s.color}55`,
                            }}
                            initial={{ width: 0 }}
                            animate={{ width: `${(s.won / s.seats) * 100}%` }}
                            transition={{ duration: 1, delay: 0.3 + i * 0.1, ease: [0.23, 1, 0.32, 1] }}
                          />
                        </div>
                        <span className="text-[9px] text-[var(--t-textMut)] font-mono flex-shrink-0">
                          <span style={{ color: s.color }}>{s.won}</span>/{s.seats}
                        </span>
                      </div>
                    </motion.div>
                  </TiltCard>
                ))}
              </div>

              {/* Live states mini bars */}
              <div className="border-t border-[var(--t-border)] flex-shrink-0 px-3 py-2">
                <div className="text-[9px] font-bold uppercase tracking-widest mb-2 text-[var(--t-textMut)]">Live States</div>
                <div className="space-y-1.5">
                  {LIVE_STATES.map((ls, i) => {
                    const entries = Object.entries(ls).filter(([k]) => k !== "state");
                    const total   = entries.reduce((a, [, v]) => a + v, 0);
                    return (
                      <div key={i} className="flex items-center gap-1.5">
                        <span className="text-[9px] text-[var(--t-textMut)] w-5 flex-shrink-0">{ls.state}</span>
                        <div className="flex-1 h-2 rounded-full overflow-hidden flex">
                          {entries.filter(([, v]) => v > 0).map(([party, v]) => (
                            <motion.div
                              key={party}
                              className="h-full"
                              style={{ backgroundColor: STATE_COLORS[party] || "#64748b" }}
                              initial={{ width: 0 }}
                              animate={{ width: `${(v / total) * 100}%` }}
                              transition={{ duration: 0.8, delay: i * 0.05 }}
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
              <div className="px-3 py-2 border-t border-[var(--t-border)] flex flex-wrap gap-x-2 gap-y-0.5 flex-shrink-0">
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <GlassCard title="State Performance Index" action="+11" className="min-h-[180px]">
              <StatePerformanceChart />
            </GlassCard>
            <GlassCard title="Seat Share Trend" action="+9" className="min-h-[180px]">
              <SeatShareArea />
            </GlassCard>
            <GlassCard title="Vote Share Trend" action="+8" className="min-h-[180px]">
              <VoteShareTrendLine />
            </GlassCard>
          </div>
        </motion.div>

        {/* ── RIGHT COLUMN ──────────────────────────────────────────────── */}
        <motion.div
          variants={slideRight}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-3 w-full lg:w-[308px] xl:w-[336px] lg:flex-shrink-0"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-3">
            <GlassCard title="National Vote Share" action="2024" className="min-h-[273px]">
              <VoteSharePie
                data={partiesData.map(p => ({ party: p.party, share: p.share }))}
                height={110}
              />
            </GlassCard>
            <GlassCard title="Constituency Analysis" action="Scatter" className="min-h-[200px]">
              <ConstituencyScatter />
            </GlassCard>
          </div>

          <GlassCard title="Social Media Buzz" className="min-h-[160px]">
            <div className="space-y-2.5">
              {SOCIAL_BUZZ.map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 18 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.08, duration: 0.4 }}
                  className="flex items-center gap-2"
                >
                  <span className="text-[9px] font-bold w-4 flex-shrink-0" style={{ color: s.color }}>{s.platform}</span>
                  <span className="text-[10px] font-black w-7" style={{ color: s.color }}>{s.party}</span>
                  <div className="flex-1 rounded-full h-2 overflow-hidden bg-[var(--t-bgCard)]">
                    <motion.div
                      className="h-full rounded-full"
                      style={{
                        background: `linear-gradient(90deg, ${s.color}70, ${s.color})`,
                        boxShadow: `0 0 5px ${s.color}45`,
                      }}
                      initial={{ width: 0 }}
                      animate={{ width: `${s.seats}%` }}
                      transition={{ duration: 1.1, delay: 0.5 + i * 0.1, ease: [0.23, 1, 0.32, 1] }}
                    />
                  </div>
                  <span className="text-green-500 text-[9px] flex-shrink-0 font-bold">{s.engagement}</span>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* ══ BOTTOM BAR ═══════════════════════════════════════════════════════ */}
      <div
        className="flex items-center border-t border-[var(--t-border)] px-3 py-2 gap-3 flex-shrink-0 relative z-10"
        style={{ background: "var(--t-sidebar)", backdropFilter: "blur(28px)" }}
      >
        {/* Party ticker */}
        <div className="flex-1 overflow-hidden relative min-w-0">
          <div className="flex items-center gap-1 ticker-inner" style={{ width: "max-content" }}>
            {[...PARTIES_TICKER, ...PARTIES_TICKER].map((p, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.1, y: -2 }}
                transition={{ duration: 0.15 }}
                className="flex flex-col items-center justify-center w-10 h-8 rounded-lg cursor-pointer flex-shrink-0"
                style={{ background: `${p.color}12`, border: `1px solid ${p.color}28` }}
              >
                <span className="text-[9px] font-black" style={{ color: p.color }}>{p.name}</span>
                <span className="text-[7px] text-[var(--t-textMut)]">{p.seats}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Desktop controls */}
        <div className="hidden sm:flex items-center gap-3 flex-shrink-0">
          <label className="flex items-center gap-1.5 text-[10px] text-[var(--t-textSec)] cursor-pointer">
            <Radio size={10} className="text-green-500" />
            Live
            <div
              onClick={() => setLiveUpdates(l => !l)}
              className={`w-7 h-3.5 rounded-full relative cursor-pointer transition-colors ${liveUpdates ? "bg-green-500" : "bg-[var(--t-bgCard)]"}`}
            >
              <div className={`absolute top-0.5 w-2.5 h-2.5 bg-white rounded-full transition-all ${liveUpdates ? "left-4" : "left-0.5"}`} />
            </div>
          </label>
          <button className="hidden md:flex items-center gap-1 text-[10px] text-[var(--t-textSec)] hover:text-[var(--t-text)] transition-colors">
            <TrendingUp size={10} /> Prediction
          </button>
          <button className="hidden md:flex items-center gap-1 text-[10px] text-[var(--t-textSec)] hover:text-[var(--t-text)] transition-colors">
            <GitCompare size={10} /> Compare
          </button>
          <div className="hidden lg:flex items-center gap-1 text-[10px] text-[var(--t-textMut)]">
            <BarChart2 size={10} />
            <span className="text-[var(--t-textSec)]">CSDS, NES</span>
          </div>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-1.5 text-[10px] px-2.5 py-1.5 rounded-lg font-semibold"
            style={{
              background: "var(--t-accentBg)",
              border: "1px solid var(--t-borderHi)",
              color: "var(--t-accent)",
            }}
          >
            <Download size={10} /> Export
          </motion.button>
          <div className="hidden lg:block text-[10px] text-[var(--t-textMut)] font-mono">© 2024 ECI | {selectedYear}</div>
        </div>
      </div>
    </div>
  );
}
