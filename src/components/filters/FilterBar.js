import { Search, X } from 'lucide-react';

export default function FilterBar({ children, onReset, onSearch, searchQuery, className = '' }) {
  return (
    <div className={`bg-white dark:bg-[var(--t-bgCardSolid)] rounded-2xl shadow-sm border border-gray-100 dark:border-[var(--t-border)] p-3 sm:p-4 space-y-3 ${className}`}>
      {/* Filters row - wraps on mobile */}
      <div className="flex flex-wrap gap-3 items-end">
        {children}
      </div>

      {/* Search + Reset row */}
      <div className="flex flex-col sm:flex-row gap-2">
        {onSearch !== undefined && (
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
              placeholder="Search constituency or candidate..."
              className="w-full pl-9 pr-3 py-2 border border-gray-200 dark:border-[var(--t-border)] bg-white dark:bg-[var(--t-bgCard)] text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        )}
        {onReset && (
          <button
            onClick={onReset}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-50 dark:bg-[var(--t-bgCard)] hover:bg-gray-100 dark:hover:bg-slate-600 border border-gray-200 dark:border-[var(--t-border)] text-gray-700 dark:text-gray-300 rounded-xl text-sm font-medium transition-colors"
          >
            <X size={15} />
            <span>Reset</span>
          </button>
        )}
      </div>
    </div>
  );
}
