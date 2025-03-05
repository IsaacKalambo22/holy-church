import Gallery from '@/modules/client/gallery';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gallery | Identity Impact Hub',
  description:
    'Explore our gallery showcasing impactful events, inspiring changemakers, and transformative projects at Identity Impact Hub.',
  keywords: [
    'Identity Impact Hub Gallery',
    'Social Impact Projects',
    'Changemakers in Action',
    'Sustainable Development Photos',
    'Entrepreneurship Events',
    'Innovation Hub Visuals',
  ],
  openGraph: {
    title: 'Gallery | Identity Impact Hub',
    description:
      'Discover inspiring moments and impactful initiatives through our gallery at Identity Impact Hub.',
    url: 'https://identityimpacthub.com/gallery',
    images: [
      {
        url: 'https://identityimpacthub.com/assets/images/gallery-og.png',
        width: 1200,
        height: 630,
        alt: 'Gallery - Identity Impact Hub',
      },
    ],
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

const GalleryPage = () => {
  return <Gallery />;
};

export default GalleryPage;
