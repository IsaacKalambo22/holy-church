'use client';
import { Button } from '@/components/ui/button';
import {
  DialogClose,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import useCustomPath from '@/hooks/use-custom-path';
import { removeFromS3 } from '@/lib/aws';
import { deleteCourseAttachment } from '@/modules/admin/actions';
import CustomButton, {
  BUTTON_VARIANT,
} from '@/modules/common/custom-button';
import Modal from '@/modules/common/modal';
import {
  usePathname,
  useRouter,
} from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  attachment: Attachment;
  courseId: string;
};

const ModalDeleteAttachment = ({
  isOpen,
  onClose,
  attachment,
  courseId,
}: Props) => {
  const [isLoading, setIsLoading] =
    useState(false);
  const path = usePathname();
  const { fullPath } = useCustomPath(path);
  const router = useRouter();

  const onSubmit = async () => {
    setIsLoading(true);

    const result = await deleteCourseAttachment(
      attachment.id,
      fullPath,
      '/admin/courses/edit/[courseId]'
    );

    if (result.success) {
      router.push(
        `/admin/courses/edit/${courseId}`
      );
      await removeFromS3(attachment.url);
      toast.success(
        'Attachment deleted successfully'
      );
      onClose();
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
      name={`Delete Attachment`}
    >
      <DialogDescription>
        Are you sure you want to delete this
        attachment?
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

export default ModalDeleteAttachment;
