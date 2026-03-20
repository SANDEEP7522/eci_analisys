import { motion } from 'framer-motion';

export default function Card({ title, value, subtitle, children, className = '', index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={`card-elevated bg-[var(--t-bgCardSolid)] border border-[var(--t-border)] rounded-2xl p-4 transition-all ${className}`}
    >
      {title    && <h3 className="text-xs sm:text-sm font-semibold text-[var(--t-textSec)] mb-1 truncate">{title}</h3>}
      {value    && <div className="text-2xl sm:text-3xl font-bold text-[var(--t-accent)] truncate">{value}</div>}
      {subtitle && <p className="text-xs text-[var(--t-textSec)] mt-0.5 truncate font-medium">{subtitle}</p>}
      {children && <div className="mt-3">{children}</div>}
    </motion.div>
  );
}
