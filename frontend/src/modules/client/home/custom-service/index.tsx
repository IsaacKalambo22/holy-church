'use client';

import { Card } from '@/components/ui/card';
import Image from 'next/image';

interface ServiceItem {
  title: string;
  description: string;
  imageUrl: string;
}

const services: ServiceItem[] = [
  {
    title: 'Pre-Occupation Cleaning',
    imageUrl: '/assets/images/carousel/4.jpg',
    description:
      'Ensure your new home or office is spotless before you move in. Deep cleaning for a fresh start.',
  },
  {
    title: 'After Events/Parties',
    imageUrl: '/assets/images/carousel/10.jpg',
    description:
      'Leave the post-party cleanup to us! We’ll restore your space to its original state efficiently.',
  },
  {
    title: 'Domestic Cleaning',
    imageUrl: '/assets/images/carousel/11.jpg',
    description:
      'Regular or one-time cleaning for your home to maintain a clean and comfortable space.',
  },
  {
    title: 'Office Cleaning',
    imageUrl: '/assets/images/carousel/12.jpg',
    description:
      'Comprehensive cleaning services to keep your workspace clean, organized, and productive.',
  },
  {
    title: 'Vacation Rentals Cleaning',
    imageUrl: '/assets/images/carousel/19.jpg',
    description:
      'Prepare your rental property for the next guests with our efficient cleaning services.',
  },
  {
    title: 'Carpet Cleaning',
    imageUrl: '/assets/images/carousel/5.jpg',
    description:
      'Professional carpet cleaning to remove dirt, stains, and allergens for a healthier home.',
  },
  {
    title: 'Couch/Sofa Cleaning',
    imageUrl: '/assets/images/carousel/20.jpg',
    description:
      'Restore the look and feel of your couch or sofa with our expert cleaning services.',
  },
  {
    title: 'Deep Cleaning',
    imageUrl: '/assets/images/carousel/18.jpg',
    description:
      'Includes windows, walls, cupboards, storage rooms, and bathrooms for a thorough clean.',
  },
  {
    title: 'Mobile Car Wash',
    imageUrl: '/assets/images/carousel/17.jpg',
    description:
      'Convenient and professional car wash services brought right to your doorstep.',
  },
];

export default function CustomService() {
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mx-auto'>
      {services.map((service, index) => (
        <Card
          key={index}
          className='shadow-lg rounded-3xl overflow-hidden hover:shadow-xl transition-shadow duration-300 p-6'
        >
          <div className='relative w-full h-[17rem]'>
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
      ))}
    </div>
  );
}
