'use client';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import TeacherCourseCard from '../teacher-course-card';

interface Props {
  courses: Course[];
}
const CoursesList = ({ courses }: Props) => {
  const { data: session } = useSession();
  // const router = useRouter();

  const handleGoToCourse = (course: Course) => {
    console.log({ course });
  };
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className='w-full'
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        viewport={{ amount: 0.3, once: true }}
        className='mx-auto'
      >
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
          {courses &&
            courses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{
                  y: 50,
                  opacity: 0,
                }}
                whileInView={{
                  y: 0,
                  opacity: 1,
                }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.2,
                }}
                viewport={{ amount: 0.4 }}
              >
                <TeacherCourseCard
                  key={course.id}
                  course={course}
                  isOwner={
                    course.userId === session?.id
                  }
                  onGoToCourse={handleGoToCourse}
                />
              </motion.div>
            ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CoursesList;
