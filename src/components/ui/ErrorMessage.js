import { AlertCircle } from 'lucide-react';

export default function ErrorMessage({ message = 'An error occurred while loading data.', className = '' }) {
  return (
    <div className={`bg-red-50 border-l-4 border-error p-4 rounded-md shadow-sm ${className}`}>
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <AlertCircle className="h-5 w-5 text-error" />
        </div>
        <div className="ml-3">
          <p className="text-sm text-red-700">{message}</p>
        </div>
      </div>
    </div>
  );
}
