'use client';

import { Button } from '@/components/ui/button';
import { PlusSquare } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ReactElement, useState } from 'react';
import { toast } from 'sonner';
import { createCourse } from '../actions';
import ModalNewGallery from '../gallery/modal-new-gallery';

export enum AddNewType {
  NEW_COURSE = 'New Course',
  NEW_USER = 'New User',
  NEW_STUDENT = 'New Student',
  NEW_GALLERY = 'New Gallery',
}

interface HeaderProps {
  name: string; // Dynamic header title
  buttonName?: string; // Use the enum for button name
}

const AddNewHeader = ({
  name,
  buttonName,
}: HeaderProps): ReactElement => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const { data: session } = useSession();
  const user = session?.user;
  const handleButtonClick = async () => {
    if (buttonName === AddNewType.NEW_COURSE) {
      if (!user) return;
      const payload = {};
      const result = await createCourse(
        payload,
        '/',
        '/admin/dashboard'
      );
      console.log({ result }); // Debugging log
      if (result.success) {
        router.push(
          `/admin/courses/edit/${result?.data?.id}`,
          { scroll: false }
        );
        toast.success(
          'New course created successfully'
        );
      } else {
        toast.error(
          result.error ?? 'An error occurred.'
        );
      }
    }
    if (buttonName === AddNewType.NEW_STUDENT) {
      router.push(`/admin/students/new-student`, {
        scroll: false,
      });
    } 
    if (buttonName === AddNewType.NEW_USER) {
      router.push(`/admin/users/new-user`, {
        scroll: false,
      });
    } 
    
    else {
      // Handle other button actions
      setIsOpen((prev) => !prev); // Toggle modal visibility
      // console.log(
      //   `${buttonName} button clicked!`
      // );
    }
  };

  const handleClose = () => {
    setIsOpen(false); // Close modal
    // console.log('Modal closed!');
  };

  return (
    <div className='mb-5 flex w-full items-center justify-between'>
      {/* Dynamic Header Title */}
      <h1 className='text-lg font-semibold dark:text-white'>
        {name}
      </h1>

      {/* Conditional Button Rendering */}
      {buttonName && (
        <Button onClick={handleButtonClick}>
          <PlusSquare className='h-4 w-4 mr-2' />
          {buttonName}
        </Button>
      )}

      {/* Conditional Modal Rendering */}
      {isOpen &&
        buttonName === AddNewType.NEW_GALLERY && (
          <ModalNewGallery
            isOpen={isOpen}
            onClose={handleClose}
          />
        )}
    </div>
  );
};

export default AddNewHeader;
