import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Podcasts | Holy Church',
  description:
    'Listen to inspiring podcasts from Holy Church. Access our collection of spiritual discussions, teachings, and conversations.',
  keywords: [
    'Holy Church Podcasts',
    'Christian Podcasts',
    'Spiritual Audio',
    'Religious Discussions',
    'Faith Conversations',
    'Church Teachings',
  ],
  openGraph: {
    title: 'Podcasts | Holy Church',
    description:
      'Listen to our collection of inspiring podcasts featuring spiritual discussions and teachings.',
    url: 'https://holychurch.com/podcasts',
    images: [
      {
        url: 'https://holychurch.com/assets/images/podcasts-og.png',
        width: 1200,
        height: 630,
        alt: 'Podcasts - Holy Church',
      },
    ],
    type: 'website',
  },
};

export default function PodcastsPage() {
  return (
    <div className="py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Our Podcasts</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Listen to our collection of inspiring podcasts featuring spiritual discussions, teachings, and conversations that will enrich your faith journey.
        </p>
      </div>
      
      {/* Podcasts Grid will be implemented here */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Podcast episode cards will be mapped here */}
      </div>
    </div>
  );
}
