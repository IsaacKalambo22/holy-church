import SignUp from '@/modules/auth/sign-up';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign Up | Holy Church',
  description:
    'Join Holy Church today and become part of a global network of innovators, leaders, and changemakers.',
  keywords: [
    'Holy Church Sign Up',
    'Join Holy Church',
    'Social Innovation Network',
    'Leadership Community',
    'Impact-Driven Entrepreneurship',
  ],
  openGraph: {
    title: 'Sign Up | Holy Church',
    description:
      'Create your account at Holy Church and start making an impact today.',
    url: 'https://holychurch.com/signup',
    images: [
      {
        url: 'https://holychurch.com/assets/images/signup-og.png',
        width: 1200,
        height: 630,
        alt: 'Sign Up - Holy Church',
      },
    ],
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

const SignUpPage = () => {
  return <SignUp />;
};

export default SignUpPage;
