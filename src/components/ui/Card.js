export default function Card({ title, value, subtitle, children, className = '' }) {
  return (
    <div className={`bg-[var(--t-bgCardSolid)] border border-[var(--t-border)] rounded-2xl shadow-sm p-4 hover:border-[var(--t-borderHi)] transition-all ${className}`}>
      {title    && <h3 className="text-xs sm:text-sm font-semibold text-[var(--t-textSec)] mb-1 truncate">{title}</h3>}
      {value    && <div className="text-2xl sm:text-3xl font-bold text-[var(--t-accent)] truncate">{value}</div>}
      {subtitle && <p className="text-xs text-[var(--t-textMut)] mt-0.5 truncate">{subtitle}</p>}
      {children && <div className="mt-3">{children}</div>}
    </div>
  );
}
