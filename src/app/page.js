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
} from "lucide-react";
import { ELECTION_DATA_BY_YEAR, PARTY_COLORS } from "@/data/dummy";
import { useTheme } from "@/context/ThemeContext";

// Dynamic imports (no SSR)
const IndiaMap = dynamic(() => import("@/components/charts/IndiaMap"), {
  ssr: false,
});
const VoteSharePie = dynamic(() => import("@/components/charts/VoteSharePie"), {
  ssr: false,
});
const ConstituencyScatter = dynamic(
  () => import("@/components/charts/ConstituencyScatter"),
  { ssr: false },
);
const SeatShareArea = dynamic(
  () => import("@/components/charts/SeatShareArea"),
  { ssr: false },
);
const StatePerformanceChart = dynamic(
  () => import("@/components/charts/StatePerformanceChart"),
  { ssr: false },
);
const VoteShareTrendLine = dynamic(
  () => import("@/components/charts/VoteShareTrendLine"),
  { ssr: false },
);
const CoalitionDonut = dynamic(
  () => import("@/components/charts/CoalitionDonut"),
  { ssr: false },
);
const SentimentSparkline = dynamic(
  () => import("@/components/charts/SentimentSparkline"),
  { ssr: false },
);
const SentimentCloud = dynamic(
  () => import("@/components/dashboard/SentimentCloud"),
  { ssr: false },
);
const CandidateProfile = dynamic(
  () => import("@/components/dashboard/CandidateProfile"),
  { ssr: false },
);
const LiveFeed = dynamic(() => import("@/components/dashboard/LiveFeed"), {
  ssr: false,
});
const FiltersPanel = dynamic(
  () => import("@/components/dashboard/FiltersPanel"),
  { ssr: false },
);

// ── Card wrapper ─────────────────────────────────────────────────────────────
function DCard({ title, children, className = "", action, headerRight }) {
  return (
    <div
      className={`bg-[var(--t-bgCardSolid)] border border-[var(--t-border)] rounded-lg flex flex-col ${className}`}
    >
      {title && (
        <div className="flex items-center justify-between px-2.5 py-1.5 border-b border-[var(--t-border)]">
          <span className="text-[11px] font-semibold text-[var(--t-textSec)] tracking-wide">
            {title}
          </span>
          {headerRight ||
            (action && (
              <span className="text-[10px] text-blue-400 cursor-pointer hover:text-blue-300">
                {action}
              </span>
            ))}
        </div>
      )}
      <div className="flex-1 p-2 min-h-0">{children}</div>
    </div>
  );
}

// ── Top stat card ─────────────────────────────────────────────────────────────
function StatCard({
  title,
  value,
  sub1,
  sub2,
  sub3,
  color = "#3b82f6",
  accent,
  children,
}) {
  return (
    <div className="bg-[var(--t-bgCardSolid)] border border-[var(--t-border)] rounded-lg p-2.5 flex flex-col gap-1 hover:border-[var(--t-borderHi)] transition-colors relative overflow-hidden flex-1 min-w-0">
      <div
        className="absolute top-0 left-0 right-0 h-0.5 rounded-t-lg"
        style={{ backgroundColor: color }}
      />
      <div className="text-[10px] text-[var(--t-textSec)] font-medium">
        {title}
      </div>
      <div className="text-lg font-bold" style={{ color }}>
        {value}
      </div>
      {sub1 && (
        <div className="text-[10px] text-[var(--t-textSec)]">{sub1}</div>
      )}
      {sub2 && (
        <div className="text-[10px] text-[var(--t-textMut)]">{sub2}</div>
      )}
      {sub3 && (
        <div className="text-[10px] text-[var(--t-textMut)]">{sub3}</div>
      )}
      {children}
    </div>
  );
}

// ── Key states data ───────────────────────────────────────────────────────────
const KEY_STATES = [
  { state: "Uttar Pradesh", seats: 80, party: "SP", won: 37, color: "#ef4444" },
  { state: "Maharashtra", seats: 48, party: "BJP", won: 23, color: "#f97316" },
  { state: "West Bengal", seats: 42, party: "TMC", won: 29, color: "#22c55e" },
  {
    state: "Madhya Pradesh",
    seats: 29,
    party: "BJP",
    won: 29,
    color: "#f97316",
  },
  { state: "Bihar", seats: 40, party: "JDU", won: 12, color: "#6366f1" },
  { state: "Tamil Nadu", seats: 39, party: "DMK", won: 22, color: "#7c3aed" },
];
// ── LIVE states (mini bar for bottom of key-states panel) ────────────────────
const LIVE_STATES = [
  { state: "UP", BJP: 33, SP: 37, INC: 6, Others: 4 },
  { state: "MH", BJP: 23, INC: 13, SS: 9, Others: 3 },
  { state: "WB", TMC: 29, BJP: 12, INC: 1, Others: 0 },
  { state: "TN", DMK: 22, INC: 9, BJP: 0, Others: 8 },
  { state: "BR", JDU: 12, BJP: 17, INC: 3, Others: 8 },
];
// ── Results ticker ────────────────────────────────────────────────────────────
const TICKER_ITEMS = [
  "Maharashtra: INC leads in 28/48 | Tamil Nadu: 1 | DMK sweeps 34/39 | Rajasthan: BJP 14/25",
  "Live Updates: INC – leads in 99 seats | BJP – leads in 240 seats | SP – leads in 37 seats",
  "Maharashtra BJP beat INC 23-13 | Tamil Nadu DMK wins 22/39 | Rajasthan BJP sweeps 14/25 | Selectors : BJP wins",
];

// ── Party ticker data ─────────────────────────────────────────────────────────
const PARTIES_TICKER = [
  { name: "INC", color: "#1e3a8a", seats: 99 },
  { name: "TDP", color: "#06b6d4", seats: 16 },
  { name: "SP", color: "#ef4444", seats: 37 },
  { name: "NCP", color: "#f59e0b", seats: 8 },
  { name: "JDU", color: "#6366f1", seats: 12 },
  { name: "BSP", color: "#64748b", seats: 0 },
  { name: "CPI", color: "#dc2626", seats: 4 },
  { name: "BJD", color: "#22c55e", seats: 0 },
  { name: "AAP", color: "#06b6d4", seats: 3 },
  { name: "TMC", color: "#22c55e", seats: 29 },
  { name: "DMK", color: "#7c3aed", seats: 22 },
  { name: "SAD", color: "#f59e0b", seats: 2 },
  { name: "BJP", color: "#f97316", seats: 240 },
  { name: "SHS", color: "#f97316", seats: 7 },
];

// ── Social media data ─────────────────────────────────────────────────────────
const SOCIAL_BUZZ = [
  {
    party: "INC",
    platform: "Twitter",
    engagement: "+45%",
    color: "#3b82f6",
    seats: 35,
  },
  {
    party: "BJP",
    platform: "Twitter",
    engagement: "+38%",
    color: "#f97316",
    seats: 55,
  },
  {
    party: "INC",
    platform: "FB",
    engagement: "+29%",
    color: "#6366f1",
    seats: 12,
  },
  {
    party: "BJP",
    platform: "FB",
    engagement: "+41%",
    color: "#f97316",
    seats: 30,
  },
  {
    party: "TMC",
    platform: "IG",
    engagement: "+22%",
    color: "#22c55e",
    seats: 18,
  },
];

export default function Home() {
  const [selectedYear, setSelectedYear] = useState("2024");
  const [selectedMapState, setSelectedMapState] = useState(null);
  const [liveUpdates, setLiveUpdates] = useState(true);
  const { themeName, toggle: toggleTheme } = useTheme();

  const yearData =
    ELECTION_DATA_BY_YEAR[selectedYear] || ELECTION_DATA_BY_YEAR["2024"];
  const summary = yearData.summary;
  const partiesData = yearData.parties;
  const stateHighlights = yearData.stateHighlights;

  return (
    <div className="flex flex-col h-screen bg-[var(--t-bg)] overflow-hidden text-[var(--t-text)]">
      <nav className="sticky top-0 z-50 bg-[var(--t-sidebar)] border-b border-[var(--t-border)]">
        <div className="flex items-center justify-between px-3 py-1.5">
          {/* LEFT — Brand */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-orange-500 to-blue-600 flex items-center justify-center">
              <div className="w-6 h-6 rounded-md overflow-hidden border border-[var(--t-border)]">
                {/* <video
                  src="/icon.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                /> */}
                <img
                  src="/icons.jpg"
                  alt="ECI Logo"
                  className="w-full h-full object-cover"
                />
              </div>{" "}
            </div>

            <div>
              <div className="text-[11px] font-bold text-white leading-tight">
                ECI Election Analytics
              </div>
              <div className="text-[9px] text-[var(--t-textMut)] leading-tight">
                General Elections Dashboard
              </div>
            </div>
          </div>

          {/* RIGHT — Controls */}
          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              title={`Switch to ${themeName === "dark" ? "light" : "dark"} theme`}
              className="p-1.5 rounded-lg border border-[var(--t-border)] hover:border-[var(--t-accent)] bg-[var(--t-bgCardSolid)] hover:bg-[var(--t-accentBg)] text-[var(--t-textSec)] hover:text-[var(--t-accent)] transition-all"
            >
              {themeName === "dark" ? <Sun size={13} /> : <Moon size={13} />}
            </button>

            <FiltersPanel
              selectedYear={selectedYear}
              onApply={({ year }) => setSelectedYear(year)}
            />
          </div>
        </div>
      </nav>
      {/* ══ TOP HEADER BAR ══════════════════════════════════════════════════ */}
      <div className="flex items-center gap-2 px-3 py-1.5 bg-[var(--t-sidebar)] border-b border-[var(--t-border)] flex-shrink-0">
        {/* Stats row */}
        <div className="flex items-stretch gap-2 flex-1 min-w-0 h-21">
          {/* Sentiment Card */}
          <StatCard
            title="Real-time Sentiment Analysis"
            value=""
            color="#22c55e"
          >
            <div className="h-8 mt-1">
              <SentimentSparkline />
            </div>
            <div className="flex gap-2 text-[9px] mt-1">
              <span className="text-green-400">▲ Positive 54%</span>
              <span className="text-red-400">▼ Negative 46%</span>
            </div>
          </StatCard>

          <StatCard
            title="Total Seats"
            value={summary.totalSeats}
            sub1={`Phase 1: ${Math.floor(summary.totalSeats * 0.27)} | Phase 2: ${Math.floor(summary.totalSeats * 0.32)}`}
            sub2={`Decided: ${summary.seatsDecided}`}
            color="#3b82f6"
          />

          <StatCard
            title="Voter Turnout"
            value={`${summary.turnoutPercentage}%`}
            sub1={`Male: 67.1% | Female: 65.8%`}
            sub2={`Voters: ${summary.totalVoters}`}
            sub3="National Avg: 65.4%"
            color="#22c55e"
          />

          <StatCard
            title="Leading Alliance"
            value={summary.leadingParty.name}
            sub1={`${summary.leadingParty.seats} seats`}
            sub2={`Majority mark: ${summary.majorityMark}`}
            color={summary.leadingParty.color || "#f97316"}
          >
            <div className="w-full bg-[var(--t-bgCard)] rounded-full h-1 mt-1">
              <div
                className="h-1 rounded-full bg-orange-500"
                style={{
                  width: `${(summary.leadingParty.seats / summary.totalSeats) * 100}%`,
                }}
              />
            </div>
          </StatCard>

          <StatCard
            title="Majority by Mark"
            value={`${summary.majorityMark} seats`}
            sub1={`Current Majority: ${summary.leadingParty.seats}`}
            sub2={`Margin: +${summary.leadingParty.seats - summary.majorityMark}`}
            color="#a78bfa"
          >
            <div className="relative w-full h-3 mt-1">
              <svg viewBox="0 0 100 12" className="w-full h-full">
                <rect
                  x="0"
                  y="4"
                  width="100"
                  height="4"
                  rx="2"
                  fill="#1e293b"
                />
                <rect
                  x="0"
                  y="4"
                  width={`${(summary.majorityMark / summary.totalSeats) * 100}`}
                  height="4"
                  rx="2"
                  fill="#a78bfa"
                  fillOpacity="0.3"
                />
                <rect
                  x="0"
                  y="4"
                  width={`${(summary.leadingParty.seats / summary.totalSeats) * 100}`}
                  height="4"
                  rx="2"
                  fill="#a78bfa"
                />
                <line
                  x1={`${(summary.majorityMark / summary.totalSeats) * 100}`}
                  y1="1"
                  x2={`${(summary.majorityMark / summary.totalSeats) * 100}`}
                  y2="11"
                  stroke="#ef4444"
                  strokeWidth="1"
                  strokeDasharray="2"
                />
              </svg>
            </div>
          </StatCard>

          {/* Coalition card */}
          <div className="bg-[var(--t-bgCardSolid)] border border-[var(--t-border)] rounded-lg p-2 flex-1 min-w-0 hover:border-[var(--t-borderHi)] transition-colors relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-lg bg-gradient-to-r from-orange-500 via-blue-500 to-slate-500" />
            <div className="text-[10px] text-[var(--t-textSec)] font-medium mb-1">
              Nine Card · Coalition Dynamics
            </div>
            <CoalitionDonut />
          </div>
        </div>
      </div>

      {/* ══ MAIN 3-COLUMN BODY ══════════════════════════════════════════════ */}
      <div className="flex flex-1 gap-2 p-2 min-h-0">
        {/* ── LEFT COLUMN ─────────────────────────────────────────────────── */}
        <div className="flex flex-col gap-2 w-[335px] flex-shrink-0">
          {/* Sentiment word cloud */}
          <DCard
            title="Real-time Sentiment Analysis"
            action="+17/95"
            className="h-[140px]"
          >
            <SentimentCloud />
          </DCard>

          {/* Coalition donut race */}
          <DCard
            title="Coalition Race · Doller"
            action="7 1954"
            className="h-[155px]"
          >
            <CoalitionDonut />
          </DCard>

          {/* Candidate Profile */}
          <DCard title="Candidate Profile" action="7 1/4/1" className="flex-1">
            <CandidateProfile />
          </DCard>

          {/* Live updates */}
          <DCard
            title="Live Updates"
            headerRight={
              <span className="text-[10px] text-green-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 pulse-dot inline-block" />
                11 22
              </span>
            }
            className="h-[130px]"
          >
            <LiveFeed />
          </DCard>
        </div>

        {/* ── CENTER COLUMN ────────────────────────────────────────────────── */}
        <div className="flex flex-col gap-2 flex-1 min-w-0">
          {/* Map + Key states */}
          {/* Map card + Key States side-by-side */}
          <div className="flex gap-2 flex-1 min-h-0">
            {/* ── India Map card ───────────────────────────────── */}
            <div className="w-[550px] min-w-0 bg-[var(--t-bgCardSolid)] border border-[var(--t-border)] rounded-lg flex flex-col overflow-hidden">
              {/* Card header */}
              <div className="flex items-center justify-between px-2.5 py-1.5 border-b border-[var(--t-border)] flex-shrink-0">
                <span className="text-[11px] font-semibold text-[var(--t-textSec)] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 pulse-dot inline-block" />
                  State-wise Election Results Map
                </span>
                <span className="text-[10px] text-blue-400">
                  {selectedYear}
                </span>
              </div>

              {/* Map fills card */}
              <div className="flex-1 min-h-0 p-1.5 overflow-hidden">
                <IndiaMap
                  key={selectedYear}
                  selectedYear={selectedYear}
                  onStateClick={setSelectedMapState}
                  highlightState={selectedMapState?.id}
                  stateData={stateHighlights}
                />
              </div>

              {/* Results ticker at bottom */}
              <div className="flex-shrink-0 border-t border-[var(--t-border)] overflow-hidden bg-[var(--t-sidebar)] py-1 px-2">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-bold text-orange-400 flex-shrink-0 uppercase tracking-wider">
                    Live
                  </span>
                  <div className="flex-1 overflow-hidden">
                    <div className="flex gap-6 ticker-inner whitespace-nowrap">
                      {[...TICKER_ITEMS, ...TICKER_ITEMS].map((t, i) => (
                        <span
                          key={i}
                          className="text-[9px] text-[var(--t-textSec)] flex-shrink-0"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Key States panel ─────────────────────────────── */}
            <div className="w-[270px] flex-shrink-0 bg-[var(--t-bgCardSolid)] border border-[var(--t-border)] rounded-lg flex flex-col overflow-hidden">
              {/* KEY STATES header */}
              <div className="flex items-center justify-between px-2.5 py-1.5 border-b border-[var(--t-border)] flex-shrink-0">
                <span className="text-[10px] font-bold text-[var(--t-textSec)] tracking-widest uppercase">
                  Key States
                </span>
                <span className="text-[9px] text-green-400 flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-green-400 pulse-dot inline-block" />
                  live
                </span>
              </div>

              {/* State rows */}
              <div className="flex-1 overflow-y-auto px-2 py-1 space-y-1.5 min-h-0">
                {KEY_STATES.map((s, i) => (
                  <div
                    key={i}
                    className="bg-[var(--t-bgCard)] rounded-md px-2 py-1.5 border border-[var(--t-border)] hover:border-[var(--t-borderHi)] transition-colors cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-semibold text-[var(--t-text)] truncate flex-1 mr-1">
                        {s.state}
                      </span>
                      <span
                        className="text-[9px] font-black px-1.5 py-0.5 rounded flex-shrink-0"
                        style={{
                          backgroundColor: s.color + "25",
                          color: s.color,
                          border: `1px solid ${s.color}55`,
                        }}
                      >
                        {s.party}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="flex-1 bg-[var(--t-bgCard)] rounded-full h-1">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${(s.won / s.seats) * 100}%`,
                            backgroundColor: s.color,
                          }}
                        />
                      </div>
                      <span className="text-[9px] text-[var(--t-textSec)] flex-shrink-0 font-mono">
                        {s.won}
                        <span className="text-[var(--t-textMut)]">
                          /{s.seats}
                        </span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* LIVE STATES mini chart */}
              <div className="border-t border-[var(--t-border)] flex-shrink-0">
                <div className="px-2.5 py-1 text-[9px] font-bold text-[var(--t-textMut)] uppercase tracking-widest">
                  Live States
                </div>
                <div className="px-2 pb-2 space-y-1">
                  {LIVE_STATES.map((ls, i) => {
                    const entries = Object.entries(ls).filter(
                      ([k]) => k !== "state",
                    );
                    const total = entries.reduce((a, [, v]) => a + v, 0);
                    const stateColors = {
                      BJP: "#f97316",
                      INC: "#3b82f6",
                      SP: "#ef4444",
                      TMC: "#22c55e",
                      DMK: "#7c3aed",
                      JDU: "#6366f1",
                      SS: "#f59e0b",
                      Others: "#64748b",
                    };
                    return (
                      <div key={i} className="flex items-center gap-1">
                        <span className="text-[9px] text-[var(--t-textMut)] w-5 flex-shrink-0">
                          {ls.state}
                        </span>
                        <div className="flex-1 h-2 rounded-full overflow-hidden flex">
                          {entries
                            .filter(([, v]) => v > 0)
                            .map(([party, v]) => (
                              <div
                                key={party}
                                className="h-full"
                                style={{
                                  width: `${(v / total) * 100}%`,
                                  backgroundColor:
                                    stateColors[party] || "#64748b",
                                }}
                                title={`${party}: ${v}`}
                              />
                            ))}
                        </div>
                        <span className="text-[9px] text-[var(--t-textMut)] w-4 text-right flex-shrink-0">
                          {total}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Legend */}
              <div className="px-2 py-1.5 border-t border-[var(--t-border)] flex flex-wrap gap-x-2 gap-y-0.5 flex-shrink-0">
                {Object.entries(PARTY_COLORS).map(([p, c]) => (
                  <div key={p} className="flex items-center gap-0.5">
                    <div
                      className="w-1.5 h-1.5 rounded-sm"
                      style={{ backgroundColor: c }}
                    />
                    <span className="text-[8px] text-[var(--t-textMut)]">
                      {p}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom charts row */}
          <div className="flex gap-2" style={{ height: "38%" }}>
            {/* State Performance Index */}
            <DCard
              title="State Performance Index"
              action="+11 3/3"
              className="flex-1"
            >
              <StatePerformanceChart />
            </DCard>

            {/* Seat Share Trend */}
            <DCard title="Seat Share Trend" action="+ 9 3/3" className="flex-1">
              <SeatShareArea />
            </DCard>

            {/* Vote Share Trend */}
            <DCard title="Vote Share Trend" action="+ 8 3/3" className="flex-1">
              <VoteShareTrendLine />
            </DCard>
          </div>
        </div>

        {/* ── RIGHT COLUMN ─────────────────────────────────────────────────── */}
        <div className="flex flex-col gap-2 w-[400px] flex-shrink-0">
          <DCard
            title="National Vote Share"
            action="+1 3/3"
            className="h-[165px]"
          >
            <VoteSharePie
              data={partiesData.map((p) => ({
                party: p.party,
                share: p.share,
              }))}
              height={115}
            />
          </DCard>

          <DCard
            title="Constituency Analysis"
            action="+1 3/3"
            className="flex-1"
          >
            <ConstituencyScatter />
          </DCard>

          <DCard title="Social Media Buzz" className="h-[200px]">
            <div className="space-y-1">
              {SOCIAL_BUZZ.map((s, i) => (
                <div key={i} className="flex items-center gap-1.5 text-[10px]">
                  <span
                    className="text-[9px] font-bold w-4"
                    style={{ color: s.color }}
                  >
                    {s.platform === "Twitter" ? "𝕏" : s.platform}
                  </span>
                  <span
                    className="font-semibold w-6"
                    style={{ color: s.color }}
                  >
                    {s.party}
                  </span>
                  <span className="text-green-400">
                    {s.engagement} engagement
                  </span>
                  <span className="text-[var(--t-textMut)] ml-auto">
                    {s.seats}%
                  </span>
                </div>
              ))}
            </div>
          </DCard>
        </div>
      </div>

      {/* ══ BOTTOM BAR ══════════════════════════════════════════════════════ */}
      <div className="flex items-center bg-[var(--t-sidebar)] border-t border-[var(--t-border)] px-3 py-1.5 gap-3 flex-shrink-0">
        {/* Party ticker */}
        <div className="flex-1 overflow-hidden relative min-w-0">
          <div
            className="flex items-center gap-1 ticker-inner"
            style={{ width: "max-content" }}
          >
            {[...PARTIES_TICKER, ...PARTIES_TICKER].map((p, i) => (
              <div
                key={i}
                className="flex flex-col items-center justify-center w-10 h-8 rounded cursor-pointer hover:brightness-125 transition-all flex-shrink-0"
                style={{
                  backgroundColor: p.color + "22",
                  border: `1px solid ${p.color}44`,
                }}
              >
                <span
                  className="text-[9px] font-black"
                  style={{ color: p.color }}
                >
                  {p.name}
                </span>
                <span className="text-[8px] text-[var(--t-textMut)]">
                  {p.seats}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <label className="flex items-center gap-1.5 text-[10px] text-[var(--t-textSec)] cursor-pointer">
            <Radio size={10} className="text-green-400" />
            Live Updates
            <div
              onClick={() => setLiveUpdates((l) => !l)}
              className={`w-7 h-3.5 rounded-full relative transition-colors cursor-pointer ${liveUpdates ? "bg-green-500" : "bg-slate-600"}`}
            >
              <div
                className={`absolute top-0.5 w-2.5 h-2.5 bg-white rounded-full transition-all ${liveUpdates ? "left-4" : "left-0.5"}`}
              />
            </div>
          </label>
          <button className="flex items-center gap-1 text-[10px] text-[var(--t-textSec)] hover:text-[var(--t-text)] transition-colors">
            <TrendingUp size={10} /> Prediction
          </button>
          <button className="flex items-center gap-1 text-[10px] text-[var(--t-textSec)] hover:text-[var(--t-text)] transition-colors">
            <GitCompare size={10} /> Comparisons
          </button>
          <div className="flex items-center gap-1 text-[10px] text-[var(--t-textMut)]">
            <BarChart2 size={10} /> Data Source:
            <span className="text-[var(--t-textSec)]">CSDS, NES</span>
          </div>
          <button className="flex items-center gap-1 text-[10px] bg-blue-600 hover:bg-blue-500 text-white px-2 py-1 rounded transition-colors">
            <Download size={10} /> Export Report
          </button>
          <div className="text-[10px] text-[var(--t-textMut)]">
            © 2024 ECI Dashboard | {selectedYear}
          </div>
        </div>
      </div>
    </div>
  );
}
