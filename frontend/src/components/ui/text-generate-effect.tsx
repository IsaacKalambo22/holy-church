'use client';

import { cn } from '@/lib/utils';
import {
  motion,
  stagger,
  useAnimate,
  useInView,
} from 'framer-motion';
import { useEffect, useRef } from 'react';

export const TextGenerateEffect = ({
  words,
  className,
  filter = true,
  duration = 0.5,
}: {
  words: string;
  className?: string;
  filter?: boolean;
  duration?: number;
}) => {
  const ref = useRef(null);
  const [scope, animate] = useAnimate();
  const inView = useInView(ref, { once: true }); // Only animate once when in view
  const wordsArray = words.split(' ');

  useEffect(() => {
    if (inView) {
      animate(
        'span',
        {
          opacity: 1,
          filter: filter ? 'blur(0px)' : 'none',
        },
        {
          duration: duration || 1,
          delay: stagger(0.2),
        }
      );
    }
  }, [inView]);

  return (
    <div className={cn('', className)}>
      <div ref={ref} className='mt-4'>
        <motion.p
          ref={scope}
          className='dark:text-white text-muted-foreground text-xl leading-snug tracking-wide'
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{
            duration: 0.6,
            delay: 0.2,
          }}
          viewport={{ amount: 0.3 }} // Triggers animation when 30% of the element is visible
        >
          {wordsArray.map((word, idx) => (
            <motion.span
              key={word + idx}
              className='dark:text-white text-muted-foreground opacity-0'
              style={{
                filter: filter
                  ? 'blur(10px)'
                  : 'none',
              }}
            >
              {word}{' '}
            </motion.span>
          ))}
        </motion.p>
      </div>
    </div>
  );
};
