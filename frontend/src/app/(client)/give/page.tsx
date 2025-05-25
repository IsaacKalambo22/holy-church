import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Give | Holy Church',
  description:
    'Support the mission and ministry of Holy Church through your generous donations. Make a difference in our community.',
  keywords: [
    'Holy Church Donations',
    'Church Giving',
    'Support Ministry',
    'Online Giving',
    'Church Offerings',
    'Religious Donations',
  ],
  openGraph: {
    title: 'Give | Holy Church',
    description:
      'Support our mission and ministry through your generous donations. Make a difference in our community.',
    url: 'https://holychurch.com/give',
    images: [
      {
        url: 'https://holychurch.com/assets/images/give-og.png',
        width: 1200,
        height: 630,
        alt: 'Give - Holy Church',
      },
    ],
    type: 'website',
  },
};

export default function GivePage() {
  return (
    <div className="py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Give to Holy Church</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Support our mission and ministry through your generous donations. Your contribution helps us spread the message of hope and make a difference in our community.
        </p>
      </div>
      
      {/* Donation Form will be implemented here */}
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
        {/* Donation form components will be added here */}
      </div>
    </div>
  );
}
