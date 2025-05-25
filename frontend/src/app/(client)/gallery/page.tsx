import Gallery from '@/modules/client/gallery';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gallery | Holy Church',
  description:
    'Explore our gallery showcasing impactful events, inspiring changemakers, and transformative projects at Holy Church.',
  keywords: [
    'Holy Church Gallery',
    'Social Impact Projects',
    'Changemakers in Action',
    'Sustainable Development Photos',
    'Entrepreneurship Events',
    'Innovation Hub Visuals',
  ],
  openGraph: {
    title: 'Gallery | Holy Church',
    description:
      'Discover inspiring moments and impactful initiatives through our gallery at Holy Church.',
    url: 'https://holychurch.com/gallery',
    images: [
      {
        url: 'https://holychurch.com/assets/images/gallery-og.png',
        width: 1200,
        height: 630,
        alt: 'Gallery - Holy Church',
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
