'use client';

import { usePathname } from 'next/navigation';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { deleteSermon } from '../../actions';

interface DeleteSermonModalProps {
  sermon: Sermon;
  isOpen: boolean;
  onClose: () => void;
  isDeleting: boolean;
  setIsDeleting: (isDeleting: boolean) => void;
}

export const DeleteSermonModal = ({
  sermon,
  isOpen,
  onClose,
  isDeleting,
  setIsDeleting,
}: DeleteSermonModalProps) => {
  const pathname = usePathname();

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteSermon(sermon.id, pathname, '/admin/sermons');
      onClose();
    } catch (error) {
      console.error('Error deleting sermon:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the sermon &quot;{sermon.title}&quot;. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}; 