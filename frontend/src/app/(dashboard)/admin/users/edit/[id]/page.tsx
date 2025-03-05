import AddNewHeader from '@/modules/admin/add-new-header';
import EditUser from '@/modules/admin/users/edit-user';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Edit User | Identity Impact Hub',
  description:
    'Modify user details, update permissions, and manage account settings at Identity Impact Hub.',
  keywords: [
    'Edit User',
    'Update User Info',
    'Admin Panel Identity Impact Hub',
    'User Management',
    'Access Control',
    'Identity Impact Hub Admin',
  ],
  openGraph: {
    title: 'Edit User | Identity Impact Hub',
    description:
      'Easily edit user details, manage roles, and update access permissions in the admin dashboard.',
    url: 'https://identityimpacthub.com/admin/users/edit',
    images: [
      {
        url: 'https://identityimpacthub.com/assets/images/admin-dashboard-og.png',
        width: 1200,
        height: 630,
        alt: 'Identity Impact Hub - Edit User Dashboard',
      },
    ],
    type: 'website',
  },
  robots: {
    index: false,
    follow: false,
  },
};

const EditUserPage = () => {
  return (
    <div className='w-full flex flex-col'>
      <AddNewHeader name='Edit User' />
      <EditUser />
    </div>
  );
};

export default EditUserPage;
