export function GalleryPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-center mb-8">Gallery</h1>
        <p className="text-center text-gray-600 mb-12">Moments from our church community</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
            <div key={i} className="bg-gray-200 aspect-square rounded-lg"></div>
          ))}
        </div>
      </div>
    </div>
  )
}
