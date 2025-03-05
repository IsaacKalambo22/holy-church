'use client';

import { Card } from '@/components/ui/card';
import { motion } from 'motion/react';
import Image from 'next/image';
import HeaderText from '../header-text';

interface ServiceItem {
  title: string;
  description: string;
  imageUrl: string;
}

const services: ServiceItem[] = [
  {
    title: 'Fostering Personal Self-Discovery',
    imageUrl: '/assets/images/carousel/01.jpeg',
    description: `Encouraging individuals to explore and understand their strengths, value
and potential for growth`,
  },
  {
    title: 'Nurturing Individuals Aptitudes',
    imageUrl: '/assets/images/carousel/02.jpg',
    description: `Cultivating creativity and innovation to help individuals realize their
full potential and thrive in their endeavors`,
  },
  {
    title: ' Building Global Connections',
    imageUrl: '/assets/images/carousel/05.jpg',
    description:
      'Creating opportunities for individuals with influence to connect, collaborate and expand their impact on a global scale',
  },
  {
    title: ' Collaborative Visionary Partnership',
    imageUrl: '/assets/images/carousel/03.jpg',
    description: `Facilitating partnerships with foward-thinking visionaries to ensure
successful implementation and long-term sustainability of shared goals
and visions`,
  },
  {
    title: 'Fostering Successful Succession',
    imageUrl: '/assets/images/carousel/04.jpg',
    description: `Training founders of projects to be wisely put in place their successors
for long live visions beyond founder's death or distance`,
  },
];

export default function Services() {
  return (
    <div className='flex flex-col gap-4 mb-20'>
      <HeaderText
        title='Our Programs & Initiatives'
        // subtitle='Empowering the Youth, Realizing Potential, Shaping the Future'
      />
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mx-auto'>
        {services.map((service, index) => (
          <motion.div
            key={index}
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{
              duration: 0.5,
              delay: index * 0.2,
            }}
            viewport={{ amount: 0.4 }}
          >
            <Card
              key={index}
              className='shadow-lg rounded-3xl overflow-hidden hover:shadow-xl transition-shadow duration-300 py-6 px-6'
            >
              <div className='relative w-full h-[15rem]'>
                <Image
                  src={service.imageUrl}
                  alt={service.title}
                  layout='fill'
                  objectFit='cover' // Keeps the image filling the space
                  objectPosition='center' // Aligns the image centrally to minimize uneven cropping
                  className='rounded-2xl'
                  priority={index === 0}
                />
              </div>

              <div className='pt-3'>
                <h3 className='text-xl font-semibold text-gray-800 mb-2'>
                  {service.title}
                </h3>
                <p className='text-gray-600 text-sm leading-relaxed mb-3'>
                  {service.description}
                </p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
