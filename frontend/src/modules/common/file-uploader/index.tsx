'use client';

import Image from 'next/image';
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

import {
  convertFileToUrl,
  getFileType,
} from '@/lib/utils';
import Thumbnail from '../thumbnail';

type FileUploaderProps = {
  files: File[] | undefined;
  onChange: (files: File[]) => void;
};

export const FileUploader = ({
  files,
  onChange,
}: FileUploaderProps) => {
  const handleRemoveFile = (
    e: React.MouseEvent<
      HTMLImageElement,
      MouseEvent
    >,
    fileName: string
  ) => {
    e.preventDefault();
    e.stopPropagation();

    if (files) {
      const updatedFiles = files.filter(
        (file) => file.name !== fileName
      );
      onChange(updatedFiles); // Directly pass the updated array
    }
  };

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const existingFiles = files || [];
      const newFiles = [
        ...existingFiles,
        ...acceptedFiles,
      ].slice(0, 4); // Max 4 files
      onChange(newFiles); // Update with merged and limited files
    },
    [files, onChange]
  );

  const { getRootProps, getInputProps } =
    useDropzone({ onDrop });

  return (
    <div
      {...getRootProps()}
      className='flex cursor-pointer relative flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed border-gray-200 bg-white p-8  min-h-[70px]'
    >
      <input {...getInputProps()} />
      {files && files?.length > 0 ? (
        <>
          {files.length > 0 && (
            <ul className=' absolute  flex top-[-8px] left-2 w-full size-full h-fit gap-3 rounded-[1px] bg-transparent py-4'>
              {files.map((file, index) => {
                const { type, extension } =
                  getFileType(file.name);

                return (
                  <div
                    key={`${file.name}-${index}`}
                    className='relative flex items-center justify-between gap-3 rounded-xl h-full'
                  >
                    <div className='flex flex-col gap-0'>
                      <div className='relative'>
                        <Thumbnail
                          type={type}
                          extension={extension}
                          url={convertFileToUrl(
                            file
                          )}
                          imageClassName='h-12 w-10'
                        />
                        <Image
                          src='/assets/icons/remove.svg'
                          width={24}
                          height={24}
                          alt='Remove'
                          onClick={(e) =>
                            handleRemoveFile(
                              e,
                              file.name
                            )
                          }
                          className='absolute top-0 right-0 cursor-pointer p-1 rounded-full bg-white shadow-md'
                        />
                      </div>
                      {/* <div className='line-clamp-1 max-w-[100px]'>
                        {file.name}
                      </div> */}
                    </div>
                  </div>
                );
              })}
            </ul>
          )}
        </>
      ) : (
        <>
          <Image
            src='/assets/icons/upload.svg'
            width={40}
            height={40}
            alt='upload'
          />
          <div className='flex flex-col justify-center gap-2 text-center text-gray-600'>
            <p className='text-14-regular '>
              <span className='text-blue-500'>
                Click to upload{' '}
              </span>
              or drag and drop your file
            </p>
          </div>
        </>
      )}
    </div>
  );
};
