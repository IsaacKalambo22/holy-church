'use client';

import {
  AlertTriangle,
  Loader2,
  Lock,
} from 'lucide-react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';

import ConfettiComponent from '@/hooks/use-confetti';
import { revalidateCourses } from '@/lib/api';
import { updateUserCourseProgress } from '@/modules/admin/actions';
import { toast } from 'sonner';

// Lazy load ReactPlayer to avoid hydration errors
const ReactPlayer = dynamic(
  () => import('react-player'),
  { ssr: false }
);

interface VideoPlayerProps {
  playbackId?: string | null;
  courseId: string;
  chapterId: string;
  nextChapterId?: string;
  isLocked: boolean;
  completeOnEnd: boolean;
  title: string;
}

export const VideoPlayer = ({
  playbackId,
  courseId,
  chapterId,
  nextChapterId,
  isLocked,
  completeOnEnd,
}: VideoPlayerProps) => {
  const [isReady, setIsReady] = useState(false);
  const [showConfetti, setShowConfetti] =
    useState(false);
  const router = useRouter();
  const playerRef =
    useRef<typeof ReactPlayer>(null);

  const onEnd = async () => {
    try {
      if (completeOnEnd) {
        const payload = { isCompleted: true };
        const result =
          await updateUserCourseProgress(
            payload,
            chapterId,
            '/course'
          );

        if (!nextChapterId) {
          setShowConfetti(true);
          setTimeout(
            () => setShowConfetti(false),
            6000
          );
          await revalidateCourses();
        }

        if (result.success) {
          toast.success('Progress updated');
        } else {
          toast.error(
            result.error ?? 'An error occurred.'
          );
        }

        if (nextChapterId) {
          router.push(
            `/course/${courseId}/chapters/${nextChapterId}`
          );
        }
      }
    } catch {
      toast.error('Something went wrong');
    }
    router.refresh();
  };

  return (
    <>
      {showConfetti && <ConfettiComponent />}
      <div className='relative aspect-video'>
        {/* Loading Indicator */}
        {!isReady && !isLocked && (
          <div className='absolute inset-0 flex items-center justify-center bg-slate-800 dark:bg-slate-200'>
            <Loader2 className='h-8 w-8 animate-spin text-secondary' />
          </div>
        )}

        {/* Locked Chapter Message */}
        {isLocked && (
          <div className='absolute inset-0 flex items-center justify-center bg-slate-800 dark:bg-slate-200 flex-col gap-y-2 text-secondary'>
            <Lock className='h-8 w-8' />
            <p className='text-sm'>
              This chapter is locked
            </p>
          </div>
        )}

        {/* No Playback ID Warning */}
        {!isLocked && !playbackId && (
          <div className='absolute inset-0 flex flex-col items-center justify-center bg-slate-800 dark:bg-slate-200 text-secondary p-4 text-center'>
            <AlertTriangle className='h-8 w-8 text-yellow-500' />
            <p className='text-sm mt-2'>
              No video available for this chapter.
            </p>
          </div>
        )}

        {/* Video Player */}
        {!isLocked && !!playbackId && (
          <ReactPlayer
            ref={playerRef}
            url={String(playbackId)}
            width='100%'
            height='100%'
            controls
            playing={isReady}
            onReady={() => setIsReady(true)}
            onEnded={onEnd}
            config={{
              file: {
                attributes: {
                  controlsList: 'nodownload',
                },
              },
            }}
          />
        )}
      </div>
    </>
  );
};
