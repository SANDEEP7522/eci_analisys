export default function Card({ title, value, subtitle, children, className = '' }) {
  return (
    <div className={`bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 p-4 hover:shadow-md transition-shadow ${className}`}>
      {title && <h3 className="text-xs sm:text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1 truncate">{title}</h3>}
      {value && <div className="text-2xl sm:text-3xl font-bold text-blue-700 dark:text-blue-400 truncate">{value}</div>}
      {subtitle && <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 truncate">{subtitle}</p>}
      {children && <div className="mt-3">{children}</div>}
    </div>
  );
}
