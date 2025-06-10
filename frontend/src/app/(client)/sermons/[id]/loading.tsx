export default function SermonLoading() {
  return (
    <div className="py-12 max-w-6xl mx-auto px-4">
      <div className="mb-8">
        <div className="h-10 w-3/4 bg-gray-200 rounded-md animate-pulse mb-4"></div>
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="h-6 w-32 bg-gray-200 rounded-md animate-pulse"></div>
          <div className="h-6 w-4 bg-gray-200 rounded-md animate-pulse"></div>
          <div className="h-6 w-24 bg-gray-200 rounded-md animate-pulse"></div>
          <div className="h-6 w-4 bg-gray-200 rounded-md animate-pulse"></div>
          <div className="h-6 w-32 bg-gray-200 rounded-full animate-pulse"></div>
        </div>
      </div>
      
      <div className="aspect-video w-full mb-8 bg-gray-200 rounded-lg animate-pulse"></div>
      
      <div className="space-y-4">
        <div className="h-6 w-full bg-gray-200 rounded-md animate-pulse"></div>
        <div className="h-6 w-full bg-gray-200 rounded-md animate-pulse"></div>
        <div className="h-6 w-3/4 bg-gray-200 rounded-md animate-pulse"></div>
        <div className="h-6 w-full bg-gray-200 rounded-md animate-pulse"></div>
        <div className="h-6 w-5/6 bg-gray-200 rounded-md animate-pulse"></div>
      </div>
      
      <div className="mt-8">
        <div className="h-6 w-24 bg-gray-200 rounded-md animate-pulse mb-3"></div>
        <div className="flex flex-wrap gap-2">
          {Array(5).fill(0).map((_, index) => (
            <div 
              key={index} 
              className="h-8 w-20 bg-gray-200 rounded-full animate-pulse"
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
} 