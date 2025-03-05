'use client';
import { Form } from '@/components/ui/form';
import useCustomPath from '@/hooks/use-custom-path';
import { toast } from '@/hooks/use-toast';
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
import { useSession } from 'next-auth/react';
import {
  usePathname,
  useRouter,
} from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as zod from 'zod';
import { updateUser } from '../../../actions';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  refetch: () => void; // Accept refetch function as prop
};

const ModalEditProfile = ({
  isOpen,
  onClose,
  refetch,
}: Props) => {
  const { data: session } = useSession(); // Get session data

  const path = usePathname();
  const { fullPath } = useCustomPath(path);
  useState<User | null>(null); // State to hold user details
  const [isLoading, setIsLoading] =
    useState(false);
  const router = useRouter();
  const [imageStates, setImageStates] = useState<
    FileState[]
  >([]);

  const formSchema = zod.object({
    name: zod
      .string()

      .optional(),
    district: zod
      .string()

      .optional(),

    about: zod
      .string()

      .optional(),
    email: zod
      .string()
      //   .email('Invalid email address.')
      .optional(),

    phoneNumber: zod
      .string()
      //   .regex(phoneNumberRegex, {
      //     message:
      //       'Phone number must be in a valid international format.',
      //   })
      .optional(),
  });

  const form = useForm<
    zod.infer<typeof formSchema>
  >({
    resolver: zodResolver(formSchema),
    mode: 'onTouched',
    defaultValues: {
      name: '',
      email: '',
      phoneNumber: '',
      district: '',
      about: '',
    },
  });

  const onSubmit = async (
    values: zod.infer<typeof formSchema>
  ) => {
    setIsLoading(true);
    console.log({ values });
    try {
      let avatar: string | null = '';

      if (imageStates.length > 0) {
        const imageUrls = await Promise.all(
          imageStates.map(async (fileState) =>
            handleFileUpload(
              fileState.file,
              (progress) =>
                updateFileProgress(
                  fileState.key,
                  progress,
                  setImageStates
                )
            )
          )
        );
        avatar = imageUrls[0];
      }

      const payload = {
        name: values.name ?? '',
        email: values.email ?? '',
        district: values.district ?? '',
        about: values.about ?? '',
        phoneNumber: values.phoneNumber ?? '',
        avatar,
      };
      await updateUser(
        payload,
        session?.id || '', // Pass the session user ID
        fullPath
      );

      toast({
        title: 'Success',
        description: `${values.name} has been updated successfully.`,
      });
      refetch();
      onClose();
      router.push('/admin/profile');
    } catch (error) {
      console.error(
        'Error updating user:',
        error
      );
      toast({
        title: 'Error',
        description:
          'An error occurred while updating the user.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      name={`Edit Profile`}
    >
      <Form {...form}>
        <form
          className='flex flex-col gap-5 w-full'
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            name='name'
            label='Full name'
            control={form.control}
            placeholder='John Doe'
          />

          <CustomFormField
            fieldType={FormFieldType.INPUT}
            name='email'
            label='Email'
            control={form.control}
            placeholder='johndoe@gmail.com'
          />

          <CustomFormField
            fieldType={FormFieldType.PHONE_INPUT}
            name='phoneNumber'
            label='Phone Number'
            control={form.control}
            placeholder='Enter phone number'
          />
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            name='district'
            label='District'
            control={form.control}
            placeholder='Enter your district'
          />
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            name='about'
            label='About'
            control={form.control}
            placeholder='Write something about yourself...'
          />

          <div className='w-full flex flex-col gap-4'>
            <label className='font-medium text-gray-700'>
              Upload Image
            </label>
            <MultiFileDropzone
              value={imageStates}
              onChange={setImageStates}
              fileType='image/*'
              maxFiles={1}
            />
          </div>

          <SubmitButton
            disabled={
              isLoading || !form.formState.isValid
            }
            isLoading={isLoading}
            className='w-full  h-9'
            loadingText='Updating...'
          >
            Update
          </SubmitButton>
        </form>
      </Form>
    </Modal>
  );
};

export default ModalEditProfile;
