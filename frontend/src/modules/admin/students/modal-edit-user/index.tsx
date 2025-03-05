'use client';

import { Form } from '@/components/ui/form';
import { SelectItem } from '@/components/ui/select';
import useCustomPath from '@/hooks/use-custom-path';
import { toast } from '@/hooks/use-toast';
import { Role, documentProps } from '@/lib/api';
import CustomFormField, {
  FormFieldType,
} from '@/modules/common/custom-form-field';
import SubmitButton from '@/modules/common/submit-button';
import { zodResolver } from '@hookform/resolvers/zod';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as zod from 'zod';
import { updatedocument } from '../../actions';
import Modal from '../../modal';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  document: documentProps;
};

const ModalEditUser = ({
  isOpen,
  onClose,
  document,
}: Props) => {
  const [isLoading, setIsLoading] =
    useState(false);

  const path = usePathname();
  const { fullPath } = useCustomPath(path);

  const roleOptions = Object.values(Role);

  const phoneNumberRegex = /^\+?[1-9]\d{1,14}$/;

  const formSchema = zod.object({
    name: zod
      .string()
      .min(
        2,
        'Name must be at least 2 characters.'
      )
      .optional(),
    email: zod
      .string()
      .email('Invalid email address.')
      .optional(),
    phoneNumber: zod
      .string()
      .regex(phoneNumberRegex, {
        message:
          'Phone number must be in a valid international format.',
      })
      .optional(),
    role: zod
      .nativeEnum(Role, {
        errorMap: () => ({
          message: 'Invalid role.',
        }),
      })
      .optional(),
  });

  const form = useForm<
    zod.infer<typeof formSchema>
  >({
    resolver: zodResolver(formSchema),
    mode: 'onTouched',
    defaultValues: {
      name: document.name || '',
      email: document.email || '',
      phoneNumber: document.phoneNumber || '',
      role: document.role,
    },
  });

  const onSubmit = async (
    values: zod.infer<typeof formSchema>
  ) => {
    setIsLoading(true);
    const payload = {
      name: values.name || undefined,
      email: values.email || undefined,
      phoneNumber:
        values.phoneNumber || undefined,
      role: values.role || undefined,
    };
    try {
      // Send the values directly as a JSON object
      await updatedocument(
        payload,
        document.id, // Assuming `document.id` is the unique identifier for the document
        fullPath
      );

      toast({
        title: 'Success',
        description: `${document.name} has been updated successfully.`,
      });
      onClose();
    } catch (error) {
      console.error(
        'Error updating document:',
        error
      );
      toast({
        title: 'Error',
        description:
          'An error occurred while updating the document.',
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
      name={`Edit ${document.name}`}
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='flex flex-col gap-5 w-full'
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
            fieldType={FormFieldType.SELECT}
            name='role'
            label='Role'
            control={form.control}
            placeholder='Select a role'
          >
            {roleOptions.map((role) => (
              <SelectItem key={role} value={role}>
                {role}
              </SelectItem>
            ))}
          </CustomFormField>
          <CustomFormField
            fieldType={FormFieldType.PHONE_INPUT}
            name='phoneNumber'
            label='Phone Number'
            control={form.control}
            placeholder='Enter phone number'
          />
          <SubmitButton
            disabled={
              isLoading || !form.formState.isValid
            }
            isLoading={isLoading}
            loadingText='Updating...'
            className='w-full h-9'
          >
            Update
          </SubmitButton>
        </form>
      </Form>
    </Modal>
  );
};

export default ModalEditUser;
