import StudentDataTable from '@/modules/admin/students/student-data-table';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Manage Students | Identity Impact Hub',
  description:
    'View, manage, and update student records in the admin panel of Identity Impact Hub.',
  keywords: [
    'Student Management',
    'Admin Panel Identity Impact Hub',
    'Manage Students',
    'Student Data',
    'Identity Impact Hub Admin',
    'Education Administration',
  ],
  openGraph: {
    title:
      'Manage Students | Identity Impact Hub',
    description:
      'Easily access and manage student records, update details, and track performance in the admin dashboard.',
    url: 'https://identityimpacthub.com/admin/students',
    images: [
      {
        url: 'https://identityimpacthub.com/assets/images/admin-dashboard-og.png',
        width: 1200,
        height: 630,
        alt: 'Identity Impact Hub - Student Management Dashboard',
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
  return <StudentDataTable />;
};

export default AdminUsersPage;
