'use client';

import config from '@/lib/config';
import { createStripePaymentIntent } from '@/modules/admin/actions';
import CustomLoader from '@/modules/common/custom-loader';
import { Elements } from '@stripe/react-stripe-js';
import {
  Appearance,
  loadStripe,
  StripeElementsOptions,
} from '@stripe/stripe-js';
import { useSearchParams } from 'next/navigation';
import React, {
  useEffect,
  useState,
} from 'react';

if (!process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY) {
  throw new Error(
    'NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not set'
  );
}

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY
);

const appearance: Appearance = {
  theme: 'stripe',
  variables: {
    colorPrimary: '#0570de',
    colorBackground: '#18181b',
    colorText: '#d2d2d2',
    colorDanger: '#df1b41',
    colorTextPlaceholder: '#6e6e6e',
    fontFamily: 'Inter, system-ui, sans-serif',
    spacingUnit: '3px',
    borderRadius: '10px',
    fontSizeBase: '14px',
  },
};

const StripeProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [clientSecret, setClientSecret] =
    useState<string | ''>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<
    string | null
  >(null);
  const searchParams = useSearchParams();
  const courseId = searchParams.get('id') ?? '';

  useEffect(() => {
    const fetchDetailsAndPaymentIntent =
      async () => {
        if (!courseId) {
          setError('Course ID is missing.');
          setLoading(false);
          return;
        }

        try {
          // Fetch course details
          const courseResponse = await fetch(
            `${config.env.baseUrl}/courses/${courseId}`,
            {
              method: 'GET',
              headers: {
                'Content-Type':
                  'application/json',
              },
            }
          );

          if (!courseResponse.ok) {
            throw new Error(
              'Failed to fetch course details.'
            );
          }

          const courseData =
            await courseResponse.json();
          const course = courseData?.data;

          if (!course || !course.price) {
            throw new Error(
              'Course details or price are missing.'
            );
          }

          // Fetch payment intent
          const payload = {
            amount: course.price,
          };
          const paymentIntentResult =
            await createStripePaymentIntent(
              payload
            );
          console.log({ paymentIntentResult });
          if (
            !paymentIntentResult?.data
              ?.clientSecret
          ) {
            throw new Error(
              'Failed to create Stripe payment intent.'
            );
          }

          setClientSecret(
            paymentIntentResult.data.clientSecret
          );
        } catch (err: any) {
          console.error('Error:', err);
          setError(
            err.message || 'An error occurred.'
          );
        } finally {
          setLoading(false);
        }
      };

    fetchDetailsAndPaymentIntent();
  }, [courseId]);

  const options: StripeElementsOptions = {
    clientSecret,
    appearance,
  };

  if (loading) return <CustomLoader />;
  if (error)
    return (
      <div className='text-red-500'>{error}</div>
    );

  return (
    <Elements
      stripe={stripePromise}
      options={options}
      key={clientSecret}
    >
      {children}
    </Elements>
  );
};

export default StripeProvider;
