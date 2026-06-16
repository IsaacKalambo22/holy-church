export function PodcastsPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-center mb-8">Podcasts</h1>
        <p className="text-center text-gray-600 mb-12">Listen to our audio content on the go</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 bg-gray-200"></div>
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-2">Podcast Episode {i}</h3>
                <p className="text-gray-600 mb-2">Speaker Name</p>
                <p className="text-gray-500 text-sm mb-4">Duration: 30 min</p>
                <button className="bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700 transition">
                  Listen
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
