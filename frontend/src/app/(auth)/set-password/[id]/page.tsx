import SetPassword from '@/modules/auth/set-password';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Set Password - Identity Impact Hub',
  description:
    'Access your account and manage your activities with Identity Impact Hub.',
};

interface SetPasswordProps {
  params: {
    id: string; // The blog ID will be passed as a string in the params
  };
}

const SetPasswordPage = async ({
  params,
}: SetPasswordProps) => {
  const id = (await params).id; // Extract the blog ID from the params
  return <SetPassword verificationToken={id} />;
};

export default SetPasswordPage;
