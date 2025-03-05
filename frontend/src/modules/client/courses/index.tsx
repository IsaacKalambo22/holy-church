'use client';

import { SearchInput } from '@/modules/common/search-input';
import { Categories } from '@/modules/user/browse-courses/categories';
import { motion } from 'framer-motion';
import { CoursesList } from './courses-list';

interface Props {
  courses: Course[];
  categories: Category[];
}

const Courses = ({
  courses,
  categories,
}: Props) => {
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
        className='mx-auto '
      >
        <div className='w-full h-full flex flex-col items-center'>
          <div className='flex flex-col text-center items-center justify-center max-w-4xl w-full'>
            <h2 className='text-2xl font-semibold mb-4'>
              Featured Courses
            </h2>
            <p className='text-muted-foreground mb-8'>
              From beginner to advanced, in all
              industries, we have the right
              courses just for you and preparing
              your entire journey for learning and
              making the most.
            </p>
          </div>
        </div>
        <div className='px-6 pt-6 '>
          <SearchInput />
        </div>
        <div className='p-6 space-y-4'>
          <Categories items={categories} />
          <CoursesList items={courses} />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Courses;
