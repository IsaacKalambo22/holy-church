'use client';
import { Button } from '@/components/ui/button';
import {
  DialogClose,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

import useCustomPath from '@/hooks/use-custom-path';
import CustomButton, {
  BUTTON_VARIANT,
} from '@/modules/common/custom-button';
import Modal from '@/modules/common/modal';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { deleteUser } from '../../actions';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  user: User;
};

const ModalDeleteUser = ({
  isOpen,
  onClose,
  user,
}: Props) => {
  const [isLoading, setIsLoading] =
    useState(false);
  const path = usePathname();
  const { fullPath } = useCustomPath(path);

  const onSubmit = async () => {
    setIsLoading(true);

    const result = await deleteUser(
      user.id,
      fullPath,
      '/admin'
    );

    if (result.success) {
      toast.success('User deleted successfully');
    } else {
      toast.error(
        result.error ?? 'An error occurred.'
      );
    }
    onClose();

    setIsLoading(false);
  };
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      name={`Delete User`}
    >
      <DialogDescription>
        Are you sure you want to delete this user?
      </DialogDescription>
      <DialogFooter className='flex flex-col gap-3 md:flex-row'>
        <DialogClose asChild>
          <Button
            type='button'
            className='h-9'
            variant='secondary'
          >
            Close
          </Button>
        </DialogClose>
        <CustomButton
          isLoading={isLoading}
          loadingText='Deleting...'
          variant={BUTTON_VARIANT.DESTRUCTIVE}
          className='h-9'
          onClick={onSubmit}
        >
          Confirm
        </CustomButton>
      </DialogFooter>
    </Modal>
  );
};

export default ModalDeleteUser;
