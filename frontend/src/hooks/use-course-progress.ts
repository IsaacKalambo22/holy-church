import config from '@/lib/config';
import { updateUserCourseProgress } from '@/modules/admin/actions';
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export const useCourseProgressData = () => {
  const { courseId, chapterId } = useParams();
  const { data: session } = useSession();

  const [
    hasMarkedComplete,
    setHasMarkedComplete,
  ] = useState(false);
  const [isLoading, setIsLoading] =
    useState(true);
  const [course, setCourse] =
    useState<Course | null>(null);
  const [userProgress, setUserProgress] =
    useState<any>(null);

  useEffect(() => {
    const fetchCourseAndProgress = async () => {
      if (!session || !courseId) return;

      setIsLoading(true);

      try {
        // Fetch course and user progress in parallel
        const [courseResponse, progressResponse] =
          await Promise.all([
            fetch(
              `${config.env.baseUrl}/courses/${courseId}`
            ),
            fetch(
              `${config.env.baseUrl}/course-progress/courses/${courseId}`,
              {
                headers: {
                  Authorization: `Bearer ${session.accessToken}`,
                },
              }
            ),
          ]);

        if (!courseResponse.ok)
          throw new Error(
            'Failed to fetch course data'
          );
        if (!progressResponse.ok)
          throw new Error(
            'Failed to fetch user progress data'
          );

        const courseData =
          await courseResponse.json();
        const progressData =
          await progressResponse.json();

        setCourse(courseData.data);
        setUserProgress(progressData.data);
      } catch (error) {
        console.error(
          'Error fetching data:',
          error
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourseAndProgress();
  }, [session, courseId]);

  const currentSection = course?.sections?.find(
    (s: any) =>
      s.chapters.some(
        (c: any) => c.id === chapterId
      )
  );

  const currentChapter =
    currentSection?.chapters.find(
      (c: any) => c.id === chapterId
    );

  const isChapterCompleted = () => {
    if (
      !currentSection ||
      !currentChapter ||
      !userProgress?.sections
    )
      return false;

    const section = userProgress.sections.find(
      (s: any) => s.id === currentSection.id
    );

    return (
      section?.chapters.some(
        (c: any) =>
          c.id === currentChapter.id &&
          c.completed
      ) ?? false
    );
  };

  const updateChapterProgress = async (
    sectionId: string,
    chapterId: string,
    completed: boolean
  ) => {
    if (!session) return;

    const updatedSections = [
      {
        id: sectionId,
        chapters: [
          {
            id: chapterId,
            completed,
          },
        ],
      },
    ];
    console.log(JSON.stringify(updatedSections));
    const payload = {
      sections: updatedSections,
    };

    try {
      const response =
        await updateUserCourseProgress(
          payload,
          courseId! as string
        );
      console.log(JSON.stringify(response));
      if (!response.ok)
        throw new Error(
          'Failed to update progress'
        );
      setHasMarkedComplete(completed);
    } catch (error) {
      console.error(
        'Error updating progress:',
        error
      );
    }
  };

  return {
    session,
    courseId,
    chapterId,
    course,
    userProgress,
    currentSection,
    currentChapter,
    isLoading,
    isChapterCompleted,
    updateChapterProgress,
    hasMarkedComplete,
    setHasMarkedComplete,
  };
};
