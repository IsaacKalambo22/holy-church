export default function SermonsLoading() {
  return (
    <div className="py-12">
      <div className="text-center mb-12">
        <div className="h-10 w-64 bg-gray-200 rounded-md animate-pulse mx-auto mb-4"></div>
        <div className="h-4 w-full max-w-2xl bg-gray-200 rounded-md animate-pulse mx-auto"></div>
        <div className="h-4 w-full max-w-xl bg-gray-200 rounded-md animate-pulse mx-auto mt-2"></div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array(6).fill(0).map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="h-48 w-full bg-gray-200 animate-pulse"></div>
            <div className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-4 w-20 bg-gray-200 rounded-md animate-pulse"></div>
                <div className="h-6 w-24 bg-gray-200 rounded-full animate-pulse"></div>
              </div>
              <div className="h-6 w-full bg-gray-200 rounded-md animate-pulse mb-2"></div>
              <div className="h-4 w-full bg-gray-200 rounded-md animate-pulse"></div>
              <div className="h-4 w-3/4 bg-gray-200 rounded-md animate-pulse mt-1"></div>
              <div className="h-4 w-1/2 bg-gray-200 rounded-md animate-pulse mt-1"></div>
              <div className="h-4 w-32 bg-gray-200 rounded-md animate-pulse mt-4"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 