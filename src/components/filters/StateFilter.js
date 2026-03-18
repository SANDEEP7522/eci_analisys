const STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat',
  'Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra',
  'Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim',
  'Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal',
  'Andaman & Nicobar','Chandigarh','D&N Haveli','Daman & Diu','Delhi','Lakshadweep','Puducherry',
];

export default function StateFilter({ value, onChange, className = '' }) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label className="text-xs text-gray-500 dark:text-gray-400 font-medium">State / UT</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="px-3 py-2 bg-white dark:bg-[var(--t-bgCard)] border border-gray-200 dark:border-[var(--t-border)] text-gray-900 dark:text-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer min-w-[150px]"
      >
        <option value="">All States / UTs</option>
        {STATES.map(s => <option key={s} value={s}>{s}</option>)}
      </select>
    </div>
  );
}
