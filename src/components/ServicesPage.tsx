export function ServicesPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-center mb-8">Our Services</h1>
        <p className="text-center text-gray-600 mb-12">Join us for worship and fellowship</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex items-center mb-4">
              <div className="bg-primary-600 text-white rounded-full w-12 h-12 flex items-center justify-center mr-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold">Sunday Service</h3>
            </div>
            <p className="text-gray-600 mb-4">Join us for our main Sunday worship service with music, prayer, and a message from our pastor.</p>
            <div className="text-gray-700">
              <p><strong>Time:</strong> 10:00 AM</p>
              <p><strong>Location:</strong> Main Sanctuary</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex items-center mb-4">
              <div className="bg-primary-600 text-white rounded-full w-12 h-12 flex items-center justify-center mr-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold">Small Groups</h3>
            </div>
            <p className="text-gray-600 mb-4">Connect with others in small group settings for deeper fellowship and Bible study.</p>
            <div className="text-gray-700">
              <p><strong>Time:</strong> Various times throughout the week</p>
              <p><strong>Location:</strong> Various locations</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex items-center mb-4">
              <div className="bg-primary-600 text-white rounded-full w-12 h-12 flex items-center justify-center mr-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold">Bible Study</h3>
            </div>
            <p className="text-gray-600 mb-4">Dive deeper into God's Word through our weekly Bible study sessions.</p>
            <div className="text-gray-700">
              <p><strong>Time:</strong> Wednesday 7:00 PM</p>
              <p><strong>Location:</strong> Fellowship Hall</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex items-center mb-4">
              <div className="bg-primary-600 text-white rounded-full w-12 h-12 flex items-center justify-center mr-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold">Youth Ministry</h3>
            </div>
            <p className="text-gray-600 mb-4">Special programs and activities for our youth to grow in faith and friendship.</p>
            <div className="text-gray-700">
              <p><strong>Time:</strong> Friday 6:00 PM</p>
              <p><strong>Location:</strong> Youth Center</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
