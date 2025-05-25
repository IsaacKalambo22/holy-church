import Services from '@/modules/client/services';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Services | Holy Church',
  description:
    'Explore Holy Church’s services designed to empower changemakers, entrepreneurs, and impact-driven leaders worldwide.',
  keywords: [
    'Holy Church Services',
    'Social Impact Solutions',
    'Entrepreneur Support',
    'Leadership Development',
    'Innovation Consulting',
    'Sustainable Business Growth',
  ],
  openGraph: {
    title: 'Our Services | Holy Church',
    description:
      'Discover how Holy Church provides tailored services for entrepreneurs, social innovators, and business leaders.',
    url: 'https://holychurch.com/services',
    images: [
      {
        url: 'https://holychurch.com/assets/images/services-og.png',
        width: 1200,
        height: 630,
        alt: 'Our Services - Holy Church',
      },
    ],
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

const ServicesPage = () => {
  return <Services />;
};

export default ServicesPage;
