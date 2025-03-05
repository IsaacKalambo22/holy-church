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
import { createStudent } from '../../actions';
import {
  AccountType,
  createStudentSchema,
  Gender,
} from '../../validation';

const NewStudent = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] =
    useState(false);
  const path = usePathname();
  const { fullPath } = useCustomPath(path);

  const form = useForm<
    zod.infer<typeof createStudentSchema>
  >({
    resolver: zodResolver(createStudentSchema),
    mode: 'all',
    defaultValues: {
      email: '',
      phoneNumber: '',
      name: '',
      avatar: '',
      about: '',
      age: 18,
      contactInfo: '',
      backgroundSummary: '',
      initialAssessment: '',
      aptitudesAndStrengths: '',
      shortTermGoals: '',
      longTermObjectives: '',
      workshopsAttended: '',
      resourcesUtilized: '',
      skillsDevelopment: '',
      behavioralChanges: '',
      feedbackAndSelfReflection: '',
      obstaclesEncountered: '',
      interventionsProvided: '',
      gender: undefined,
      accountType: undefined, // Set default account type to SILVER
    },
  });

  const onSubmit = async (
    values: zod.infer<typeof createStudentSchema>
  ) => {
    setIsLoading(true);

    const payload = {
      email: values.email,
      phoneNumber: values.phoneNumber,
      name: values.name,
      avatar: values.avatar,
      about: values.about,
      age: values.age,
      gender: values.gender,
      contactInfo: values.contactInfo,
      backgroundSummary: values.backgroundSummary,
      initialAssessment: values.initialAssessment,
      aptitudesAndStrengths:
        values.aptitudesAndStrengths,
      shortTermGoals: values.shortTermGoals,
      longTermObjectives:
        values.longTermObjectives,
      workshopsAttended: values.workshopsAttended,
      resourcesUtilized: values.resourcesUtilized,
      skillsDevelopment: values.skillsDevelopment,
      behavioralChanges: values.behavioralChanges,
      feedbackAndSelfReflection:
        values.feedbackAndSelfReflection,
      obstaclesEncountered:
        values.obstaclesEncountered,
      interventionsProvided:
        values.interventionsProvided,
      accountType: values.accountType,
    };

    const result = await createStudent(
      payload,
      fullPath,
      '/admin/students'
    );

    if (result.success) {
      router.push('/admin/students');
      toast.success(
        'New student created successfully'
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
              fieldType={FormFieldType.INPUT}
              name='name'
              label='Name'
              control={form.control}
              placeholder='Enter name'
            />

            <CustomFormField
              fieldType={FormFieldType.NUMBER}
              name='age'
              label='Age'
              control={form.control}
              placeholder='Enter age'
              type='number'
            />
            <CustomFormField
              fieldType={FormFieldType.SELECT}
              name='gender'
              label='Sex'
              placeholder='Please select status'
              control={form.control}
            >
              {Object.entries(Gender).map(
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
            <CustomFormField
              fieldType={FormFieldType.SELECT}
              name='accountType'
              label='Account type'
              placeholder='Please select account type'
              control={form.control}
            >
              {Object.entries(AccountType).map(
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
            <CustomFormField
              fieldType={FormFieldType.TEXTAREA}
              name='about'
              label='About'
              control={form.control}
              placeholder='Enter about'
            />
            <CustomFormField
              fieldType={FormFieldType.TEXTAREA}
              name='backgroundSummary'
              label='Background Summary'
              control={form.control}
              placeholder='Enter background summary'
            />
            <CustomFormField
              fieldType={FormFieldType.TEXTAREA}
              name='initialAssessment'
              label='Initial Assessment'
              control={form.control}
              placeholder='Enter initial assessment'
            />
            <CustomFormField
              fieldType={FormFieldType.TEXTAREA}
              name='aptitudesAndStrengths'
              label='Aptitudes and Strengths'
              control={form.control}
              placeholder='Enter aptitudes and strengths'
            />
            <CustomFormField
              fieldType={FormFieldType.TEXTAREA}
              name='shortTermGoals'
              label='Short-Term Goals'
              control={form.control}
              placeholder='Enter short-term goals'
            />
            <CustomFormField
              fieldType={FormFieldType.TEXTAREA}
              name='longTermObjectives'
              label='Long-Term Objectives'
              control={form.control}
              placeholder='Enter long-term objectives'
            />
            <CustomFormField
              fieldType={FormFieldType.TEXTAREA}
              name='workshopsAttended'
              label='Workshops Attended'
              control={form.control}
              placeholder='Enter workshops attended'
            />
            <CustomFormField
              fieldType={FormFieldType.TEXTAREA}
              name='resourcesUtilized'
              label='Resources Utilized'
              control={form.control}
              placeholder='Enter resources utilized'
            />
            <CustomFormField
              fieldType={FormFieldType.TEXTAREA}
              name='skillsDevelopment'
              label='Skills Development'
              control={form.control}
              placeholder='Enter skills development'
            />
            <CustomFormField
              fieldType={FormFieldType.TEXTAREA}
              name='behavioralChanges'
              label='Behavioral Changes'
              control={form.control}
              placeholder='Enter behavioral changes'
            />
            <CustomFormField
              fieldType={FormFieldType.TEXTAREA}
              name='feedbackAndSelfReflection'
              label='Feedback and Self-Reflection'
              control={form.control}
              placeholder='Enter feedback and self-reflection'
            />
            <CustomFormField
              fieldType={FormFieldType.TEXTAREA}
              name='obstaclesEncountered'
              label='Obstacles Encountered'
              control={form.control}
              placeholder='Enter obstacles encountered'
            />
            <CustomFormField
              fieldType={FormFieldType.TEXTAREA}
              name='interventionsProvided'
              label='Interventions Provided'
              control={form.control}
              placeholder='Enter interventions provided'
            />
            <div className='flex justify-end gap-4 h-full mt-8'>
              <Button
                variant='outline'
                onClick={() =>
                  router.push('/admin/dashboard')
                }
              >
                Cancel
              </Button>
              <SubmitButton
                disabled={isLoading}
                isLoading={isLoading}
                className='w-auto px-4 py-2'
                loadingText='Saving...'
              >
                Save
              </SubmitButton>
            </div>
          </div>
        </form>
      </Form>
    </Card>
  );
};

export default NewStudent;
