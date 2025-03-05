import SignUp from '@/modules/auth/sign-up';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign Up | Identity Impact Hub',
  description:
    'Join Identity Impact Hub today and become part of a global network of innovators, leaders, and changemakers.',
  keywords: [
    'Identity Impact Hub Sign Up',
    'Join Identity Impact Hub',
    'Social Innovation Network',
    'Leadership Community',
    'Impact-Driven Entrepreneurship',
  ],
  openGraph: {
    title: 'Sign Up | Identity Impact Hub',
    description:
      'Create your account at Identity Impact Hub and start making an impact today.',
    url: 'https://identityimpacthub.com/signup',
    images: [
      {
        url: 'https://identityimpacthub.com/assets/images/signup-og.png',
        width: 1200,
        height: 630,
        alt: 'Sign Up - Identity Impact Hub',
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
