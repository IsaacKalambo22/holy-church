'use client';

import { Form } from '@/components/ui/form';
import useCustomPath from '@/hooks/use-custom-path';
import {
  handleFileUpload,
  updateFileProgress,
} from '@/lib/utils';
import CustomFormField, {
  FormFieldType,
} from '@/modules/common/custom-form-field';
import Modal from '@/modules/common/modal';
import {
  FileState,
  MultiFileDropzone,
} from '@/modules/common/multiple-file-upload';
import SubmitButton from '@/modules/common/submit-button';
import { zodResolver } from '@hookform/resolvers/zod';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as zod from 'zod';
import { createGallery } from '../../actions';
type Props = {
  isOpen: boolean;
  onClose: () => void;
  id?: string | null;
};

const ModalNewGallery = ({
  isOpen,
  onClose,
}: Props) => {
  const [isLoading, setIsLoading] =
    useState(false);
  const [fileStates, setFileStates] = useState<
    FileState[]
  >([]);
  const path = usePathname();
  const { fullPath } = useCustomPath(path);

  const formSchema = zod.object({
    caption: zod
      .string()
      .min(2, {
        message:
          'Caption must be at least 2 characters.',
      })
      .max(50, {
        message:
          'Caption must not be more than 50 characters.',
      }),
    date: zod
      .date()
      .refine((value) => value !== null, {
        message: 'Date is required.',
      }),
  });

  const form = useForm<
    zod.infer<typeof formSchema>
  >({
    resolver: zodResolver(formSchema),
    mode: 'all',
    defaultValues: {
      caption: '',
      date: new Date(),
    },
  });
  const onSubmit = async (
    values: zod.infer<typeof formSchema>
  ) => {
    setIsLoading(true);

    if (fileStates.length === 0) {
      toast.error(
        'Please upload at least one image file.'
      );
      setIsLoading(false);
      return;
    }

    let imageUrls;
    if (fileStates.length > 0) {
      const uploadUrls = await Promise.all(
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
      imageUrls = uploadUrls;
    }
    // Create a JSON object to send
    const payload = {
      date: values.date,
      caption: values.caption,
      imageUrls,
    };
    console.log({ payload });

    const result = await createGallery(
      payload,
      fullPath,
      '/admin'
    );

    onClose();
    if (result.success) {
      toast.success(
        'New gallery created successfully'
      );
    } else {
      toast.error(
        result.error ?? 'An error occurred.'
      );
    }
    setIsLoading(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      name='Add New Gallery'
    >
      <Form {...form}>
        <form
          className='flex flex-col gap-5 w-full'
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            name='caption'
            label='Caption'
            control={form.control}
            placeholder='Enter caption'
          />
          <CustomFormField
            fieldType={FormFieldType.DATE_PICKER}
            name='date'
            label='Gallery Date'
            control={form.control}
            placeholder='Select an gallery date'
            dateFormat='dd/MM/yyyy'
            showTimeSelect={false}
          />

          <div className='w-full flex flex-col gap-4'>
            <label className='font-medium text-gray-700'>
              Upload images
            </label>
            <MultiFileDropzone
              value={fileStates}
              onChange={setFileStates}
              fileType='image/*'
              maxFiles={3}
            />
          </div>

          <SubmitButton
            disabled={
              isLoading || !form.formState.isValid
            }
            isLoading={isLoading}
            className='w-full  h-9'
            loadingText='Saving...'
          >
            Save
          </SubmitButton>
        </form>
      </Form>
    </Modal>
  );
};

export default ModalNewGallery;
