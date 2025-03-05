'use client';

import { Button } from '@/components/ui/button';
import { ColumnDef } from '@tanstack/react-table';
import {
  ArrowUpDown,
  Edit,
  Eye,
  Trash,
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';
import ModalDeleteStudent from '../modal-delete-student';

export const studentColumns: ColumnDef<Student>[] =
  [
    {
      header: '#',
      cell: ({ row }) => {
        return (
          <p className='text-14-medium'>
            {row.index + 1}
          </p>
        );
      },
    },
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => {
        const user = row.original.user.name;
        return (
          <div className='flex items-center gap-4'>
            <div>
              <p>{user}</p>
              <p className='text-muted-foreground text-sm w-5'>
                {row.original.user.email}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'accountType',
      header: ({ column }) => (
        <Button
          className='h-8 max-sm:hidden'
          variant='ghost'
          onClick={() =>
            column.toggleSorting(
              column.getIsSorted() === 'asc'
            )
          }
        >
          Account Type
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      ),
      cell: ({ row }) => (
        <div className='flex ml-4 gap-2 items-center max-sm:hidden'>
          {row.getValue('accountType')}
        </div>
      ),
    },

    {
      accessorKey: 'action',
      header: 'Actions',
      cell: ({ row }) => {
        const student = row.original;

        const [
          isDeleteModalOpen,
          setDeleteModalOpen,
        ] = useState(false);
        const [
          isViewModalOpen,
          setViewModalOpen,
        ] = useState(false);

        const { data: session } = useSession(); // Get the current session

        // Extract the role from the session
        const role = session?.role; // Ensure role is stored in the session
        console.log({ session });

        const handleOpenDeleteModal = () =>
          setDeleteModalOpen(true);
        const handleCloseDeleteModal = () =>
          setDeleteModalOpen(false);

        return (
          <div className='h-8 flex gap-1'>
            <Button
              asChild
              variant='ghost'
              className='px-[0.4rem] h-8 text-gray-500'
            >
              <Link
                target='_blank'
                rel='noopener noreferrer'
                href={`/admin/download/${student.id}/preview`}
              >
                <Eye className='h-4 w-4' />
              </Link>
            </Button>

            {/* Edit button - visible only to ADMIN */}
            {role === 'ADMIN' && (
              <Button
                asChild
                variant='ghost'
                className='px-[0.4rem] h-8 text-gray-500'
              >
                <Link
                  href={`/admin/students/edit/${student.id}`}
                >
                  <Edit className='h-4 w-4' />
                </Link>
              </Button>
            )}

            {/* Delete button - visible only to ADMIN */}
            {role === 'ADMIN' && (
              <Button
                onClick={handleOpenDeleteModal}
                variant='ghost'
                className='px-[0.4rem] h-8'
              >
                <Trash className='h-4 w-4 text-red-600' />
              </Button>
            )}

            {/* {isViewModalOpen && (
              <ModalViewuser
                isOpen={isViewModalOpen}
                user={user}
                onClose={handleCloseViewModal}
              />
            )}

            */}
            {isDeleteModalOpen && (
              <ModalDeleteStudent
                isOpen={isDeleteModalOpen}
                student={student}
                onClose={handleCloseDeleteModal}
              />
            )}
          </div>
        );
      },
    },
  ];
