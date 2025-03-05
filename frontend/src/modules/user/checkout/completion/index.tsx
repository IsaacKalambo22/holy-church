'use client';

import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import Link from 'next/link';

const Completion = () => {
  return (
    <div className='flex flex-col h-full items-center justify-center bg-background text-foreground'>
      <div className='text-center'>
        <div className='mb-4 rounded-full bg-green-500 p-3 inline-flex items-center justify-center'>
          <Check className='w-16 h-16' />
        </div>
        <h1 className='text-2xl font-bold mb-3'>
          COMPLETED
        </h1>
        <p className='mb-1'>
          🎉 You have made a course purchase
          successfully! 🎉
        </p>
      </div>
      <div className='completion__support'>
        <p>
          Need help? Contact our{' '}
          <Button
            variant='link'
            asChild
            className='p-0 m-0 text-primary-700'
          >
            <a href='mailto:support@pacificdiagnostics.com'>
              customer support
            </a>
          </Button>
          .
        </p>
      </div>
      <Button className='completion__action'>
        <Link href='/user/courses' scroll={false}>
          Go to Courses
        </Link>
      </Button>
    </div>
  );
};

export default Completion;
