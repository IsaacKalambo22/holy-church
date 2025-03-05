import { Card } from '@/components/ui/card';
import { cn, formatPrice } from '@/lib/utils';
import Image from 'next/image';
import CourseActionDropdown from '../course-action-dropdown';

const TeacherCourseCard = ({
  course,
  onGoToCourse,
  isOwner,
}: TeacherCourseCardProps) => {
  return (
    <Card
      className='w-full h-[23rem] relative p-6 border border-gray-200 rounded-2xl shadow-md text-foreground overflow-hidden flex flex-col gap-2 group transition duration-200 hover:shadow-lg'
      onClick={() => onGoToCourse(course)}
    >
      <div className='absolute z-50 top-5 right-5'>
        {isOwner && (
          <CourseActionDropdown course={course} />
        )}
      </div>
      {/* Course Image */}
      <div className='relative w-auto pt-[56.25%]'>
        <Image
          src={
            course.imageUrl ||
            '/assets/images/placeholder.png'
          }
          alt={course.title}
          fill
          unoptimized
          sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
          className='object-cover transition-transform rounded-xl'
          loading='lazy'
        />
      </div>

      {/* Course Content */}
      <div className=' flex flex-col gap-3 justify-between h-full w-full '>
        {/* Course Details */}
        <div>
          <h2 className='font-semibold line-clamp-1 mt-1'>
            {course.title}
          </h2>
          <p className='text-sm mt-1 line-clamp-2'>
            {course?.category?.name}
          </p>
          <div className='flex justify-between items-center mt-3'>
            <span className='text-primary-500 font-semibold'>
              {formatPrice(course.price)}
            </span>
            <span
              className={cn(
                'font-semibold px-2 py-1 rounded-md text-sm',
                course.isPublished
                  ? 'bg-green-100 text-green-600'
                  : 'bg-red-100 text-red-600'
              )}
            >
              {course.isPublished
                ? 'Published'
                : 'Draft'}
            </span>
            {/* <span className='text-gray-500 text-sm'>
              {course.enrollmentsCount} Enrolled
            </span> */}
          </div>
        </div>

        <div className=''>
          {!isOwner && (
            <p className='text-sm italic text-gray-500'>
              View Only
            </p>
          )}
        </div>
      </div>
    </Card>
  );
};

export default TeacherCourseCard;
