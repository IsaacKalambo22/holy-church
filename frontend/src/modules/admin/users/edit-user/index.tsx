'use client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { SelectItem } from '@/components/ui/select';
import config from '@/lib/config';
import CustomFormField, {
  FormFieldType,
} from '@/modules/common/custom-form-field';
import CustomLoader from '@/modules/common/custom-loader';
import SubmitButton from '@/modules/common/submit-button';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import {
  useParams,
  useRouter,
} from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as zod from 'zod';
import { updateUser } from '../../actions';
import { updateUserSchema } from '../../validation';

export enum Role {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  USER = 'USER',
}

const EditUser = () => {
  const searchParams = useParams();
  const id = searchParams.id;
  const [user, setUser] = useState<User | null>(
    null
  );
  const [isLoading, setIsLoading] =
    useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] =
    useState<boolean>(false);
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      if (!session || !id) return;

      setIsLoading(true);

      try {
        // Fetch course and user progress in parallel
        const response = await fetch(
          `${config.env.baseUrl}/users/${id}`,
          {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
            },
          }
        );

        if (!response.ok)
          throw new Error(
            'Failed to fetch user data'
          );

        const userData = await response.json();
        console.log({ userData });

        setUser(userData.data);
      } catch (error) {
        console.error(
          'Error fetching data:',
          error
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [session, id]);

  const form = useForm<
    zod.infer<typeof updateUserSchema>
  >({
    resolver: zodResolver(updateUserSchema),
    mode: 'all',
    defaultValues: {
      email: '',
      phoneNumber: '',
      name: '',
      role: undefined,
    },
  });
  useEffect(() => {
    if (user) {
      form.reset({
        email: user?.email || '',
        phoneNumber: user?.phoneNumber || '',
        name: user.name || '',
        role: user.role || undefined,
      });
    }
  }, [user, form]);

  if (isLoading) return <CustomLoader />;

  const onSubmit = async (
    values: zod.infer<typeof updateUserSchema>
  ) => {
    setIsSubmitting(true);

    const payload = {
      email: values.email,
      phoneNumber: values.phoneNumber,
      name: values.name,
      role: values.role,
    };

    const result = await updateUser(
      payload,
      id as string,
      '/admin/users'
    );

    if (result.success) {
      router.push('/admin/users');
      toast.success('User updated successfully');
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
              disabled={isSubmitting}
              isLoading={isSubmitting}
              className='w-auto px-4 py-2'
              loadingText='Updating...'
            >
              Update
            </SubmitButton>
          </div>
        </form>
      </Form>
    </Card>
  );
};

export default EditUser;
