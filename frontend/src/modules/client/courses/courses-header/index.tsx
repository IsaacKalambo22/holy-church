'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useCarousel } from '@/hooks/use-carousel';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

const CoursesHeader = () => {
  const currentImage = useCarousel({
    totalImages: 3,
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className='w-full'
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className='flex justify-between items-center mt-12 h-[40rem] sm:h-[30rem] rounded-lg'
      >
        <Card className='w-full h-full flex flex-col md:flex-row justify-between items-center shadow-none'>
          <div className='w-full md:w-1/2 px-4 md:px-16 mx-auto max-sm:pt-4 max-sm:text-center'>
            <h1 className='text-4xl font-bold mb-4 '>
              Courses
            </h1>
            <p className='text-lg text-muted-foreground mb-8'>
              This is the list of the courses you
              can enroll
              <br />
              Courses when you need and want them.
            </p>
            <div className='w-fit max-sm:mx-auto'>
              <Link
                href='/sign-up'
                scroll={false}
              >
                <Button className='px-4 py-2 rounded-md'>
                  Sign up to start learning
                </Button>
              </Link>
            </div>
          </div>
          <div className='w-full md:w-1/2 h-full relative overflow-hidden rounded-r-lg md:mt-0 mt-4'>
            {[
              '/assets/images/carousel/6.jpg',
              '/assets/images/carousel/12.jpg',
              '/assets/images/carousel/3.jpg',
            ].map((src, index) => (
              <Image
                key={src}
                src={src}
                alt={`Hero Banner ${index + 1}`}
                fill
                priority={index === currentImage}
                sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                className={`object-cover transition-opacity duration-500 opacity-0 ${
                  index === currentImage
                    ? 'opacity-100'
                    : ''
                }`}
              />
            ))}
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default CoursesHeader;
