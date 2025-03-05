'use client';
import {
  PlusCircle,
  TrashIcon,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import {
  getFileType,
  handleFileUpload,
  updateFileProgress,
} from '@/lib/utils';
import { createCourseAttachment } from '@/modules/admin/actions';
import CustomFormField, {
  FormFieldType,
} from '@/modules/common/custom-form-field';
import {
  FileState,
  MultiFileDropzone,
} from '@/modules/common/multiple-file-upload';
import SubmitButton from '@/modules/common/submit-button';
import Thumbnail from '@/modules/common/thumbnail';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import ModalDeleteAttachment from '../modal-delete-attachment';

interface AttachmentFormProps {
  initialData: Course;
  courseId: string;
}

const formSchema = z.object({
  name: z
    .string()
    .min(1, 'Attachment filename is required'),
});

export const AttachmentForm = ({
  initialData,
  courseId,
}: AttachmentFormProps) => {
  const [isLoading, setIsLoading] =
    useState(false);
  const [isEditing, setIsEditing] =
    useState(false);
  const [deletingId, setDeletingId] = useState<
    string | null
  >(null);
  const [fileStates, setFileStates] = useState<
    FileState[]
  >([]);
  const [isModalOpen, setIsModalOpen] =
    useState(false);

  const toggleEdit = () =>
    setIsEditing((current) => !current);

  const router = useRouter();
  const form = useForm<
    z.infer<typeof formSchema>
  >({
    resolver: zodResolver(formSchema),
    mode: 'onSubmit',
    defaultValues: {
      name: '',
    },
  });
  const onSubmit = async (
    values: z.infer<typeof formSchema>
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
      name: values.name,
      url: uploadedFileUrls[0],
    };

    const result = await createCourseAttachment(
      payload,
      courseId,
      '/admin/courses/edit/[courseId]'
    );

    if (result.success) {
      toggleEdit();
      router.refresh();
      toast.success(
        'New attachment added successfully'
      );
    } else {
      toast.error(
        result.error ?? 'An error occurred.'
      );
    }
    setIsLoading(false);
  };

  return (
    <div className='mt-6 border bg-slate-100 rounded-md p-4 dark:bg-gray-800 dark:text-slate-300'>
      <div className='font-medium flex items-center justify-between'>
        Course attachments
        <Button
          onClick={toggleEdit}
          variant='ghost'
        >
          {isEditing && <>Cancel</>}
          {!isEditing && (
            <>
              <PlusCircle className='h-4 w-4 mr-2' />
              Add a file
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <>
          {initialData.attachments &&
            initialData.attachments.length ===
              0 && (
              <p className='text-sm mt-2 text-slate-500 italic'>
                No attachments yet
              </p>
            )}
          {initialData.attachments &&
            initialData.attachments.length >
              0 && (
              <div className='space-y-2'>
                {initialData.attachments.map(
                  (attachment) => {
                    const { type, extension } =
                      getFileType(attachment.url);
                    return (
                      <div
                        key={attachment.id}
                        className='flex items-center px-3 py-2 w-full bg-sky-100 border-sky-200 border text-sky-700 rounded-md dark:bg-slate-700 dark:border-slate-600 dark:text-slate-300'
                      >
                        <Thumbnail
                          type={type}
                          extension={extension}
                          url={attachment.url}
                          imageClassName='h-9 w-9'
                        />
                        <a
                          href={attachment.url}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='text-sm line-clamp-1 hover:underline '
                        >
                          {attachment.name}
                        </a>

                        <Button
                          variant='ghost'
                          size='icon'
                          onClick={(e) => {
                            e.preventDefault();
                            setDeletingId(
                              attachment.id
                            );
                            setIsModalOpen(true);
                          }}
                          className='ml-auto transition'
                        >
                          <TrashIcon className='h-4 w-4' />
                        </Button>
                      </div>
                    );
                  }
                )}
              </div>
            )}
        </>
      )}
      {isEditing && (
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(
                onSubmit
              )}
              className='space-y-4'
            >
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                name='name'
                label='File Name'
                control={form.control}
                placeholder='Enter attachment name'
              />
              <div className='w-full flex flex-col gap-4'>
                <label className='font-medium text-gray-700'>
                  Upload chapter documents (PDFs,
                  Word, Text files)
                </label>
                <MultiFileDropzone
                  value={fileStates}
                  onChange={setFileStates}
                  fileType='application/pdf,.doc,.docx,.txt,.xls,.xlsx,.ppt,.pptx'
                  maxFiles={1}
                />
              </div>
              <div className='text-xs text-muted-foreground mt-4'>
                Add anything your students might
                need to complete the course.
              </div>
              <div className='flex justify-end space-x-2 mt-6'>
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
      )}
      {isModalOpen && deletingId && (
        <ModalDeleteAttachment
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          attachment={initialData.attachments.find(
            (attachment) =>
              attachment.id === deletingId
          )}
          courseId={courseId}
        />
      )}
    </div>
  );
};
