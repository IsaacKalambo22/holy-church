'use client';

import config from '@/lib/config';
import { createTransaction } from '@/modules/admin/actions';

import { revalidateCourses } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import { JsonToHtml } from '@/modules/admin/rich-text-editor/json-to-html';
import SubmitButton from '@/modules/common/submit-button';
import {
  PaymentElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import { CreditCard } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import {
  useRouter,
  useSearchParams,
} from 'next/navigation';
import React, {
  useEffect,
  useState,
} from 'react';
import { toast } from 'sonner';
import StripeProvider from './stripe-provider';

const PaymentPageContent = () => {
  const stripe = useStripe();
  const elements = useElements();

  const searchParams = useSearchParams();

  const courseId = searchParams.get('id') ?? '';
  const [course, setCourse] =
    useState<Course | null>(null);
  const { data: session } = useSession();
  const [isLoading, setIsLoading] =
    useState(false);
  const router = useRouter();
  useEffect(() => {
    const fetchCourseDetails = async () => {
      setIsLoading(true);

      try {
        const response = await fetch(
          `${config.env.baseUrl}/courses/${courseId}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        if (!response.ok) {
          throw new Error(
            'Failed to fetch course details.'
          );
        }
        const data = await response.json();
        const course = data?.data;
        console.log({ course });

        setCourse(course);
      } catch (err) {
        console.error(
          'Error fetching course:',
          err
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (courseId) {
      fetchCourseDetails();
    }
  }, [courseId]);
  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();
    setIsLoading(true);

    if (!stripe || !elements) {
      toast.error(
        'Stripe service is not available.'
      );
      setIsLoading(false);
      return;
    }

    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_API_ENDPOINT;

      const result = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${baseUrl}/user/checkout?step=3&id=${courseId}`,
        },
        redirect: 'if_required', // Set to 'always' to force redirection.
      });

      if (result.error) {
        console.error(
          'Payment Error:',
          result.error
        );
        toast.error(
          result.error.message ||
            'Payment failed. Please try again.'
        );
      } else {
        const paymentIntent =
          result.paymentIntent;
        if (
          result.paymentIntent?.status ===
          'succeeded'
        ) {
          console.log(
            'Payment Intent:',
            paymentIntent
          );

          // Build the transaction payload
          const payload: Partial<Transaction> = {
            transactionId: paymentIntent.id,
            userId: session?.id, // Ensure this maps to your session structure.
            courseId: courseId,
            paymentProvider: 'stripe',
            amount: course?.price || 0,
          };

          // Save the transaction
          await createTransaction(payload);
          router.push(`/course/${courseId}`);
          // router.push(
          //   `/user/checkout?step=3&id=${courseId}`
          // );
          // navigateToStep(3); // Navigate to the next step
          toast.success(
            'Payment processed successfully!'
          );
        }
      }
    } catch (err) {
      console.error(
        'Error confirming payment:',
        err
      );
      toast.error(
        'An error occurred during the payment process. Please try again.'
      );
    } finally {
      await revalidateCourses();
      setIsLoading(false);
    }
  };

  if (!course) return null;
  return (
    <div className='flex flex-col w-full sm:px-4'>
      <div className='sm:flex gap-10 mb-6'>
        {/* Order Summary */}
        <div className='basis-1/2 rounded-lg flex flex-col gap-4'>
          <div className='flex flex-col gap-2'>
            <h1 className='text-md text-muted-foreground'>
              {course.title}
            </h1>
            <h1 className='text-2xl font-semibold'>
              {formatPrice(course.price)}
            </h1>
          </div>
          <div className='relative w-auto pt-[56.25%]'>
            <Image
              src={
                course.imageUrl ||
                '/assets/images/placeholder.png'
              }
              alt={course.title}
              fill
              sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
              className='object-cover transition-transform rounded-xl'
              unoptimized
              loading='lazy'
            />
          </div>
          <JsonToHtml
            json={JSON.parse(
              course.description || '{}'
            )}
          />{' '}
        </div>

        {/* Payment Form */}
        <div className='basis-1/2 max-sm:mt-6'>
          <form
            id='payment-form'
            onSubmit={handleSubmit}
          >
            <div className='flex flex-col gap-4 rounded-lg'>
              <p className='text-sm text-gray-400'>
                Fill out the payment details below
                to complete your purchase.
              </p>

              <div className='flex flex-col gap-2 w-full'>
                <h3 className='text-md'>
                  Payment Method
                </h3>

                <div className='flex flex-col border-[2px] border-white-100/5 rounded-lg'>
                  <div className='flex items-center gap-2 bg-white-50/5 py-2 px-2'>
                    <CreditCard size={24} />
                    <span>Credit/Debit Card</span>
                  </div>
                  <div className='px-4 py-6'>
                    <PaymentElement />
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className='flex w-full justify-end sm:px-10 mt-4'>
              <SubmitButton
                disabled={
                  stripe == null ||
                  elements == null
                }
                isLoading={isLoading}
                loadingText='Processing...'
              >
                Pay with Credit Card
              </SubmitButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const Payment = () => (
  <StripeProvider>
    <PaymentPageContent />
  </StripeProvider>
);

export default Payment;
