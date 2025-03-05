'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { SelectItem } from '@/components/ui/select';
import useCustomPath from '@/hooks/use-custom-path';
import CustomFormField, {
  FormFieldType,
} from '@/modules/common/custom-form-field';
import SubmitButton from '@/modules/common/submit-button';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  usePathname,
  useRouter,
} from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as zod from 'zod';
import { createUser } from '../../actions';
import { createUserSchema } from '../../validation';

export enum Role {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  USER = 'USER',
}

const NewUser = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] =
    useState(false);
  const path = usePathname();
  const { fullPath } = useCustomPath(path);

  const form = useForm<
    zod.infer<typeof createUserSchema>
  >({
    resolver: zodResolver(createUserSchema),
    mode: 'all',
    defaultValues: {
      email: '',
      phoneNumber: '',
      name: '',
      role: undefined, // Set default account type to SILVER
    },
  });

  const onSubmit = async (
    values: zod.infer<typeof createUserSchema>
  ) => {
    setIsLoading(true);

    const payload = {
      email: values.email,
      phoneNumber: values.phoneNumber,
      name: values.name,
      role: values.role,
    };

    const result = await createUser(
      payload,
      fullPath,
      '/admin/users'
    );

    if (result.success) {
      router.push('/admin/users');
      toast.success(
        'New user created successfully'
      );
    } else {
      toast.error(
        result.error ?? 'An error occurred.'
      );
    }
    setIsLoading(false);
  };

  return (
    <Card className='shadow-none p-8'>
      <Form {...form}>
        <form
          className='w-full flex flex-col gap-5'
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className='grid grid-cols-1 md:grid-cols-2 gap-5 w-full'>
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              name='name'
              label='Name'
              control={form.control}
              placeholder='Enter name'
            />
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              name='email'
              label='Email'
              control={form.control}
              placeholder='Enter email'
            />
            <CustomFormField
              fieldType={
                FormFieldType.PHONE_INPUT
              }
              name='phoneNumber'
              label='Phone number'
              control={form.control}
              placeholder='Enter phone number'
            />
            <CustomFormField
              fieldType={FormFieldType.SELECT}
              name='role'
              label='Role'
              placeholder='Select role'
              control={form.control}
            >
              {Object.entries(Role).map(
                ([key, value]) => (
                  <SelectItem
                    key={key}
                    value={value}
                  >
                    {value}
                  </SelectItem>
                )
              )}
            </CustomFormField>
          </div>
          <div className='flex justify-end gap-4 h-full '>
            <Button
              variant='outline'
              onClick={() =>
                router.push('/admin/users')
              }
            >
              Cancel
            </Button>
            <SubmitButton
              disabled={
                isLoading ||
                !form.formState.isValid
              }
              isLoading={isLoading}
              className='w-auto px-4 py-2'
              loadingText='Saving...'
            >
              Save
            </SubmitButton>
          </div>
        </form>
      </Form>
    </Card>
  );
};

export default NewUser;
