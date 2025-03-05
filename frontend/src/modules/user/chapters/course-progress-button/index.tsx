'use client';

import {
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import ConfettiComponent from '@/hooks/use-confetti';
import { updateUserCourseProgress } from '@/modules/admin/actions';
import { toast } from 'sonner';

interface CourseProgressButtonProps {
  chapterId: string;
  courseId: string;
  isCompleted?: boolean;
  nextChapterId?: string;
}

export const CourseProgressButton = ({
  chapterId,
  courseId,
  isCompleted: initialCompleted, // Rename to avoid confusion
  nextChapterId,
}: CourseProgressButtonProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] =
    useState(false);
  const [isCompleted, setIsCompleted] = useState(
    initialCompleted
  ); // Local state
  const [showConfetti, setShowConfetti] =
    useState(false);
  const onClick = async () => {
    try {
      setIsLoading(true);
      setIsCompleted((prev) => !prev); // Update button state immediately

      const payload = {
        isCompleted: !isCompleted,
      };
      const result =
        await updateUserCourseProgress(
          payload,
          chapterId,
          '/course'
        );

      if (result.success) {
        toast.success('Progress updated');
      } else {
        toast.error(
          result.error ?? 'An error occurred.'
        );
        setIsCompleted((prev) => !prev); // Revert state if update fails
      }

      if (!isCompleted && !nextChapterId) {
        setShowConfetti(true);
        setTimeout(
          () => setShowConfetti(false),
          5000
        );
      }

      if (!isCompleted && nextChapterId) {
        router.push(
          `/course/${courseId}/chapters/${nextChapterId}`
        );
      }
    } catch {
      toast.error('Something went wrong');
      setIsCompleted((prev) => !prev); // Revert state on error
    } finally {
      router.refresh();
      setIsLoading(false);
    }
  };

  const Icon = isCompleted
    ? XCircle
    : CheckCircle;

  return (
    <>
      {showConfetti && <ConfettiComponent />}

      <Button
        onClick={onClick}
        disabled={isLoading}
        type='button'
        variant={
          isCompleted ? 'outline' : 'default'
        }
        className='w-full md:w-auto'
      >
        {isCompleted
          ? 'Not completed'
          : 'Mark as complete'}
        <Icon className='h-4 w-4 ml-2' />
      </Button>
    </>
  );
};
