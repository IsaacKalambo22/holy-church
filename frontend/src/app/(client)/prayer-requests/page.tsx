import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Prayer Requests | Holy Church',
  description:
    'Submit your prayer requests to Holy Church. Our community will join you in prayer for your needs and intentions.',
  keywords: [
    'Prayer Requests',
    'Church Prayers',
    'Submit Prayer',
    'Prayer Support',
    'Spiritual Support',
    'Community Prayer',
  ],
  openGraph: {
    title: 'Prayer Requests | Holy Church',
    description:
      'Submit your prayer requests and join our community in prayer. We believe in the power of united prayer.',
    url: 'https://holychurch.com/prayer-requests',
    images: [
      {
        url: 'https://holychurch.com/assets/images/prayer-requests-og.png',
        width: 1200,
        height: 630,
        alt: 'Prayer Requests - Holy Church',
      },
    ],
    type: 'website',
  },
};

export default function PrayerRequestsPage() {
  return (
    <div className="py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Prayer Requests</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Share your prayer requests with our community. We believe in the power of united prayer and would be honored to pray with you.
        </p>
      </div>
      
      {/* Prayer Request Form will be implemented here */}
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
        {/* Prayer request form components will be added here */}
      </div>
    </div>
  );
}
