export function AboutUsPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-center mb-8">About Us</h1>
        
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
          <p className="text-gray-600 mb-6">
            Holy Church is dedicated to spreading the love of God and building a strong community of believers.
            We strive to create an environment where everyone feels welcome and can grow in their faith.
          </p>
          
          <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
          <p className="text-gray-600 mb-6">
            To be a beacon of hope and light in our community, transforming lives through the power of the Gospel
            and serving others with love and compassion.
          </p>
          
          <h2 className="text-2xl font-bold mb-4">What We Believe</h2>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>The Bible is the inspired Word of God</li>
            <li>There is one God, eternally existent in three persons</li>
            <li>Jesus Christ is the Son of God, fully God and fully man</li>
            <li>Salvation is by grace through faith in Jesus Christ</li>
            <li>The Holy Spirit indwells and empowers believers</li>
            <li>The Church is the body of Christ, commissioned to make disciples</li>
          </ul>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4">Our Leadership</h3>
            <p className="text-gray-600">
              Our church is led by a team of dedicated pastors and elders who are committed to serving
              our congregation and guiding us in our spiritual journey.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4">Our History</h3>
            <p className="text-gray-600">
              Founded in 2000, Holy Church has grown from a small gathering to a vibrant community
              of believers serving our city and beyond.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
