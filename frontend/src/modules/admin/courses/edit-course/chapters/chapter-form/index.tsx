'use client';

import {
  Loader2,
  PlusCircle,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { reorderCourseChapters } from '@/modules/admin/actions';
import { toast } from 'sonner';
import { ChaptersList } from '../chapters-list';

interface ChaptersFormProps {
  initialData: Course;
  courseId: string;
}

export const ChaptersForm = ({
  initialData,
  courseId,
}: ChaptersFormProps) => {
  const [isUpdating, setIsUpdating] =
    useState(false);

  const onEdit = (id: string) => {
    router.push(
      `/admin/courses/edit/${courseId}/chapters/${id}`
    );
  };

  const router = useRouter();

  const onReorder = async (
    updateData: { id: string; position: number }[]
  ) => {
    setIsUpdating(true);
    const result = await reorderCourseChapters(
      updateData,
      courseId,
      '/'
    );

    if (result.success) {
      router.push(
        `/admin/courses/edit/${result?.data?.id}`,
        { scroll: false }
      );
      toast.success(
        'Chapters ordered successfully'
      );
    } else {
      toast.error(
        result.error ?? 'An error occurred.'
      );
    }
    router.refresh();
    setIsUpdating(false);
  };

  return (
    <div className='relative mt-6 border bg-slate-100 rounded-md p-4 dark:bg-gray-800'>
      {isUpdating && (
        <div className='absolute h-full w-full bg-slate-500/20 top-0 right-0 rounded-m flex items-center justify-center'>
          <Loader2 className='animate-spin h-6 w-6 text-sky-700' />
        </div>
      )}
      <div className='font-medium flex items-center justify-between'>
        Course chapters
        <Button
          onClick={() =>
            router.push(
              `/admin/courses/edit/${courseId}/chapters/new`
            )
          }
          variant='ghost'
        >
          <PlusCircle className='h-4 w-4 mr-2' />
          Add a chapter
        </Button>
      </div>

      <div
        className={cn(
          'text-sm mt-2',
          !initialData?.chapters?.length &&
            'text-slate-500 italic'
        )}
      >
        {!initialData?.chapters?.length &&
          'No chapters'}
        <ChaptersList
          onEdit={onEdit}
          onReorder={onReorder}
          items={initialData.chapters ?? []}
        />
      </div>

      <p className='text-xs text-muted-foreground mt-4'>
        Drag and drop to reorder the chapters
      </p>
    </div>
  );
};
export default ChaptersForm;
