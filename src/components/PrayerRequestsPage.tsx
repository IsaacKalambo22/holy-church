export function PrayerRequestsPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-center mb-8">Prayer Requests</h1>
        <p className="text-center text-gray-600 mb-12">Share your prayer requests with our community</p>
        
        <div className="bg-white rounded-lg shadow-md p-8">
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Your Prayer Request</label>
              <textarea
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                rows={5}
                placeholder="Share your prayer request..."
              ></textarea>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="anonymous"
                className="mr-2"
              />
              <label htmlFor="anonymous" className="text-sm text-gray-700">
                Submit anonymously
              </label>
            </div>
            
            <button
              type="submit"
              className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition"
            >
              Submit Prayer Request
            </button>
          </form>
        </div>
        
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Recent Prayer Requests</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-md p-6">
                <p className="text-gray-600">Please pray for my family during this difficult time.</p>
                <p className="text-gray-500 text-sm mt-2">Submitted by Anonymous</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
