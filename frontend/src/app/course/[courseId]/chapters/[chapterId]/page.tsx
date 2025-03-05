import { Separator } from '@/components/ui/separator';
import { fetchPublishedOrFreeChapter } from '@/lib/api';
import { cn, getFileType } from '@/lib/utils';
import { JsonToHtml } from '@/modules/admin/rich-text-editor/json-to-html';
import { Banner } from '@/modules/common/banner';
import Thumbnail from '@/modules/common/thumbnail';
import { CourseEnrollButton } from '@/modules/user/chapters/course-enroll-button';
import { CourseProgressButton } from '@/modules/user/chapters/course-progress-button';
import { VideoPlayer } from '@/modules/user/chapters/video-player';
import { redirect } from 'next/navigation';

const ChapterIdPage = async ({
  params,
}: {
  params: { courseId: string; chapterId: string };
}) => {
  const { courseId, chapterId } = await params;
  const response =
    await fetchPublishedOrFreeChapter(
      courseId,
      chapterId
    );
  const {
    chapter,
    course,
    attachments,
    nextChapter,
    userProgress,
    purchasedCourse,
  } = response.data;

  if (!chapter || !course) {
    return redirect('/');
  }
  const isLocked =
    !chapter.isFree && !purchasedCourse;
  const completeOnEnd =
    !!purchasedCourse &&
    !userProgress?.isCompleted;
  return (
    <div
      className={cn(
        'max-w-7xl mx-auto flex flex-col gap-8 mb-20',
        {
          'max-w-5xl':
            !purchasedCourse ||
            purchasedCourse == null,
        }
      )}
    >
      {userProgress?.isCompleted && (
        <Banner
          variant='success'
          label='You already completed this chapter.'
        />
      )}
      {isLocked && (
        <Banner
          variant='warning'
          label='You need to purchase this course to watch this chapter.'
        />
      )}
      <div
        className={cn(
          'flex mx-auto w-full max-w-[85rem] gap-6',
          {
            'grid grid-cols-1 lg:grid-cols-3':
              !!attachments?.length,
            'flex mx-auto w-full max-w-7xl':
              !purchasedCourse ||
              purchasedCourse == null,
          }
        )}
      >
        <div
          className={cn(
            'col-span-1 lg:col-span-2 flex flex-col gap-4 w-full',
            {}
          )}
        >
          <VideoPlayer
            chapterId={chapterId}
            title={chapter.title}
            courseId={courseId}
            nextChapterId={nextChapter?.id}
            playbackId={chapter?.videoUrl}
            isLocked={isLocked}
            completeOnEnd={completeOnEnd}
          />
          <div className='py-4 flex flex-col gap-4 md:flex-row items-center justify-between'>
            <h2 className='text-xl font-semibold'>
              {chapter.title}
            </h2>
            {purchasedCourse ? (
              <CourseProgressButton
                chapterId={chapterId}
                courseId={courseId}
                nextChapterId={nextChapter?.id}
                isCompleted={
                  !!userProgress?.isCompleted
                }
              />
            ) : (
              <CourseEnrollButton
                courseId={courseId}
                price={course.price!}
              />
            )}
          </div>
          <Separator />
          <div className='flex flex-col gap-4'>
            <h2 className='text-xl font-semibold mb-2'>
              Description
            </h2>
            <JsonToHtml
              json={JSON.parse(
                chapter.description || '{}'
              )}
            />
          </div>
          {purchasedCourse != null &&
            chapter?.content && (
              <div className='flex flex-col gap-4 mt-4'>
                {/* <h2 className='text-xl font-semibold mb-2'>
                  Chapter Content
                </h2> */}
                <JsonToHtml
                  json={JSON.parse(
                    chapter.content || '{}'
                  )}
                />
              </div>
            )}
        </div>

        <div className='col-span-1 '>
          <div className='lg:sticky lg:top-4 flex flex-col gap-4 '>
            {!!attachments?.length && (
              <>
                <h2 className='text-xl font-semibold'>
                  Resources
                </h2>
                <div className='flex flex-col gap-2'>
                  {attachments.map(
                    (attachment) => {
                      const { type, extension } =
                        getFileType(
                          attachment.url
                        );
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
                        </div>
                      );
                    }
                  )}
                </div>
              </>
            )}
            <div className='hidden lg:flex'>
              {course?.description && (
                <JsonToHtml
                  json={JSON.parse(
                    course.description || '{}'
                  )}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChapterIdPage;
