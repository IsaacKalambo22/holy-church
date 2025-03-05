import { fetchPublishedCourse } from '@/lib/api';
import { redirect } from 'next/navigation';

const CourseIdPage = async ({
  params,
}: {
  params: { courseId: string };
}) => {
  const courseId = await params.courseId;
  const response = await fetchPublishedCourse(
    courseId
  );

  const course = response.data;

  if (!course) {
    return redirect('/');
  }

  if (
    course.chapters &&
    course.chapters.length > 0
  ) {
    return redirect(
      `/course/${course.id}/chapters/${course.chapters[0].id}`
    );
  } else {
    return redirect('/');
  }
};

export default CourseIdPage;
