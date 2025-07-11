import ForgotPassword from '@/modules/auth/forgot-password';
import { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Forgot Password - Holy Church',
  description:
    'Access your account and manage your activities with TAMA Farmers Trust.',
};

const ForgotPasswordPage = () => {
  return <ForgotPassword />;
};

export default ForgotPasswordPage;
