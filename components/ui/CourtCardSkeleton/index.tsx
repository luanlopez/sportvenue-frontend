export function CourtCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
      <div className="h-40 sm:h-48 bg-gray-200" />
      <div className="p-3 sm:p-4 space-y-3">
        <div className="h-6 bg-gray-200 rounded-md w-3/4" />
        
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded-md w-full" />
          <div className="h-4 bg-gray-200 rounded-md w-2/3" />
        </div>
        
        <div className="h-4 bg-gray-200 rounded-md w-1/4" />

        <div className="flex gap-2 flex-col sm:flex-row pt-2">
          <div className="h-10 bg-gray-200 rounded-md flex-1" />
        </div>
      </div>
    </div>
  );
} 