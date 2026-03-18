export default function AdTypeTable({ data }) {
  const tableData = data || [
    { ad_type: 'Carousel', impr: 15900, clks: 1800, ctr: 11.08, pr: 0.56, er: 12.76, cr: 5.24 },
    { ad_type: 'Video',    impr: 16800, clks: 1900, ctr: 11.23, pr: 0.59, er: 12.90, cr: 5.23 },
    { ad_type: 'Image',    impr: 15100, clks: 1800, ctr: 11.78, pr: 0.58, er: 13.67, cr: 5.56 },
    { ad_type: 'Stories',  impr: 14900, clks: 1400, ctr: 11.35, pr: 0.64, er: 13.36, cr: 5.63 },
  ];

  const getColor = (key, value) => {
    if (key === 'ctr') return value > 11.5 ? 'bg-orange-400 text-white' : 'bg-blue-300 text-white';
    if (key === 'pr') return value > 0.60 ? 'bg-purple-400 text-white' : 'bg-blue-200 text-blue-900';
    if (key === 'er') return value > 13 ? 'bg-red-400 text-white' : 'bg-green-300 text-white';
    if (key === 'cr') return value > 5.4 ? 'bg-orange-300 text-white' : 'bg-sky-300 text-white';
    return '';
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-xs">
        <thead>
          <tr className="border-b dark:border-gray-700">
            {['Ad Type', 'IMPR', 'CLKS', 'CTR', 'PR', 'ER', 'CR'].map(h => (
              <th key={h} className="px-2 py-2 text-left font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableData.map((row, i) => (
            <tr key={i} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50">
              <td className="px-2 py-2 font-medium dark:text-gray-200">{row.ad_type}</td>
              <td className="px-2 py-2 dark:text-gray-300">{(row.impr / 1000).toFixed(1)}K</td>
              <td className="px-2 py-2 dark:text-gray-300">{(row.clks / 1000).toFixed(1)}K</td>
              <td className="px-2 py-2"><span className={`px-1.5 py-0.5 rounded text-xs font-bold ${getColor('ctr', row.ctr)}`}>{row.ctr}%</span></td>
              <td className="px-2 py-2"><span className={`px-1.5 py-0.5 rounded text-xs font-bold ${getColor('pr', row.pr)}`}>{row.pr}%</span></td>
              <td className="px-2 py-2"><span className={`px-1.5 py-0.5 rounded text-xs font-bold ${getColor('er', row.er)}`}>{row.er}%</span></td>
              <td className="px-2 py-2"><span className={`px-1.5 py-0.5 rounded text-xs font-bold ${getColor('cr', row.cr)}`}>{row.cr}%</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
