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
      title: 'A PASSION FOR JESUS CHRIST',
      description:
        'Foremost in the life of our church is a passion for Jesus Christ manifested by an adherence to God’s Word and a dependence on the Holy Spirit’s empowering presence. (John 14:23-26)',
      imageUrl: '/assets/images/carousel/1.jpg',
    },

    {
      title: 'WITNESSING TO THE GOOD NEWS OF JESUS CHRIST',
      description:
        'Flowing out of God’s love for the world is our commitment to lovingly witness the good news of Jesus Christ to our family, friends, and other seekers. (John 3:16-17)',
      imageUrl: '/assets/images/carousel/01.jpeg',
    },
    {
      title: 'CHRISTIAN COMMUNITY',
      description:
        'We value as essential establishing and nurturing a Christian community united in love for Jesus Christ and one another. (John 13:34-35)',
      imageUrl: '/assets/images/carousel/9.jpg',
    },
    {
      title: 'DISCIPLESHIP',
      description:
        'We are dedicated to helping Christians become passionate in their devotion for the person, mission and lifestyle of Jesus Christ. (Matthew 28:16-20)',
      imageUrl: '/assets/images/carousel/1.jpg',
    },
    {
      title: 'THE MINISTRY OF GRACE',
      description:
        'Having received and benefited from God’s unconditional love; our desire is to minister His grace to others. (Ephesians 2:1-10)',
      imageUrl: '/assets/images/carousel/03.jpg',
    },
    // {
    //   title: 'Team Building Consulting',
    //   description:
    //     'Our team-building sessions foster collaboration, trust, and synergy within organizations, enhancing productivity and workplace harmony.',
    //   imageUrl: '/assets/images/carousel/2.jpg',
    // },
    // {
    //   title: 'Life Coaching',
    //   description:
    //     'We provide life coaching services that empower individuals to overcome limiting beliefs, build confidence, and achieve holistic success in both personal and professional spheres.',
    //   imageUrl: '/assets/images/carousel/10.jpg',
    // },
    // {
    //   title: 'Corporate Training Consulting',
    //   description:
    //     'We design and deliver customized training programs to enhance employee skills, motivation, and performance, aligning corporate goals with individual growth.',
    //   imageUrl: '/assets/images/carousel/02.jpg',
    // },
    // {
    //   title: 'Public Speaking Coaching',
    //   description:
    //     'Our coaching helps individuals master the art of communication, boosting their confidence and effectiveness in delivering impactful messages to audiences.',
    //   imageUrl: '/assets/images/carousel/11.jpg',
    // },
    // {
    //   title: 'Business Consulting',
    //   description:
    //     'We provide strategic guidance to entrepreneurs and businesses, helping them refine their vision, develop sustainable models, and position themselves for global success.',
    //   imageUrl: '/assets/images/carousel/03.jpg',
    // },
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
                    <h1 className='w-full text-purple-900 text-2xl sm:text-4xl font-bold tracking-wide drop-shadow-md relative z-10'>
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
