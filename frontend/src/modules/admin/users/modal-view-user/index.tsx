'use client';

import { Button } from '@/components/ui/button';
import { documentProps } from '@/lib/api';
import Modal from '../../modal';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  document: documentProps;
};

const ModalViewdocument = ({
  isOpen,
  onClose,
  document,
}: Props) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      name={document.name || 'document Details'}
    >
      <div className='space-y-6'>
        {/* document Details */}
        <div>
          <h2 className='text-xl font-semibold'>
            {document.name}
          </h2>
          <p className='text-gray-600 text-sm mt-2'>
            Email: {document.email}
          </p>
          <p className='text-gray-600 text-sm mt-2'>
            Phone Number: {document.phoneNumber}
          </p>
        </div>

        {/* Role and Verification */}
        <div className='space-y-2'>
          <p className='text-sm'>
            <span className='font-medium'>
              Role:
            </span>{' '}
            {document.role}
          </p>
          <p className='text-sm'>
            <span className='font-medium'>
              Verified:
            </span>{' '}
            {document.isVerified ? 'Yes' : 'No'}
          </p>
        </div>

        {/* Last Login */}
        <div>
          <h3 className='text-sm font-medium'>
            Last Login
          </h3>
          <p className='text-sm text-gray-800'>
            {document.lastLogin
              ? new Date(
                  document.lastLogin
                ).toLocaleString()
              : 'Never logged in'}
          </p>
        </div>
      </div>

      {/* Close Button */}
      <div className='mt-6 flex justify-end'>
        <Button variant='ghost' onClick={onClose}>
          Close
        </Button>
      </div>
    </Modal>
  );
};

export default ModalViewdocument;
