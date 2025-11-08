'use client';

interface LoadingSkeletonProps {
  variant?: 'card' | 'text' | 'table';
  count?: number;
}

export default function LoadingSkeleton({ variant = 'card', count = 1 }: LoadingSkeletonProps) {
  if (variant === 'card') {
    return (
      <>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden animate-pulse">
            <div className="h-48 w-full bg-gray-300 dark:bg-gray-700" />
            <div className="p-4">
              <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-2" />
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full mb-2" />
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6 mb-4" />
              <div className="flex items-center justify-between">
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-24" />
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-20" />
              </div>
            </div>
          </div>
        ))}
      </>
    );
  }

  if (variant === 'table') {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden animate-pulse">
        <div className="p-6">
          <div className="space-y-4">
            {Array.from({ length: count }).map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/4" />
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/6" />
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/5" />
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/6" />
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/6" />
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/12" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full mb-2 animate-pulse" />
      ))}
    </>
  );
}

