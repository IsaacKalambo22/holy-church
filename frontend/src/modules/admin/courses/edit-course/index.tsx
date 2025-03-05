'use client';

import { Card } from '@/components/ui/card';
import { IconText } from '@/modules/common/icon-text';
import {
  ArrowLeft,
  File,
  LayoutDashboard,
  ListChecks,
  Pencil,
  PlusCircle,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
} from '@/components/ui/form';
import { SelectItem } from '@/components/ui/select';
import { removeFromS3 } from '@/lib/aws';
import {
  handleFileUpload,
  updateFileProgress,
} from '@/lib/utils';
import { Banner } from '@/modules/common/banner';
import CustomFormField, {
  FormFieldType,
} from '@/modules/common/custom-form-field';
import {
  FileState,
  MultiFileDropzone,
} from '@/modules/common/multiple-file-upload';
import SubmitButton from '@/modules/common/submit-button';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as zod from 'zod';
import { updateCourse } from '../../actions';
import CustomRichTextEditor from '../../rich-text-editor/custom-rich-text-editor';
import { JsonToHtml } from '../../rich-text-editor/json-to-html';
import { createCourseSchema } from '../../validation';
import { AttachmentForm } from './attachments/attachment-form';
import ChaptersForm from './chapters/chapter-form';

export enum Category {
  DESTINY = 'Destiny',
  SUCCESS = 'Success',
  IDENTITY = 'Identity',
  PURPOSE_OF_EXISTENCE = 'Purpose of existence',
}
const EditCourse = ({
  course,
}: {
  course: Course;
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] =
    useState(false);
  const [fileStates, setFileStates] = useState<
    FileState[]
  >([]);

  const [isEditing, setIsEditing] =
    useState(false);
  const [
    isEditingDescription,
    setIsEditingDescription,
  ] = useState(false);

  const toggleEditDescription = () =>
    setIsEditingDescription(
      (current) => !current
    );
  const toggleEdit = () =>
    setIsEditing((current) => !current);

  const form = useForm<
    zod.infer<typeof createCourseSchema>
  >({
    resolver: zodResolver(createCourseSchema),
    mode: 'all',
    defaultValues: {
      title: '',
      description: '',
      category: Category.DESTINY, // Use a valid enum value
      price: 0,
      isPublished: false,
    },
  });

  useEffect(() => {
    const initializeForm = async () => {
      if (course) {
        form.reset({
          title: course.title,
          isPublished: course.isPublished,
          description: course.description,
          price: course.price,
          category: course?.category
            ?.name as Category,
        });
      }
    };

    initializeForm();
  }, [course, form]);

  const requiredFields = [
    course.title,
    course.description,
    course.imageUrl,
    course.price,
    course.category,
    course.chapters?.some(
      (chapter) => chapter.isPublished
    ) ?? false,
  ];

  const totalFields = requiredFields.length;
  const completedFields =
    requiredFields.filter(Boolean).length;

  const completionText = `(${completedFields} / ${totalFields})`;

  const isComplete =
    requiredFields.every(Boolean);

  const onSubmit = async (
    values: zod.infer<typeof createCourseSchema>
  ) => {
    console.log({ values });
    setIsLoading(true);
    let imageUrl: string | null = '';

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
      imageUrl = uploadUrls[0];
    }
    if (
      course.imageUrl !== imageUrl &&
      course.imageUrl
    ) {
      await removeFromS3(course.imageUrl);
    }
    const payload = {
      title: values.title,
      description: values.description,
      isPublished: values.isPublished,
      category: values.category,
      price: values.price,
      imageUrl,
    };
    console.log({ course });
    const result = await updateCourse(
      payload,
      course.id,
      '/admin/courses'
    );

    if (result.success) {
      router.push('/admin/courses');
      toast.success(
        'Course updated successfully'
      );
    } else {
      toast.error(
        result.error ?? 'An error occurred.'
      );
    }
    setIsLoading(false);
  };

  return (
    <div className='flex flex-col gap-4'>
      {!course.isPublished && (
        <Banner
          // className='lg:sticky lg:top-4'
          label='This course is unpublished. It will not be visible to the students.'
        />
      )}
      <Card className='shadow-none p-8'>
        <div className='flex flex-col gap-2'>
          <div className='flex justify-between items-center mb-2'>
            <h2 className='text-2xl font-bold'>
              Course Setup
            </h2>
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
              Back To Courses
            </Button>
          </div>
          <span className='text-sm text-slate-700'>
            Complete all fields {completionText}
          </span>
        </div>
        <div className='w-full flex flex-col lg:flex-row gap-10 mt-5'>
          {/* LEFT SIDE */}
          <div className=' lg:w-4/12'>
            <div className='lg:sticky lg:top-4 flex flex-col gap-6'>
              <div className='space-y-4'>
                <IconText
                  icon={ListChecks}
                  text='Course chapters'
                />
                <ChaptersForm
                  initialData={course}
                  courseId={course.id}
                />
              </div>
              <div className='space-y-4'>
                <IconText
                  icon={File}
                  text='Resources & Attachments'
                />
                <AttachmentForm
                  initialData={course}
                  courseId={course.id}
                />
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className=' flex flex-col gap-8 lg:w-8/12'>
            <Form {...form}>
              <form
                className='w-full flex flex-col gap-5'
                onSubmit={form.handleSubmit(
                  onSubmit
                )}
              >
                <div className='space-y-6'>
                  <IconText
                    icon={LayoutDashboard}
                    text=' Customize your course'
                  />
                  <CustomFormField
                    fieldType={
                      FormFieldType.INPUT
                    }
                    name='title'
                    label='Course Title'
                    control={form.control}
                    placeholder='Enter course title'
                  />
                  {/* Description */}
                  <div className='font-medium flex items-center justify-between'>
                    Course Description
                    <Button
                      onClick={(e) => {
                        e.preventDefault();
                        toggleEditDescription();
                      }}
                      variant='ghost'
                    >
                      {isEditingDescription && (
                        <>Cancel</>
                      )}
                      {!isEditingDescription &&
                        !course.description && (
                          <>
                            <PlusCircle className='h-4 w-4 mr-2' />
                            Add a description
                          </>
                        )}
                      {!isEditingDescription &&
                        course.description && (
                          <>
                            <Pencil className='h-4 w-4 mr-2' />
                            Edit Description
                          </>
                        )}
                    </Button>
                  </div>
                  {isEditingDescription && (
                    <CustomFormField
                      fieldType={
                        FormFieldType.SKELETON
                      }
                      control={form.control}
                      name='description'
                      renderSkeleton={(field) => (
                        <FormControl>
                          <CustomRichTextEditor
                            field={field}
                          />
                        </FormControl>
                      )}
                    />
                  )}
                  {!isEditingDescription &&
                    (!course.description ? (
                      <div className='flex items-center justify-center '>
                        <h2>
                          No description available
                        </h2>
                      </div>
                    ) : (
                      <div className='relative aspect-video mt-2'>
                        <section>
                          <JsonToHtml
                            json={JSON.parse(
                              course.description
                            )}
                          />
                        </section>
                      </div>
                    ))}
                  <CustomFormField
                    fieldType={
                      FormFieldType.SELECT
                    }
                    name='category'
                    label='Category'
                    placeholder='Select category'
                    control={form.control}
                    defaultValue={
                      (course.category
                        ?.name as Category) ||
                      Category.DESTINY
                    }
                  >
                    {Object.entries(Category).map(
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
                    fieldType={
                      FormFieldType.NUMBER
                    }
                    name='price'
                    label='Course Price (MWK)'
                    control={form.control}
                    placeholder='Enter course price'
                  />
                  <CustomFormField
                    fieldType={
                      FormFieldType.CHECKBOX
                    }
                    control={form.control}
                    name='isPublished'
                    disabled={!isComplete}
                    label='Check this box to publish this course'
                  />
                  <div className='font-medium flex items-center justify-between'>
                    Course cover image
                    <Button
                      onClick={(e) => {
                        e.preventDefault();
                        toggleEdit();
                      }}
                      variant='ghost'
                    >
                      {isEditing && <>Cancel</>}
                      {!isEditing &&
                        !course.imageUrl && (
                          <>
                            <PlusCircle className='h-4 w-4 mr-2' />
                            Add a image
                          </>
                        )}
                      {!isEditing &&
                        course.imageUrl && (
                          <>
                            <Pencil className='h-4 w-4 mr-2' />
                            Edit image
                          </>
                        )}
                    </Button>
                  </div>
                  {isEditing && (
                    <div className='w-full flex flex-col gap-4'>
                      <label className='font-medium text-gray-700'>
                        Upload course cover image
                      </label>
                      <MultiFileDropzone
                        value={fileStates}
                        onChange={setFileStates}
                        fileType='image/*'
                        maxFiles={1}
                      />
                    </div>
                  )}

                  {!isEditing &&
                    course.imageUrl && (
                      <div className='relative w-auto pt-[40.25%]'>
                        <Image
                          src={course.imageUrl}
                          alt={course.title}
                          fill
                          unoptimized
                          sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                          className='object-cover transition-transform rounded-xl'
                          loading='lazy'
                        />
                      </div>
                    )}
                </div>

                <div className='flex justify-end gap-4 h-full '>
                  <Button
                    variant='outline'
                    onClick={(e) => {
                      e.preventDefault();
                      router.push(
                        '/admin/courses'
                      );
                    }}
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
          </div>
        </div>
      </Card>
    </div>
  );
};

export default EditCourse;
