import Gallery from '@/modules/admin/gallery';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Gallery | Identity Impact Hub',
  description:
    'Manage and update gallery images in the Identity Impact Hub admin panel.',
  keywords: [
    'Admin Gallery',
    'Gallery Management',
    'Upload Images',
    'Identity Impact Hub Admin',
    'Media Library',
  ],
  openGraph: {
    title: 'Admin Gallery | Identity Impact Hub',
    description:
      'Easily manage and organize gallery images in the Identity Impact Hub admin dashboard.',
    url: 'https://identityimpacthub.com/admin/gallery',
    images: [
      {
        url: 'https://identityimpacthub.com/assets/images/admin-gallery-og.png',
        width: 1200,
        height: 630,
        alt: 'Identity Impact Hub - Admin Gallery',
      },
    ],
    type: 'website',
  },
  robots: {
    index: false,
    follow: false,
  },
};

const GalleryPage = () => {
  return <Gallery />;
};

export default GalleryPage;
