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
import { X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import CustomModal from '../../../custom-modal';
type Props = {
  isOpen: boolean;
  onClose: () => void;
  courseId: string;
};
const NewChapterModal = ({
  isOpen,
  onClose,
  courseId,
}: Props) => {
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
      setIsLoading(false); // Stop the loading process
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
      '/admin/courses'
    );

    if (result.success) {
      router.refresh();
      toast.success(
        'New chapter added successfully'
      );
      onClose();
    } else {
      toast.error(
        result.error ?? 'An error occurred.'
      );
    }
    setIsLoading(false);
  };
  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className='flex flex-col'>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-2xl font-bold'>
            Add New Chapter
          </h2>
          <button
            onClick={onClose}
            className='text-gray-500 hover:text-gray-700'
          >
            <X className='w-6 h-6' />
          </button>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-4'
          >
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              name='title'
              label='Title'
              control={form.control}
              placeholder='Enter chapter title'
            />

            <CustomFormField
              fieldType={FormFieldType.TEXTAREA}
              name='description'
              label='Description'
              control={form.control}
              placeholder='Write chapter description'
            />
            <CustomFormField
              fieldType={FormFieldType.SKELETON}
              control={form.control}
              name='content'
              label='Content'
              renderSkeleton={(field) => (
                <FormControl>
                  <CustomRichTextEditor
                    field={field}
                  />
                </FormControl>
              )}
            />
            {/* <CustomFormField
              fieldType={FormFieldType.TEXTAREA}
              name='content'
              label='Content'
              control={form.control}
              placeholder='Write chapter content'
            /> */}
            <CustomFormField
              fieldType={FormFieldType.CHECKBOX}
              control={form.control}
              name='isFree'
              label='Check this box to make this chapter free for preview'
            />
            <CustomFormField
              fieldType={FormFieldType.CHECKBOX}
              control={form.control}
              name='isPublished'
              disabled={!isFormComplete}
              label='Check this box to publish this chapter'
            />
            <div className='w-full flex flex-col gap-4'>
              <label className='font-medium text-gray-700'>
                Upload chapter video
              </label>
              <MultiFileDropzone
                value={fileStates}
                onChange={setFileStates}
                fileType='video/*'
                maxFiles={1}
              />
            </div>
            <div className='flex justify-end space-x-2 mt-6'>
              <Button
                type='button'
                variant='outline'
                onClick={onClose}
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
    </CustomModal>
  );
};

export default NewChapterModal;
