import Courses from '@/modules/admin/courses';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Courses | Holy Church Assembly',
  description:
    'Manage courses, update content, and track enrollments from the Holy Church Assembly admin panel.',
  keywords: [
    'Admin Courses',
    'Course Management',
    'Holy Church Assembly Admin',
    'Online Learning',
    'Course Enrollment',
  ],
  openGraph: {
    title: 'Admin Courses | Holy Church Assembly',
    description:
      'Manage courses efficiently, update content, and track enrollments from the admin panel.',
    url: 'https://holychurchassembly.com/admin/courses',
    images: [
      {
        url: 'https://holychurchassembly.com/assets/images/admin-courses-og.png',
        width: 1200,
        height: 630,
        alt: 'Holy Church Assembly - Admin Courses',
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
