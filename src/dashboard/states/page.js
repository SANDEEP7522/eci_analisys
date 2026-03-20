'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import useSWR from 'swr';
import { fetcher } from '@/src/app/lib/fetcher';
import Spinner from '@/components/ui/Spinner';
import StateFilter from '@/components/filters/StateFilter';

const StateBarChart = dynamic(() => import('@/components/charts/StateBarChart'), { ssr: false });

const MOCK_STATE = {
  stateName: 'Uttar Pradesh', totalSeats: 80, turnout: 56.92,
  partyBreakdown: [
    { party: 'SP',       seats: 37, color: '#F04F5C' },
    { party: 'BJP',      seats: 33, color: '#FF822D' },
    { party: 'INC',      seats: 6,  color: '#4271FE' },
    { party: 'RLD',      seats: 2,  color: '#20BFA9' },
    { party: 'ASP(KR)',  seats: 1,  color: '#4271FE' },
    { party: 'ADAL',     seats: 1,  color: '#F5A623' },
  ],
};

function ChartCard({ title, children, className = '' }) {
  return (
    <div className={`bg-white dark:bg-[var(--t-bgCardSolid)] rounded-2xl shadow-sm border border-gray-100 dark:border-[var(--t-border)] p-4 ${className}`}>
      <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-3">{title}</h3>
      {children}
    </div>
  );
}

export default function States() {
  const [selectedState, setSelectedState] = useState('Uttar Pradesh');

  const queryParams = new URLSearchParams();
  if (selectedState) queryParams.append('state', selectedState);

  const { data, isLoading } = useSWR(`/api/states?${queryParams.toString()}`, fetcher);
  const d = data || { ...MOCK_STATE, stateName: selectedState };

  return (
    <div className="space-y-4 pb-6">
      <div className="border-b border-gray-200 dark:border-[var(--t-border)] pb-3">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">State Analysis</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Deep dive into state-level election data</p>
      </div>

      {/* Filter */}
      <div className="bg-white dark:bg-[var(--t-bgCardSolid)] p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-[var(--t-border)] flex flex-col sm:flex-row sm:items-end gap-3">
        <StateFilter value={selectedState} onChange={setSelectedState} className="w-full sm:w-auto" />
        {selectedState && (
          <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-[var(--t-bgCard)] px-3 py-2 rounded-lg border border-gray-200 dark:border-[var(--t-border)]">
            Showing: <span className="font-semibold text-gray-900 dark:text-gray-100">{selectedState}</span>
          </div>
        )}
      </div>

      {isLoading && !data ? <Spinner className="h-[40vh]" /> : !selectedState ? (
        <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-[var(--t-bgCardSolid)] rounded-2xl border border-dashed border-gray-300 dark:border-[var(--t-border)] text-center">
          <div className="text-4xl mb-3">🗺️</div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-1">Select a State</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">Choose a state or Union Territory from the dropdown above to view its election analytics.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* KPI cards — 2-col on all screens except xs */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white dark:bg-[var(--t-bgCardSolid)] rounded-2xl shadow-sm border border-gray-100 dark:border-[var(--t-border)] p-4">
              <div className="text-xs text-gray-500 dark:text-gray-400">Total Seats</div>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">{d.totalSeats}</div>
              <div className="text-xs text-gray-400">{selectedState}</div>
            </div>
            <div className="bg-white dark:bg-[var(--t-bgCardSolid)] rounded-2xl shadow-sm border border-gray-100 dark:border-[var(--t-border)] p-4">
              <div className="text-xs text-gray-500 dark:text-gray-400">Voter Turnout</div>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">{d.turnout}%</div>
              <div className="text-xs text-gray-400">Eligible voters</div>
            </div>
          </div>

          {/* Party breakdown chart */}
          <ChartCard title={`🏆 Seat Distribution — ${selectedState}`}>
            <StateBarChart data={d.partyBreakdown} nameKey="party" dataKey="seats" height={300} />
          </ChartCard>

          {/* Party breakdown list */}
          <ChartCard title="📋 Party-wise Results">
            <div className="space-y-2">
              {d.partyBreakdown.map(p => (
                <div key={p.party} className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: p.color }}></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between text-xs mb-0.5">
                      <span className="font-medium text-gray-800 dark:text-gray-200">{p.party}</span>
                      <span className="text-gray-500 dark:text-gray-400">{p.seats} seats ({((p.seats / d.totalSeats) * 100).toFixed(0)}%)</span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-[var(--t-bgCard)] rounded-full h-1.5">
                      <div className="h-1.5 rounded-full" style={{ width: `${(p.seats / d.totalSeats) * 100}%`, backgroundColor: p.color }}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>
      )}
    </div>
  );
}
