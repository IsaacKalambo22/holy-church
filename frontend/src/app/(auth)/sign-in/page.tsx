import SignIn from '@/modules/auth/sign-in';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In | Holy Church',
  description:
    'Access your Holy Church account and connect with a global community of changemakers and innovators.',
  keywords: [
    'Holy Church Login',
    'Sign In Holy Church',
    'Social Impact Network',
    'Entrepreneurship Platform',
    'Leadership Community',
  ],
  openGraph: {
    title: 'Sign In | Holy Church',
    description:
      'Log in to your Holy Church account and continue your journey of impact and innovation.',
    url: 'https://holychurch.com/signin',
    images: [
      {
        url: 'https://holychurch.com/assets/images/signin-og.png',
        width: 1200,
        height: 630,
        alt: 'Sign In - Holy Church',
      },
    ],
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

const SignInPage = () => {
  return <SignIn />;
};

export default SignInPage;
