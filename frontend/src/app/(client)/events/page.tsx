import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Events | Holy Church',
  description:
    'Stay updated with upcoming events, gatherings, and special services at Holy Church. Join our community in worship and fellowship.',
  keywords: [
    'Holy Church Events',
    'Church Activities',
    'Religious Events',
    'Community Gatherings',
    'Church Calendar',
    'Worship Services',
  ],
  openGraph: {
    title: 'Events | Holy Church',
    description:
      'Discover upcoming events and activities at Holy Church. Join our community in worship and fellowship.',
    url: 'https://holychurch.com/events',
    images: [
      {
        url: 'https://holychurch.com/assets/images/events-og.png',
        width: 1200,
        height: 630,
        alt: 'Events - Holy Church',
      },
    ],
    type: 'website',
  },
};

export default function EventsPage() {
  return (
    <div className="py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Upcoming Events</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Join us for our upcoming events and activities. Connect with our community and grow in faith together.
        </p>
      </div>
      
      {/* Events Grid will be implemented here */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Event cards will be mapped here */}
      </div>
    </div>
  );
}
