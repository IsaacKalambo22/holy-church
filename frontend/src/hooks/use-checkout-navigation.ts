'use client';

import { useSession } from 'next-auth/react';
import {
  useRouter,
  useSearchParams,
} from 'next/navigation';
import { useCallback, useEffect } from 'react';

export const useCheckoutNavigation = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();

  const courseId = searchParams.get('id') ?? '';
  const checkoutStep = parseInt(
    searchParams.get('step') ?? '1',
    10
  );

  const navigateToStep = useCallback(
    (step: number) => {
      const newStep = Math.min(
        Math.max(1, step),
        3
      );
      const showSignUp = session
        ? 'true'
        : 'false';

      router.push(
        `/checkout?step=${newStep}&id=${courseId}&showSignUp=${showSignUp}`,
        {
          scroll: false,
        }
      );
    },
    [courseId, session, router]
  );

  useEffect(() => {
    if (!session && checkoutStep > 1) {
      navigateToStep(1);
    }
  }, [session, checkoutStep, navigateToStep]);

  return { checkoutStep, navigateToStep };
};
