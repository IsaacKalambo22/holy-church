import UserDataTable from '@/modules/admin/users/user-data-table';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Users | Identity Impact Hub',
  description:
    'Manage user accounts, permissions, and roles efficiently through the Identity Impact Hub admin panel.',
  keywords: [
    'Admin Panel Identity Impact Hub',
    'User Management',
    'Admin Dashboard',
    'Manage User Accounts',
    'Identity Impact Hub Admin',
    'Role-based Access Control',
  ],
  openGraph: {
    title: 'Admin Users | Identity Impact Hub',
    description:
      'View and manage users at Identity Impact Hub, including roles, permissions, and account statuses.',
    url: 'https://identityimpacthub.com/admin/users',
    images: [
      {
        url: 'https://identityimpacthub.com/assets/images/admin-dashboard-og.png',
        width: 1200,
        height: 630,
        alt: 'Identity Impact Hub - Admin Users Dashboard',
      },
    ],
    type: 'website',
  },
  robots: {
    index: false,
    follow: false,
  },
};

const AdminUsersPage = () => {
  return <UserDataTable />;
};

export default AdminUsersPage;
