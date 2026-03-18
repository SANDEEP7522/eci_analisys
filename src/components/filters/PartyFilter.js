const PARTIES = [
  'BJP','INC','SP','TMC','BSP','CPI(M)','NCP','RJD','DMK','AIADMK',
  'YSRCP','BJD','BRS','SHS','JDU','LJP','AAP','AIMIM','IND',
];

export default function PartyFilter({ value, onChange, className = '' }) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label className="text-xs text-gray-500 dark:text-gray-400 font-medium">Party</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="px-3 py-2 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 text-gray-900 dark:text-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer min-w-[120px]"
      >
        <option value="">All Parties</option>
        {PARTIES.map(p => <option key={p} value={p}>{p}</option>)}
      </select>
    </div>
  );
}
