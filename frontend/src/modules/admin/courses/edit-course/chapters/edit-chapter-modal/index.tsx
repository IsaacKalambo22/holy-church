import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';

import {
  handleFileUpload,
  updateFileProgress,
  urlToFile,
} from '@/lib/utils';
import { updateCourseChapter } from '@/modules/admin/actions';
import { updateChapterSchema } from '@/modules/admin/validation';
import CustomFormField, {
  FormFieldType,
} from '@/modules/common/custom-form-field';
import {
  FileState,
  MultiFileDropzone,
} from '@/modules/common/multiple-file-upload';
import SubmitButton from '@/modules/common/submit-button';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Pencil,
  PlusCircle,
  Video,
  X,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  useEffect,
  useRef,
  useState,
} from 'react';
import { useForm } from 'react-hook-form';
import ReactPlayer from 'react-player';
import { toast } from 'sonner';
import { z } from 'zod';
import CustomModal from '../../../custom-modal';
type Props = {
  isOpen: boolean;
  onClose: () => void;
  chapter: Chapter;
  courseId: string;
};
const EditChapterModal = ({
  isOpen,
  onClose,
  chapter,
  courseId,
}: Props) => {
  const router = useRouter();
  const [isLoading, setIsLoading] =
    useState(false);
  const [fileStates, setFileStates] = useState<
    FileState[]
  >([]);
  const playerRef = useRef<ReactPlayer>(null);

  const [isEditing, setIsEditing] =
    useState(false);

  const toggleEdit = () =>
    setIsEditing((current) => !current);

  const form = useForm<
    z.infer<typeof updateChapterSchema>
  >({
    resolver: zodResolver(updateChapterSchema),
    mode: 'onSubmit',
    defaultValues: {
      title: '',
      description: '',
      content: '',
      isFree: false,
      isPublished: false,
    },
  });

  useEffect(() => {
    const initializeForm = async () => {
      if (chapter) {
        let file: File | undefined;

        if (chapter.videoUrl) {
          const fileExtension =
            chapter.videoUrl.split('.').pop() ||
            'mp4'; // Default to jpg if no extension
          const mimeType = `video/${fileExtension}`;
          file = await urlToFile(
            chapter.videoUrl,
            `chapter-video.${fileExtension}`,
            mimeType
          );
        }

        console.log({ file });

        form.reset({
          title: chapter.title,
          description: chapter.description,
          content: chapter.content,
          isFree: chapter.isFree,
          isPublished: chapter.isPublished,
          // category: chapter.category,
        });
      }
    };

    initializeForm();
  }, [chapter, form]);

  const requiredFields = [
    chapter.title,
    chapter.description,
    chapter.content,
    chapter.videoUrl,
  ];

  const totalFields = requiredFields.length;
  const completedFields =
    requiredFields.filter(Boolean).length;

  const completionText = `(${completedFields} / ${totalFields})`;

  const isComplete =
    requiredFields.every(Boolean);

  const onSubmit = async (
    values: z.infer<typeof updateChapterSchema>
  ) => {
    console.log({ values });
    setIsLoading(true);

    let videoUrl: string | null = '';

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
      videoUrl = uploadUrls[0];
    }

    const payload = {
      title: values.title,
      description: values.description,
      content: values.content,
      isFree: values.isFree,
      isPublished: values.isPublished,
      videoUrl,
    };

    const result = await updateCourseChapter(
      payload,
      courseId,
      chapter.id
    );

    if (result.success) {
      toast.success(
        'Chapter updated successfully'
      );
      router.push(
        `/admin/courses/edit/${courseId}`
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
        <div className='flex justify-between items-center mb-2'>
          <h2 className='text-2xl font-bold'>
            Edit Chapter
          </h2>
          <button
            onClick={onClose}
            className='text-gray-500 hover:text-gray-700'
          >
            <X className='w-6 h-6' />
          </button>
        </div>
        <span className='text-sm text-slate-700 mb-2'>
          Complete all fields {completionText}
        </span>
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
              fieldType={FormFieldType.TEXTAREA}
              name='content'
              label='Content'
              control={form.control}
              placeholder='Write chapter content'
            />
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
              disabled={!isComplete}
              label='Check this box to publish this chapter'
              defaultValue={chapter.isPublished}
            />
            <div className='font-medium flex items-center justify-between'>
              Chapter video
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  toggleEdit();
                }}
                variant='ghost'
              >
                {isEditing && <>Cancel</>}
                {!isEditing &&
                  !chapter.videoUrl && (
                    <>
                      <PlusCircle className='h-4 w-4 mr-2' />
                      Add a video
                    </>
                  )}
                {!isEditing &&
                  chapter.videoUrl && (
                    <>
                      <Pencil className='h-4 w-4 mr-2' />
                      Edit video
                    </>
                  )}
              </Button>
            </div>
            {isEditing && (
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
            )}

            {!isEditing &&
              (!chapter.videoUrl ? (
                <div className='flex items-center justify-center h-60 bg-slate-200 rounded-md  dark:bg-gray-800 dark:text-slate-300'>
                  <Video className='h-10 w-10 text-slate-500' />
                </div>
              ) : (
                <div className='relative aspect-video mt-2'>
                  <ReactPlayer
                    ref={playerRef}
                    url={
                      chapter.videoUrl as string
                    }
                    controls
                    width='100%'
                    height='100%'
                    // onProgress={handleProgress}
                    config={{
                      file: {
                        attributes: {
                          controlsList:
                            'nodownload',
                        },
                      },
                    }}
                  />
                </div>
              ))}

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
                loadingText='Updating...'
              >
                Update
              </SubmitButton>
            </div>
          </form>
        </Form>
      </div>
    </CustomModal>
  );
};

export default EditChapterModal;
