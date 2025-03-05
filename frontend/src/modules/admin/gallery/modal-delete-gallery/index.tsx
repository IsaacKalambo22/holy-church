'use client';
import { Button } from '@/components/ui/button';
import {
  DialogClose,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import useCustomPath from '@/hooks/use-custom-path';
import { removeFromS3 } from '@/lib/aws';
import CustomButton, {
  BUTTON_VARIANT,
} from '@/modules/common/custom-button';
import Modal from '@/modules/common/modal';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { deleteGallery } from '../../actions';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  gallery: Gallery;
};

const ModalDeleteGallery = ({
  isOpen,
  onClose,
  gallery,
}: Props) => {
  const [isLoading, setIsLoading] =
    useState(false);
  const path = usePathname();
  const { fullPath } = useCustomPath(path);

  const onSubmit = async () => {
    setIsLoading(true);

    const result = await deleteGallery(
      gallery.id,
      fullPath,
      '/admin'
    );

    onClose();
    if (result.success) {
      await removeFromS3(gallery.imageUrls);

      toast.success(
        'Gallery deleted successfully'
      );
    } else {
      toast.error(
        result.error ?? 'An error occurred.'
      );
    }
    setIsLoading(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      name={`Delete Gallery`}
    >
      <DialogDescription>
        Are you sure you want to delete this
        gallery?
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

export default ModalDeleteGallery;
