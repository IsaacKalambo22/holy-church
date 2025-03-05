'use client';

import { Card } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import Image from 'next/image';
import * as React from 'react';

export function MainCarousel() {
  const plugin = React.useRef(
    Autoplay({
      delay: 5000,
      stopOnInteraction: false,
    })
  );

  const slides = [
    {
      title: 'Identity Impact Hub',
      description:
        'Revealing hidden potential through personal growth, leadership, and self-awareness. Empowering individuals to embrace their identities and contribute to society.',
      imageUrl: '/assets/images/carousel/1.jpg',
    },

    {
      title: 'Career Development Consulting',
      description:
        'We provide tailored career development strategies to help individuals align their skills and passions with meaningful opportunities, fostering long-term success and job fulfillment.',
      imageUrl: '/assets/images/carousel/01.jpeg',
    },
    {
      title: 'Executive Coaching',
      description:
        'Our executive coaching services empower leaders to enhance decision-making, strategic thinking, and personal effectiveness, ensuring they lead with confidence and purpose.',
      imageUrl: '/assets/images/carousel/9.jpg',
    },
    {
      title: 'Leadership Development Consulting',
      description:
        'We equip emerging and established leaders with the mindset, skills, and strategies to lead teams, drive change, and create lasting impact in their respective fields.',
      imageUrl: '/assets/images/carousel/1.jpg',
    },
    {
      title: 'Change Management Consulting',
      description:
        'We guide organizations and individuals through transitional phases, ensuring smooth adaptation, resilience, and sustainable transformation in an evolving world.',
      imageUrl: '/assets/images/carousel/03.jpg',
    },
    {
      title: 'Team Building Consulting',
      description:
        'Our team-building sessions foster collaboration, trust, and synergy within organizations, enhancing productivity and workplace harmony.',
      imageUrl: '/assets/images/carousel/2.jpg',
    },
    {
      title: 'Life Coaching',
      description:
        'We provide life coaching services that empower individuals to overcome limiting beliefs, build confidence, and achieve holistic success in both personal and professional spheres.',
      imageUrl: '/assets/images/carousel/10.jpg',
    },
    {
      title: 'Corporate Training Consulting',
      description:
        'We design and deliver customized training programs to enhance employee skills, motivation, and performance, aligning corporate goals with individual growth.',
      imageUrl: '/assets/images/carousel/02.jpg',
    },
    {
      title: 'Public Speaking Coaching',
      description:
        'Our coaching helps individuals master the art of communication, boosting their confidence and effectiveness in delivering impactful messages to audiences.',
      imageUrl: '/assets/images/carousel/11.jpg',
    },
    {
      title: 'Business Consulting',
      description:
        'We provide strategic guidance to entrepreneurs and businesses, helping them refine their vision, develop sustainable models, and position themselves for global success.',
      imageUrl: '/assets/images/carousel/03.jpg',
    },
  ];

  return (
    <Carousel
      plugins={[plugin.current]}
      className='w-full'
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent>
        {slides.map((slide, index) => (
          <CarouselItem key={index}>
            <div className='p-1 relative'>
              <Card className='w-full h-[40rem] sm:h-[28rem] shadow-none rounded-2xl border-none relative overflow-hidden mt-4 bg-inherit'>
                <div className='absolute inset-0 flex flex-col gap-4 sm:flex-row items-center justify-center'>
                  <div className='h-full justify-center flex flex-col gap-4 w-full max-w-[32rem]'>
                    <h1 className='w-full text-gray-900 text-2xl sm:text-4xl font-bold tracking-wide drop-shadow-md relative z-10'>
                      {slide.title}
                    </h1>
                    <p className='text-lg text-muted-foreground sm:text-xl drop-shadow-md w-full'>
                      {slide.description}
                    </p>
                  </div>
                  <div className='w-full h-full flex items-center justify-start relative'>
                    <div className='w-full sm:w-full rounded-2xl'>
                      <Image
                        src={slide.imageUrl}
                        alt={`Slide - ${slide.title}`}
                        fill
                        className='object-cover rounded-[24px] h-full my-auto'
                        loading='lazy'
                      />
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      {/* <CarouselPrevious />
      <CarouselNext /> */}
    </Carousel>
  );
}
