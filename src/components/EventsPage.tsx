export function EventsPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-center mb-8">Events</h1>
        <p className="text-center text-gray-600 mb-12">Join us for upcoming church events</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start">
                <div className="bg-indigo-600 text-white rounded-lg p-4 mr-4">
                  <div className="text-2xl font-bold">{i * 5}</div>
                  <div className="text-sm">JAN</div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">Event Title {i}</h3>
                  <p className="text-gray-600 mb-2">Event description goes here</p>
                  <p className="text-gray-500 text-sm">Location: Church Hall</p>
                  <p className="text-gray-500 text-sm">Time: 10:00 AM</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
