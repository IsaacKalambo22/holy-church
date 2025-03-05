'use client';

import { Dialog } from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { adminActionsDropdownItems } from '../../constants';
import ModalDeleteCourse from '../modal-delete-course';

type Props = {
  course: Course;
};

const CourseActionDropdown = ({
  course,
}: Props) => {
  const [isModalOpen, setIsModalOpen] =
    useState(false);
  const [isDropdownOpen, setIsDropdownOpen] =
    useState(false);
  const [action, setAction] =
    useState<ActionType | null>(null);
  const router = useRouter();

  const handleEdit = (courseId: string) => {
    router.push(
      `/admin/courses/edit/${courseId}`,
      {
        scroll: false,
      }
    );
  };

  const handleActionClick = (
    actionItem: ActionType
  ) => {
    setAction(actionItem);
    setIsDropdownOpen(false); // Close dropdown when an action is clicked

    if (actionItem.value === 'edit') {
      handleEdit(course.id); // Move router.push() outside render
    } else if (actionItem.value === 'delete') {
      setIsModalOpen(true);
    }
  };

  return (
    <Dialog
      open={isModalOpen}
      onOpenChange={setIsModalOpen}
    >
      <DropdownMenu
        open={isDropdownOpen}
        onOpenChange={setIsDropdownOpen}
      >
        <DropdownMenuTrigger className='shad-no-focus'>
          <div className='rounded-full bg-white/80 hover:bg-white/90 backdrop-blur-md shadow-md p-2 z-50'>
            <Image
              src='/assets/icons/dots.svg'
              alt='dots'
              width={18}
              height={18}
            />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel className='max-w-[200px] truncate'>
            {course.title}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {adminActionsDropdownItems.map(
            (actionItem) => (
              <DropdownMenuItem
                key={actionItem.value}
                className='shad-dropdown-item'
                onClick={() =>
                  handleActionClick(actionItem)
                } // Handle actions safely
              >
                <div className='flex items-center gap-2'>
                  <Image
                    src={actionItem.icon}
                    alt={actionItem.label}
                    width={30}
                    height={30}
                  />
                  {actionItem.label}
                </div>
              </DropdownMenuItem>
            )
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {action?.value === 'delete' &&
        isModalOpen && (
          <ModalDeleteCourse
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            course={course}
          />
        )}
    </Dialog>
  );
};

export default CourseActionDropdown;
