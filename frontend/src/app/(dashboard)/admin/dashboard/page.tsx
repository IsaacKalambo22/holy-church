import Dashboard from '@/modules/admin/dashboard';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Dashboard | Identity Impact Hub',
  description:
    'Access and manage all administrative functions from the Identity Impact Hub dashboard.',
  keywords: [
    'Admin Dashboard',
    'Identity Impact Hub Admin',
    'User Management',
    'Content Management',
    'Reports & Analytics',
  ],
  openGraph: {
    title:
      'Admin Dashboard | Identity Impact Hub',
    description:
      'Easily manage users, content, and analytics from the Identity Impact Hub admin dashboard.',
    url: 'https://identityimpacthub.com/admin/dashboard',
    images: [
      {
        url: 'https://identityimpacthub.com/assets/images/admin-dashboard-og.png',
        width: 1200,
        height: 630,
        alt: 'Identity Impact Hub - Admin Dashboard',
      },
    ],
    type: 'website',
  },
  robots: {
    index: false,
    follow: false,
  },
};

const AdminHomePage = () => {
  return <Dashboard />;
};

export default AdminHomePage;
