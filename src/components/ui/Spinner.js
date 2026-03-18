export default function Spinner({ className = '' }) {
  return (
    <div className={`flex justify-center items-center p-8 ${className}`}>
      <div className="relative">
        <div className="w-10 h-10 rounded-full border-4 border-blue-200 dark:border-blue-900"></div>
        <div className="absolute top-0 left-0 w-10 h-10 rounded-full border-4 border-blue-600 dark:border-blue-400 border-t-transparent animate-spin"></div>
      </div>
    </div>
  );
}
