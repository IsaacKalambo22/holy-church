import { fetchCourseChapter } from '@/lib/api';
import EditChapter from '@/modules/admin/courses/edit-course/chapters/edit-chapter';

interface Props {
  params: {
    id: string;
    chapterId: string;
  };
}
const ChapterDetails = async ({
  params,
}: Props) => {
  const { id, chapterId } = await params;
  console.log({ id, chapterId });

  let chapter: Chapter | null = null;
  try {
    const response = await fetchCourseChapter(
      id,
      chapterId
    );

    chapter = response?.data;
    console.log(chapter);
  } catch (error) {
    console.log(
      'Failed to fetch chapter:',
      error
    );
    return (
      <div>
        {/* <HeaderText title='Chapter' /> */}
        <p className='text-red-500'>
          Failed to load chapter. Please try again
          later.
        </p>
      </div>
    );
  }

  return (
    <div className='w-full mb-20 '>
      {/* <HeaderText title='Chapter' /> */}
      {chapter ? (
        <EditChapter
          courseId={id}
          chapter={chapter}
        />
      ) : (
        <p className='text-gray-500 text-lg mt-5 text-center'>
          Chapter not found
        </p>
      )}
    </div>
  );
};

export default ChapterDetails;
