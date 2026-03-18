import { AlertCircle } from 'lucide-react';

export default function ErrorMessage({ message = 'An error occurred while loading data.', className = '' }) {
  return (
    <div className={`bg-[var(--t-bgCard)] border-l-4 border-[var(--t-no)] p-4 rounded-md ${className}`}>
      <div className="flex items-center">
        <AlertCircle className="h-5 w-5 text-[var(--t-no)] flex-shrink-0" />
        <p className="ml-3 text-sm text-[var(--t-no)]">{message}</p>
      </div>
    </div>
  );
}
