import Services from '@/modules/client/services';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Services | Identity Impact Hub',
  description:
    'Explore Identity Impact Hub’s services designed to empower changemakers, entrepreneurs, and impact-driven leaders worldwide.',
  keywords: [
    'Identity Impact Hub Services',
    'Social Impact Solutions',
    'Entrepreneur Support',
    'Leadership Development',
    'Innovation Consulting',
    'Sustainable Business Growth',
  ],
  openGraph: {
    title: 'Our Services | Identity Impact Hub',
    description:
      'Discover how Identity Impact Hub provides tailored services for entrepreneurs, social innovators, and business leaders.',
    url: 'https://identityimpacthub.com/services',
    images: [
      {
        url: 'https://identityimpacthub.com/assets/images/services-og.png',
        width: 1200,
        height: 630,
        alt: 'Our Services - Identity Impact Hub',
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
