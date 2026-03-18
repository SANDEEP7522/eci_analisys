'use client';

import dynamic from 'next/dynamic';
import useSWR from 'swr';
import { fetcher } from '@/src/app/lib/fetcher';
import Spinner from '@/components/ui/Spinner';

const TurnoutLineChart = dynamic(() => import('@/components/charts/TurnoutLineChart'), { ssr: false });
const StateBarChart    = dynamic(() => import('@/components/charts/StateBarChart'), { ssr: false });

const MOCK = {
  historical: [
    { year: '1999', turnout: 59.99 }, { year: '2004', turnout: 58.07 },
    { year: '2009', turnout: 58.19 }, { year: '2014', turnout: 66.40 },
    { year: '2019', turnout: 67.40 }, { year: '2024', turnout: 65.79 },
  ],
  states: [
    { state: 'Lakshadweep', turnout: 84.16, color: '#10b981' },
    { state: 'Assam',       turnout: 81.56, color: '#10b981' },
    { state: 'Tripura',     turnout: 80.93, color: '#10b981' },
    { state: 'West Bengal', turnout: 79.29, color: '#10b981' },
    { state: 'Bihar',       turnout: 56.19, color: '#ef4444' },
    { state: 'Mizoram',     turnout: 56.87, color: '#ef4444' },
    { state: 'UP',          turnout: 56.92, color: '#ef4444' },
  ].sort((a, b) => b.turnout - a.turnout),
};

function ChartCard({ title, children, className = '' }) {
  return (
    <div className={`bg-white dark:bg-[var(--t-bgCardSolid)] rounded-2xl shadow-sm border border-gray-100 dark:border-[var(--t-border)] p-4 ${className}`}>
      <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-3">{title}</h3>
      {children}
    </div>
  );
}

export default function Turnout() {
  const { data, isLoading } = useSWR('/api/turnout', fetcher);
  const d = data || MOCK;

  return (
    <div className="space-y-4 pb-6">
      <div className="border-b border-gray-200 dark:border-[var(--t-border)] pb-3">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">Voter Turnout</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Historical trends and state-wise participation</p>
      </div>

      {isLoading && !data ? <Spinner className="h-[40vh]" /> : (
        <div className="space-y-4">
          <ChartCard title="📈 Historical Voter Turnout (1999–2024)">
            <TurnoutLineChart data={d.historical} height={280} />
          </ChartCard>

          {/* Stacked on mobile, 2-col + 1-col on lg */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ChartCard title="📊 High & Low Turnout States" className="md:col-span-2">
              <StateBarChart data={d.states} dataKey="turnout" height={280} />
            </ChartCard>

            <ChartCard title="⚡ Quick Summary">
              <div className="space-y-4 h-full flex flex-col justify-center">
                <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-3">
                  <div className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1">Highest Turnout</div>
                  <div className="text-lg font-bold text-green-600 dark:text-green-400">{d.states[0]?.state}</div>
                  <div className="text-2xl font-bold text-green-700 dark:text-green-300">{d.states[0]?.turnout}%</div>
                </div>
                <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-3">
                  <div className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1">Lowest Turnout</div>
                  <div className="text-lg font-bold text-red-600 dark:text-red-400">{d.states[d.states.length - 1]?.state}</div>
                  <div className="text-2xl font-bold text-red-700 dark:text-red-300">{d.states[d.states.length - 1]?.turnout}%</div>
                </div>
              </div>
            </ChartCard>
          </div>
        </div>
      )}
    </div>
  );
}
