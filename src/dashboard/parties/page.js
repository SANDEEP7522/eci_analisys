'use client';

import dynamic from 'next/dynamic';
import useSWR from 'swr';
import { fetcher } from '@/src/app/lib/fetcher';
import Spinner from '@/components/ui/Spinner';

const SeatBarChart  = dynamic(() => import('@/components/charts/SeatBarChart'), { ssr: false });
const VoteSharePie  = dynamic(() => import('@/components/charts/VoteSharePie'), { ssr: false });

const MOCK_PARTIES = [
  { party: 'BJP',    seats: 240, share: 36.56 },
  { party: 'INC',    seats: 99,  share: 21.19 },
  { party: 'SP',     seats: 37,  share: 4.58  },
  { party: 'TMC',    seats: 29,  share: 4.37  },
  { party: 'DMK',    seats: 22,  share: 3.58  },
  { party: 'TDP',    seats: 16,  share: 2.58  },
  { party: 'JDU',    seats: 12,  share: 1.76  },
  { party: 'Others', seats: 88,  share: 25.38 },
];

function ChartCard({ title, children, className = '' }) {
  return (
    <div className={`bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 p-4 ${className}`}>
      <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-3">{title}</h3>
      {children}
    </div>
  );
}

export default function Parties() {
  const { data, isLoading } = useSWR('/api/parties', fetcher);
  const d = data || { seats: MOCK_PARTIES, voteShare: MOCK_PARTIES.map(p => ({ party: p.party, share: p.share })) };

  return (
    <div className="space-y-4 pb-6">
      <div className="border-b border-gray-200 dark:border-slate-700 pb-3">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">Party Performance</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Seat tallies and national vote share</p>
      </div>

      {isLoading && !data ? <Spinner className="h-[40vh]" /> : (
        <div className="space-y-4">
          {/* Seat bar — full width on all screens */}
          <ChartCard title="🏆 Seats Won by Party">
            <SeatBarChart data={d.seats} height={300} />
          </ChartCard>

          {/* Pie + Insights — stacked on mobile, 2-col on md */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ChartCard title="🗳️ National Vote Share">
              <VoteSharePie data={d.voteShare} height={320} />
            </ChartCard>

            <ChartCard title="📊 Top Party Stats">
              <div className="space-y-3">
                {d.voteShare.slice(0, 6).map((item) => (
                  <div key={item.party} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium text-gray-700 dark:text-gray-300">{item.party}</span>
                      <span className="text-gray-500 dark:text-gray-400">{item.share.toFixed(2)}%</span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-slate-700 rounded-full h-2">
                      <div className="h-2 rounded-full bg-blue-500" style={{ width: `${Math.min(item.share * 2.5, 100)}%` }}></div>
                    </div>
                  </div>
                ))}
                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-xs text-blue-700 dark:text-blue-300 italic">
                  Top 3 parties account for <strong>{(d.voteShare.slice(0, 3).reduce((a, c) => a + c.share, 0)).toFixed(1)}%</strong> of national vote share.
                </div>
              </div>
            </ChartCard>
          </div>
        </div>
      )}
    </div>
  );
}
