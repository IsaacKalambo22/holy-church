'use client';

import { Card } from '@/components/ui/card';
import { ColourfulText } from '@/components/ui/colorful-text';
import { TextGenerateEffect } from '@/components/ui/text-generate-effect';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface ImageTextProps {
  imagePath: string;
  heading: string;
  description: string;
  imagePosition?: 'left' | 'right';
}

export function ImageTextHome({
  imagePath,
  heading,
  description,
  imagePosition = 'left',
}: ImageTextProps) {
  return (
    <motion.div>
      <Card className='flex sm:rounded-[2.5rem] flex-col sm:flex-row items-center bg-inherit rounded-3xl border-none shadow-none overflow-hidden'>
        {/* Responsive Image Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, amount: 0.4 }} // Triggers animation when 30% of the element is visible
          className={`relative w-full sm:w-[50%] h-64 sm:h-[24rem] ${
            imagePosition === 'right'
              ? 'sm:order-2'
              : ''
          }`}
        >
          <div className='relative w-full h-full sm:rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-gray-100'>
            <Image
              src={imagePath}
              alt={heading}
              priority={true} // Ensures the image is loaded first
              layout='fill'
              objectFit='cover'
              className='rounded-[2.5rem] transform scale-105 transition-transform duration-500 hover:scale-100'
            />
          </div>
        </motion.div>

        {/* Text Section with Padding Adjustments */}
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            duration: 0.5,
            delay: 0.2,
          }} // Slight delay to ensure image loads first
          viewport={{ once: true, amount: 0.3 }} // Triggers animation when 30% of the element is visible
          className={`p-6 sm:p-12 sm:w-[50%] flex flex-col justify-center items-center sm:items-start text-center sm:text-left ${
            imagePosition === 'right'
              ? 'sm:order-1'
              : ''
          }`}
        >
          <h1 className='text-xl sm:text-2xl font-bold mb-4 relative z-2 font-sans'>
            <ColourfulText text={heading} />{' '}
          </h1>

          <TextGenerateEffect
            words={description}
          />
          <p className='text-gray-600 text-lg sm:text-xl leading-relaxed'></p>
        </motion.div>
      </Card>
    </motion.div>
  );
}
