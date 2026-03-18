export default function Badge({ children, party = 'default', className = '' }) {
  const getColor = (p) => {
    const name = (p || '').toLowerCase();
    if (name === 'bjp')    return 'bg-orange-500 text-white';
    if (name === 'inc')    return 'bg-blue-800 text-white';
    if (name === 'sp')     return 'bg-red-500 text-white';
    if (name === 'tmc')    return 'bg-green-500 text-white';
    if (name === 'aap')    return 'bg-sky-600 text-white';
    if (name === 'dmk')    return 'bg-violet-600 text-white';
    if (name === 'jdu')    return 'bg-indigo-500 text-white';
    if (name === 'bsp')    return 'bg-blue-400 text-white';
    if (name === 'aimim')  return 'bg-teal-600 text-white';
    if (name === 'nda')    return 'bg-orange-600 text-white';
    if (name === 'india')  return 'bg-blue-700 text-white';
    if (name === 'others') return 'bg-gray-500 text-white';
    switch (p) {
      case 'primary': return 'bg-blue-800 text-white';
      case 'accent':  return 'bg-orange-500 text-white';
      case 'success': return 'bg-green-600 text-white';
      case 'error':   return 'bg-red-500 text-white';
      default:        return 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
    }
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold leading-5 ${getColor(party)} ${className}`}>
      {children}
    </span>
  );
}
