import NewUser from '@/modules/admin/users/new-user';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Add New User | Identity Impact Hub',
  description:
    'Create and manage new user accounts with role-based access control at Identity Impact Hub.',
  keywords: [
    'Create New User',
    'Admin Panel Identity Impact Hub',
    'User Registration',
    'Role Management',
    'Admin Dashboard',
    'Identity Impact Hub Admin',
  ],
  openGraph: {
    title: 'Add New User | Identity Impact Hub',
    description:
      'Easily add and manage new users, assign roles, and configure permissions at Identity Impact Hub.',
    url: 'https://identityimpacthub.com/admin/users/new',
    images: [
      {
        url: 'https://identityimpacthub.com/assets/images/admin-dashboard-og.png',
        width: 1200,
        height: 630,
        alt: 'Identity Impact Hub - Add New User Dashboard',
      },
    ],
    type: 'website',
  },
  robots: {
    index: false,
    follow: false,
  },
};

const NewUserPage = () => {
  return <NewUser />;
};

export default NewUserPage;
