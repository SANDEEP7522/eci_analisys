'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { fetcher } from '@/src/app/lib/fetcher';
import Spinner from '@/components/ui/Spinner';
import FilterBar from '@/components/filters/FilterBar';
import YearFilter from '@/components/filters/YearFilter';
import StateFilter from '@/components/filters/StateFilter';
import PartyFilter from '@/components/filters/PartyFilter';
import ResultsTable from '@/components/tables/ResultsTable';

const DEMO_DATA = [
  { constituency: 'Varanasi',       state: 'Uttar Pradesh', candidate: 'Narendra Modi',      party: 'BJP',  margin: 152513 },
  { constituency: 'Raebareli',      state: 'Uttar Pradesh', candidate: 'Rahul Gandhi',        party: 'INC',  margin: 390030 },
  { constituency: 'Gandhinagar',    state: 'Gujarat',       candidate: 'Amit Shah',           party: 'BJP',  margin: 744716 },
  { constituency: 'Wayanad',        state: 'Kerala',        candidate: 'Rahul Gandhi',        party: 'INC',  margin: 364422 },
  { constituency: 'New Delhi',      state: 'Delhi',         candidate: 'Bansuri Swaraj',      party: 'BJP',  margin: 78370  },
  { constituency: 'Diamond Harbour',state: 'West Bengal',   candidate: 'Abhishek Banerjee',   party: 'TMC',  margin: 710930 },
  { constituency: 'Hyderabad',      state: 'Telangana',     candidate: 'Asaduddin Owaisi',   party: 'AIMIM',margin: 338087 },
  { constituency: 'Thiruvananthapuram', state: 'Kerala',   candidate: 'Shashi Tharoor',      party: 'INC',  margin: 16077  },
  { constituency: 'Sultanpur',      state: 'Uttar Pradesh', candidate: 'Maneka Gandhi',       party: 'BJP',  margin: 43151  },
  { constituency: 'Amethi',         state: 'Uttar Pradesh', candidate: 'KL Sharma',           party: 'INC',  margin: 167196 },
  { constituency: 'Kolkata North',  state: 'West Bengal',   candidate: 'Sudip Bandyopadhyay', party: 'TMC',  margin: 146611 },
  { constituency: 'Azamgarh',       state: 'Uttar Pradesh', candidate: 'Dharmendra Yadav',    party: 'SP',   margin: 148978 },
];

export default function Results() {
  const [year, setYear] = useState('2024');
  const [state, setState] = useState('');
  const [party, setParty] = useState('');
  const [search, setSearch] = useState('');

  const queryParams = new URLSearchParams();
  if (year) queryParams.append('year', year);
  if (state) queryParams.append('state', state);
  if (party) queryParams.append('party', party);

  const { data, error, isLoading } = useSWR(`/api/results?${queryParams.toString()}`, fetcher);

  const handleReset = () => { setYear('2024'); setState(''); setParty(''); setSearch(''); };

  let displayData = data;
  if (!data && !isLoading) {
    displayData = DEMO_DATA;
    if (state) displayData = displayData.filter(d => d.state === state);
    if (party) displayData = displayData.filter(d => d.party === party);
    if (search) displayData = displayData.filter(d =>
      d.constituency.toLowerCase().includes(search.toLowerCase()) ||
      d.candidate.toLowerCase().includes(search.toLowerCase())
    );
  }

  return (
    <div className="space-y-4 pb-6">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-slate-700 pb-3">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">Constituency Results</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Sortable breakdown by state, party, and candidate</p>
      </div>

      {/* Filter bar — wraps on mobile */}
      <FilterBar onReset={handleReset} onSearch={setSearch} searchQuery={search}>
        <YearFilter value={year} onChange={setYear} />
        <StateFilter value={state} onChange={setState} />
        <PartyFilter value={party} onChange={setParty} />
      </FilterBar>

      {/* Notice if using demo data */}
      {(error || (!data && !isLoading)) && (
        <div className="text-amber-600 text-xs bg-amber-50 dark:bg-amber-900/20 p-2.5 rounded-lg border border-amber-200 dark:border-amber-700">
          ⚠️ Backend API not connected — showing demonstration data.
        </div>
      )}

      {/* Table — responsive scroll on mobile */}
      <div className="mt-2">
        {isLoading && !displayData ? <Spinner className="h-[40vh]" /> : <ResultsTable data={displayData} />}
      </div>
    </div>
  );
}
