import SignIn from '@/modules/auth/sign-in';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In | Identity Impact Hub',
  description:
    'Access your Identity Impact Hub account and connect with a global community of changemakers and innovators.',
  keywords: [
    'Identity Impact Hub Login',
    'Sign In Identity Impact Hub',
    'Social Impact Network',
    'Entrepreneurship Platform',
    'Leadership Community',
  ],
  openGraph: {
    title: 'Sign In | Identity Impact Hub',
    description:
      'Log in to your Identity Impact Hub account and continue your journey of impact and innovation.',
    url: 'https://identityimpacthub.com/signin',
    images: [
      {
        url: 'https://identityimpacthub.com/assets/images/signin-og.png',
        width: 1200,
        height: 630,
        alt: 'Sign In - Identity Impact Hub',
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
