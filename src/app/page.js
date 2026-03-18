'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import { Users, Target, Crown, Flag, TrendingUp } from 'lucide-react';
import useSWR from 'swr';
import { fetcher } from '@/app/lib/fetcher';
import {
  STATE_HIGHLIGHTS,
  PARTY_COLORS,
  ALLIANCES,
  ELECTION_YEARS,
  ELECTION_DATA_BY_YEAR,
} from '@/data/dummy';

const IndiaMap = dynamic(() => import('@/components/charts/IndiaMap'), { ssr: false });
const SeatBarChart = dynamic(() => import('@/components/charts/SeatBarChart'), { ssr: false });
const VoteSharePie = dynamic(() => import('@/components/charts/VoteSharePie'), { ssr: false });
const TurnoutLineChart = dynamic(() => import('@/components/charts/TurnoutLineChart'), { ssr: false });

function StatCard({ icon: Icon, title, value, subtitle, accent = 'blue' }) {
  const bg = { blue: 'from-blue-500 to-blue-700', orange: 'from-orange-500 to-orange-700', green: 'from-green-500 to-green-700', purple: 'from-violet-500 to-violet-700' };
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 p-4 flex items-start gap-3 hover:shadow-md transition-shadow">
      <div className={`bg-gradient-to-br ${bg[accent]} rounded-xl p-2.5 flex-shrink-0 hidden sm:flex`}>
        <Icon size={18} className="text-white" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-xs text-gray-500 dark:text-gray-400 font-medium truncate">{title}</div>
        <div className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-0.5 truncate">{value}</div>
        {subtitle && <div className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 truncate">{subtitle}</div>}
      </div>
    </div>
  );
}

function ChartCard({ title, children, className = '' }) {
  return (
    <div className={`bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 p-4 ${className}`}>
      <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-3">{title}</h3>
      {children}
    </div>
  );
}

export default function Home() {
  const [selectedMapState, setSelectedMapState] = useState(null);
  const [selectedYear, setSelectedYear] = useState('2024');
  const { data: summaryData } = useSWR(`/api/summary?year=${selectedYear}`, fetcher);

  useEffect(() => {
    setSelectedMapState(null);
  }, [selectedYear]);

  const fallbackYearData =
    ELECTION_DATA_BY_YEAR[selectedYear] || ELECTION_DATA_BY_YEAR['2024'];
  const summary = summaryData || fallbackYearData.summary;
  const partiesData = fallbackYearData.parties;
  const turnoutData = fallbackYearData.turnout;
  const alliancesData = fallbackYearData.alliances;
  const stateHighlights = fallbackYearData.stateHighlights || STATE_HIGHLIGHTS;

  return (
    <div className="space-y-4 pb-6">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-orange-500 to-blue-700 flex items-center justify-center">
              <Flag size={12} className="text-white" />
            </div>
            <span className="text-xs font-semibold text-orange-500 uppercase tracking-widest">Election Commission of India</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
            General Elections{' '}
            <span className="text-blue-600 dark:text-blue-400">
              {selectedYear}
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            National overview · Lok Sabha
          </p>
        </div>
        <div className="flex flex-col sm:items-end gap-2">
          <div className="flex items-center gap-2 text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-1.5 rounded-full font-medium w-fit">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
            {summary?.seatsDecided} / {summary?.totalSeats} Results Declared
          </div>
          <div className="flex items-center gap-1 text-xs">
            <span className="text-gray-500 dark:text-gray-400">Select year:</span>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-100 rounded-md px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {ELECTION_YEARS.map((item) => (
                <option key={item.election_no} value={item.year}>
                  {item.year}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ── KPI Cards — 2 cols on mobile, 4 on desktop ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard icon={Target} title="Total Seats"      value={summary?.totalSeats ?? '-'}              subtitle="Lok Sabha"          accent="blue" />
        <StatCard icon={Users}  title="Voter Turnout"    value={summary ? `${summary.turnoutPercentage}%` : '-'} subtitle={summary?.totalVoters ?? ''} accent="green" />
        <StatCard icon={Crown}  title="Leading Alliance" value={summary?.leadingParty?.name ?? '-'}       subtitle={summary ? `${summary.leadingParty.seats} seats` : ''} accent="orange" />
        <StatCard icon={Flag}   title="Majority Mark"    value={summary?.majorityMark ?? '-'}            subtitle="Seats needed"       accent="purple" />
      </div>

      {/* ── India Map + Vote Share (stacked on mobile, side by side on lg) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <ChartCard title="📍 State-wise Election Results Map" className="lg:col-span-2">
          {/* On mobile: map on top, state list below. On desktop: side by side */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 min-w-0">
              <IndiaMap
                key={selectedYear}
                selectedYear={selectedYear}
                onStateClick={setSelectedMapState}
                highlightState={selectedMapState?.id}
                stateData={stateHighlights}
              />
            </div>
            {/* State panel */}
            <div className="sm:w-40 flex-shrink-0">
              <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                {selectedMapState ? selectedMapState.name : 'Key States'}
              </div>
              {selectedMapState ? (
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-3 text-sm">
                  <div className="font-bold text-gray-900 dark:text-gray-100">{selectedMapState.name}</div>
                  <div className="text-gray-600 dark:text-gray-400 mt-1 text-xs">Seats: <span className="font-semibold">{selectedMapState.seats}</span></div>
                  <div className="text-gray-600 dark:text-gray-400 text-xs">Winner: <span className="font-semibold" style={{ color: selectedMapState.colorParty || PARTY_COLORS[selectedMapState.winner] }}>{selectedMapState.winner}</span></div>
                  <button onClick={() => setSelectedMapState(null)} className="mt-2 text-xs text-blue-600 dark:text-blue-400 hover:underline">← Back</button>
                </div>
              ) : (
                <div className="space-y-1.5">
                  {stateHighlights.map(s => (
                    <div key={s.state} className="flex items-center justify-between bg-gray-50 dark:bg-slate-700/50 rounded-lg px-2 py-1.5 text-xs">
                      <div className="min-w-0 mr-1">
                        <div className="font-medium text-gray-800 dark:text-gray-200 truncate">{s.state}</div>
                        <div className="text-gray-400">{s.seats} seats</div>
                      </div>
                      <span className="font-bold px-1.5 py-0.5 rounded-md text-white text-xs flex-shrink-0" style={{ backgroundColor: PARTY_COLORS[s.winner] || '#94a3b8' }}>{s.winner}</span>
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-3">
                <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">Legend</div>
                <div className="grid grid-cols-2 sm:grid-cols-1 gap-1">
                  {Object.entries(PARTY_COLORS).slice(0, 6).map(([p, c]) => (
                    <div key={p} className="flex items-center gap-1 text-xs">
                      <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: c }}></div>
                      <span className="text-gray-600 dark:text-gray-400">{p}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </ChartCard>

        <ChartCard title="🗳️ National Vote Share">
          <VoteSharePie data={partiesData.map(p => ({ party: p.party, share: p.share }))} height={320} />
        </ChartCard>
      </div>

      {/* ── Seats + Turnout (stacked on mobile) ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ChartCard title="🏆 Seats Won by Party">
          <SeatBarChart data={partiesData.map(p => ({ party: p.party, seats: p.seats }))} height={260} />
        </ChartCard>
        <ChartCard title="📈 Historical Voter Turnout (1999–2024)">
          <TurnoutLineChart data={turnoutData} height={260} />
        </ChartCard>
      </div>

      {/* ── Alliance tally (stacked on mobile, 3-col on md) ── */}
      <ChartCard title="🤝 Alliance-wise Seat Tally">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {alliancesData.map(a => (
            <div key={a.name} className="rounded-xl p-4 border border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-700/40">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-lg" style={{ backgroundColor: a.color + '22' }}>{a.logo}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-gray-900 dark:text-gray-100 truncate">{a.name}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Alliance</div>
                </div>
                <div className="font-bold text-2xl flex-shrink-0" style={{ color: a.color }}>{a.seats}</div>
              </div>
              <div className="w-full bg-gray-200 dark:bg-slate-600 rounded-full h-2 mb-1">
                <div className="h-2 rounded-full" style={{ width: `${(a.seats / 543) * 100}%`, backgroundColor: a.color }}></div>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">{((a.seats / 543) * 100).toFixed(1)}% of 543 seats</div>
              <div className="flex flex-wrap gap-1">
                {a.parties.map(p => (
                  <span key={p} className="text-xs bg-white dark:bg-slate-600 border border-gray-200 dark:border-slate-500 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded-full">{p}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 overflow-hidden">
          <div className="flex-1 bg-gray-200 dark:bg-slate-600 rounded-full h-1.5 relative min-w-0">
            <div className="h-1.5 bg-green-500 rounded-full" style={{ width: `${(293 / 543) * 100}%` }}></div>
            <div className="absolute top-[-4px] h-3.5 border-l-2 border-dashed border-red-500" style={{ left: `${(272 / 543) * 100}%` }}></div>
          </div>
          <span className="text-red-500 font-medium flex-shrink-0">Majority: 272</span>
        </div>
      </ChartCard>

    </div>
  );
}
