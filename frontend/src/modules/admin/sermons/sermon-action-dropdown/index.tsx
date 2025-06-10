'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Edit, Trash, Eye, EyeOff } from 'lucide-react';
import { deleteSermon, publishSermon } from '../../actions';
import { DeleteSermonModal } from '../delete-sermon-modal';
import { EditSermonModal } from '../edit-sermon-modal';

interface SermonActionDropdownProps {
  sermon: Sermon;
  isDeleting: boolean;
  setIsDeleting: (isDeleting: boolean) => void;
  isPublishing: boolean;
  setIsPublishing: (isPublishing: boolean) => void;
}

export const SermonActionDropdown = ({
  sermon,
  isDeleting,
  setIsDeleting,
  isPublishing,
  setIsPublishing
}: SermonActionDropdownProps) => {
  const pathname = usePathname();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handlePublishToggle = async () => {
    try {
      setIsPublishing(true);
      await publishSermon(sermon.id, !sermon.isPublished, pathname);
    } catch (error) {
      console.error('Error toggling publish status:', error);
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0 bg-white bg-opacity-80 hover:bg-opacity-100">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setIsEditModalOpen(true)}>
            <Edit className="mr-2 h-4 w-4" />
            <span>Edit</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handlePublishToggle} disabled={isPublishing}>
            {sermon.isPublished ? (
              <>
                <EyeOff className="mr-2 h-4 w-4" />
                <span>Unpublish</span>
              </>
            ) : (
              <>
                <Eye className="mr-2 h-4 w-4" />
                <span>Publish</span>
              </>
            )}
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => setIsDeleteModalOpen(true)} 
            className="text-red-600 focus:text-red-600"
          >
            <Trash className="mr-2 h-4 w-4" />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <EditSermonModal
        sermon={sermon}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />

      <DeleteSermonModal
        sermon={sermon}
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        isDeleting={isDeleting}
        setIsDeleting={setIsDeleting}
      />
    </>
  );
}; 