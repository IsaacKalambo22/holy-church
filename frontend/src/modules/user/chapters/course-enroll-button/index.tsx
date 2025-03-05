'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface CourseEnrollButtonProps {
  price: number;
  courseId: string;
}

export const CourseEnrollButton = ({
  price,
  courseId,
}: CourseEnrollButtonProps) => {
  const [isLoading, setIsLoading] =
    useState(false);
  const router = useRouter();
  const onClick = async () => {
    try {
      setIsLoading(true);

      //   const response = await axios.post(
      //     `/api/courses/${courseId}/checkout`
      //   );

      window.location.assign(
        `/user/checkout?step=2&id=${courseId}`
      );
      router.push(
        `/user/checkout?step=2&id=${courseId}`
      );
    } catch {
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={onClick}
      disabled={isLoading}
      size='sm'
      className='w-full md:w-auto'
    >
      Enroll for {formatPrice(price)}
    </Button>
  );
};
