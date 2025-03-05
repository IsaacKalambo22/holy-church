import AddNewHeader from '@/modules/admin/add-new-header';
import EditStudent from '@/modules/admin/students/edit-student';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Edit Student | Identity Impact Hub',
  description:
    'Modify student details in the Identity Impact Hub admin panel.',
  keywords: [
    'Edit Student',
    'Student Management',
    'Update Student Records',
    'Identity Impact Hub Admin',
    'Education Administration',
  ],
  openGraph: {
    title: 'Edit Student | Identity Impact Hub',
    description:
      'Easily update student information, edit records, and manage student data in the admin dashboard.',
    url: 'https://identityimpacthub.com/admin/students/edit',
    images: [
      {
        url: 'https://identityimpacthub.com/assets/images/admin-dashboard-og.png',
        width: 1200,
        height: 630,
        alt: 'Identity Impact Hub - Edit Student',
      },
    ],
    type: 'website',
  },
  robots: {
    index: false,
    follow: false,
  },
};

const EditStudentPage = () => {
  return (
    <div className='w-full flex flex-col'>
      <AddNewHeader name='Edit Student' />
      <EditStudent />
    </div>
  );
};

export default EditStudentPage;
