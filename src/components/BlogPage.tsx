export function BlogPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-center mb-8">Blog</h1>
        <p className="text-center text-gray-600 mb-12">Read our latest articles and updates</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 bg-gray-200"></div>
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-2">Blog Post Title {i}</h3>
                <p className="text-gray-600 mb-4">Brief excerpt from the blog post goes here...</p>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 text-sm">Author Name</span>
                  <a href="#" className="text-primary-600 hover:text-primary-800 font-semibold">
                    Read More →
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
