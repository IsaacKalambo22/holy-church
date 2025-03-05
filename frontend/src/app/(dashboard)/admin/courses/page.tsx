import Courses from '@/modules/admin/courses';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Courses | Identity Impact Hub',
  description:
    'Manage courses, update content, and track enrollments from the Identity Impact Hub admin panel.',
  keywords: [
    'Admin Courses',
    'Course Management',
    'Identity Impact Hub Admin',
    'Online Learning',
    'Course Enrollment',
  ],
  openGraph: {
    title: 'Admin Courses | Identity Impact Hub',
    description:
      'Manage courses efficiently, update content, and track enrollments from the admin panel.',
    url: 'https://identityimpacthub.com/admin/courses',
    images: [
      {
        url: 'https://identityimpacthub.com/assets/images/admin-courses-og.png',
        width: 1200,
        height: 630,
        alt: 'Identity Impact Hub - Admin Courses',
      },
    ],
    type: 'website',
  },
  robots: {
    index: false,
    follow: false,
  },
};

const CoursesPage = () => {
  return <Courses />;
};

export default CoursesPage;
