'use client';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import React, {
  useEffect,
  useState,
} from 'react';

export const InfiniteMovingCards = ({
  items,
  direction = 'left',
  speed = 'fast',
  pauseOnHover = true,
  className,
}: {
  items: {
    quote: string;
    image?: string;
    name: string;
    title: string;
  }[];
  direction?: 'left' | 'right';
  speed?: 'fast' | 'normal' | 'slow';
  pauseOnHover?: boolean;
  className?: string;
}) => {
  const containerRef =
    React.useRef<HTMLDivElement>(null);
  const scrollerRef =
    React.useRef<HTMLUListElement>(null);

  useEffect(() => {
    addAnimation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [start, setStart] = useState(false);
  function addAnimation() {
    if (
      containerRef.current &&
      scrollerRef.current
    ) {
      const scrollerContent = Array.from(
        scrollerRef.current.children
      );

      scrollerContent.forEach((item) => {
        const duplicatedItem =
          item.cloneNode(true);
        if (scrollerRef.current) {
          scrollerRef.current.appendChild(
            duplicatedItem
          );
        }
      });

      getDirection();
      getSpeed();
      setStart(true);
    }
  }
  const getDirection = () => {
    if (containerRef.current) {
      if (direction === 'left') {
        containerRef.current.style.setProperty(
          '--animation-direction',
          'forwards'
        );
      } else {
        containerRef.current.style.setProperty(
          '--animation-direction',
          'reverse'
        );
      }
    }
  };
  const getSpeed = () => {
    if (containerRef.current) {
      if (speed === 'fast') {
        containerRef.current.style.setProperty(
          '--animation-duration',
          '20s'
        );
      } else if (speed === 'normal') {
        containerRef.current.style.setProperty(
          '--animation-duration',
          '40s'
        );
      } else {
        containerRef.current.style.setProperty(
          '--animation-duration',
          '80s'
        );
      }
    }
  };
  return (
    <div
      ref={containerRef}
      className={cn(
        // max-w-7xl to w-screen
        'scroller max-w-7xl [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)] scroller relative z-20 w-[80vw] overflow-hidden  ',
        className
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          // change gap-16
          ' flex min-w-full shrink-0 gap-4 md:gap-16 py-4 w-max flex-nowrap',
          start && 'animate-scroll ',
          pauseOnHover &&
            'hover:[animation-play-state:paused]'
        )}
      >
        {items.map((item, i) => (
          <li
            className='w-full max-w-[500px] relative rounded-2xl border flex-shrink-0 border-slate-700 px-8 py-4 justify-center md:w-[450px]'
            key={i}
          >
            <blockquote>
              <span className=' relative z-20 text-sm leading-[1.6] text-gray-700 font-normal'>
                {item.quote}
              </span>
              <div className='relative z-20 flex flex-row items-center'>
                <div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
                  <Avatar className='h-20 w-20 rounded-full'>
                    {item?.image && (
                      <AvatarImage
                        src={item.image}
                        alt={item.name}
                      />
                    )}
                    <AvatarFallback className='rounded-full'>
                      {item?.name
                        ? item.name
                            .charAt(0)
                            .toUpperCase()
                        : 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className=' flex-1 text-left text-sm leading-tight'>
                    <span className='truncate font-semibold'>
                      {item.name}
                    </span>
                  </div>
                </div>
              </div>
            </blockquote>
          </li>
        ))}
      </ul>
    </div>
  );
};
