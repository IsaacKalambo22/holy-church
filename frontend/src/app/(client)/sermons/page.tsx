import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sermons | Holy Church',
  description:
    'Watch and listen to inspiring sermons from Holy Church. Access our collection of spiritual teachings and messages.',
  keywords: [
    'Holy Church Sermons',
    'Christian Teachings',
    'Spiritual Messages',
    'Online Sermons',
    'Church Preachings',
    'Religious Teachings',
  ],
  openGraph: {
    title: 'Sermons | Holy Church',
    description:
      'Access our collection of inspiring sermons and spiritual teachings at Holy Church.',
    url: 'https://holychurch.com/sermons',
    images: [
      {
        url: 'https://holychurch.com/assets/images/sermons-og.png',
        width: 1200,
        height: 630,
        alt: 'Sermons - Holy Church',
      },
    ],
    type: 'website',
  },
};

export default function SermonsPage() {
  return (
    <div className="py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Our Sermons</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Explore our collection of inspiring sermons and spiritual teachings. Watch or listen to messages that will uplift your faith and deepen your understanding.
        </p>
      </div>
      
      {/* Sermons Grid will be implemented here */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Sermon cards will be mapped here */}
      </div>
    </div>
  );
}
