import AddNewHeader from '@/modules/admin/add-new-header';
import NewStudent from '@/modules/admin/students/new-student';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Add New Student | Identity Impact Hub',
  description:
    'Create a new student profile in the Identity Impact Hub admin panel.',
  keywords: [
    'New Student Registration',
    'Add Student',
    'Student Management',
    'Identity Impact Hub Admin',
    'Education Administration',
    'Student Database',
  ],
  openGraph: {
    title:
      'Add New Student | Identity Impact Hub',
    description:
      'Easily add new students, update their details, and manage records in the admin dashboard.',
    url: 'https://identityimpacthub.com/admin/students/new',
    images: [
      {
        url: 'https://identityimpacthub.com/assets/images/admin-dashboard-og.png',
        width: 1200,
        height: 630,
        alt: 'Identity Impact Hub - Add New Student',
      },
    ],
    type: 'website',
  },
  robots: {
    index: false,
    follow: false,
  },
};

const NewStudentPage = () => {
  return (
    <div className='w-full flex flex-col'>
      <AddNewHeader name='New Student' />
      <NewStudent />
    </div>
  );
};

export default NewStudentPage;
