export function BookGridSkeleton() {
  return (
    <div>
      {/* Results count skeleton */}
      <div className="flex justify-between items-center mb-6">
        <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
        <div className="lg:hidden h-8 bg-gray-200 rounded w-24 animate-pulse"></div>
      </div>

      {/* Book Grid Skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {Array.from({ length: 12 }).map((_, index) => (
          <BookCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}

export function BookCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
      {/* Cover skeleton */}
      <div className="aspect-[3/4] bg-gray-200"></div>
      
      {/* Content skeleton */}
      <div className="p-3 sm:p-4 space-y-2">
        {/* Title skeleton */}
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        
        {/* Author skeleton */}
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        
        {/* Category skeleton */}
        <div className="h-3 bg-gray-200 rounded w-1/3"></div>
        
        {/* Price skeleton */}
        <div className="flex justify-between items-center mt-3">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-3 bg-gray-200 rounded w-1/5"></div>
        </div>
        
        {/* Tags skeleton */}
        <div className="flex gap-1 mt-2">
          <div className="h-5 bg-gray-200 rounded-full w-12"></div>
          <div className="h-5 bg-gray-200 rounded-full w-16"></div>
        </div>
      </div>
    </div>
  );
}