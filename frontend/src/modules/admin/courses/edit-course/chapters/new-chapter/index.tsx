'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
} from '@/components/ui/form';
import {
  handleFileUpload,
  updateFileProgress,
} from '@/lib/utils';
import { createCourseChapter } from '@/modules/admin/actions';
import CustomRichTextEditor from '@/modules/admin/rich-text-editor/custom-rich-text-editor';
import { chapterSchemaValidation } from '@/modules/admin/validation';
import CustomFormField, {
  FormFieldType,
} from '@/modules/common/custom-form-field';
import {
  FileState,
  MultiFileDropzone,
} from '@/modules/common/multiple-file-upload';
import SubmitButton from '@/modules/common/submit-button';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const NewChapter = ({
  courseId,
}: {
  courseId: string;
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] =
    useState(false);
  const [fileStates, setFileStates] = useState<
    FileState[]
  >([]);

  const form = useForm<
    z.infer<typeof chapterSchemaValidation>
  >({
    resolver: zodResolver(
      chapterSchemaValidation
    ),
    mode: 'onSubmit',
    defaultValues: {
      title: '',
      description: '',
      content: '',
      isFree: false,
      isPublished: false,
    },
  });

  const isFormComplete =
    form.watch('title')?.trim() !== '' &&
    form.watch('description')?.trim() !== '' &&
    form.watch('content')?.trim() !== '' &&
    fileStates.length > 0;

  const onSubmit = async (
    values: z.infer<
      typeof chapterSchemaValidation
    >
  ) => {
    console.log({ values });
    setIsLoading(true);

    if (fileStates.length === 0) {
      toast.error(
        'Please upload at least one video file.'
      );
      setIsLoading(false);
      return;
    }

    const uploadedFileUrls = await Promise.all(
      fileStates.map(async (fileState) =>
        handleFileUpload(
          fileState.file,
          (progress) =>
            updateFileProgress(
              fileState.key,
              progress,
              setFileStates
            )
        )
      )
    );

    const payload = {
      title: values.title,
      description: values.description,
      content: values.content,
      isFree: values.isFree,
      isPublished: values.isPublished,
      videoUrl: uploadedFileUrls[0],
    };

    const result = await createCourseChapter(
      payload,
      courseId,
      '/admin/courses/edit/[courseId]'
    );

    if (result.success) {
      toast.success(
        'New chapter added successfully'
      );
      router.refresh();

      router.push(
        `/admin/courses/edit/${courseId}`
      );
    } else {
      toast.error(
        result.error ?? 'An error occurred.'
      );
    }

    setIsLoading(false);
  };

  return (
    <div className='max-w-6xl mx-auto p-6 space-y-6'>
      {/* Top Section */}
      <div className='flex items-center gap-4'>
        <Button
          type='button'
          variant='outline'
          onClick={(e) => {
            e.preventDefault();
            router.back();
          }}
          className='flex items-center gap-2'
        >
          <ArrowLeft className='w-4 h-4' />
          Back
        </Button>
        <h1 className='text-2xl font-medium'>
          Create New Chapter
        </h1>
      </div>

      {/* Form Section */}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='space-y-6'
        >
          {/* Title */}
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            name='title'
            label='Chapter Title'
            control={form.control}
            placeholder='Enter chapter title'
          />

          {/* Description */}
          <CustomFormField
            fieldType={FormFieldType.SKELETON}
            control={form.control}
            name='description'
            label='Description'
            renderSkeleton={(field) => (
              <FormControl>
                <CustomRichTextEditor
                  field={field}
                />
              </FormControl>
            )}
          />

          {/* Content */}
          <CustomFormField
            fieldType={FormFieldType.SKELETON}
            control={form.control}
            name='content'
            label='Chapter Content'
            renderSkeleton={(field) => (
              <FormControl>
                <CustomRichTextEditor
                  field={field}
                />
              </FormControl>
            )}
          />

          {/* Free & Publish Checkboxes */}
          <div className='space-y-2'>
            <CustomFormField
              fieldType={FormFieldType.CHECKBOX}
              control={form.control}
              name='isFree'
              label='Allow free preview for this chapter'
            />
            <CustomFormField
              fieldType={FormFieldType.CHECKBOX}
              control={form.control}
              name='isPublished'
              disabled={!isFormComplete}
              label='Publish this chapter'
            />
          </div>

          {/* Video Upload */}
          <div className='space-y-2'>
            <label className='font-medium text-gray-700'>
              Upload Chapter Video
            </label>
            <MultiFileDropzone
              value={fileStates}
              onChange={setFileStates}
              fileType='video/*'
              maxFiles={1}
            />
          </div>

          {/* Buttons */}
          <div className='flex justify-end gap-3 pt-4'>
            <Button
              type='button'
              variant='outline'
              onClick={(e) => {
                e.preventDefault();
                router.back();
              }}
            >
              Cancel
            </Button>
            <SubmitButton
              disabled={isLoading}
              isLoading={isLoading}
              className='h-9'
              loadingText='Saving...'
            >
              Save
            </SubmitButton>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default NewChapter;
