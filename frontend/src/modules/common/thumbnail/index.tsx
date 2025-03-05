import { cn, getFileIcon } from '@/lib/utils';
import Image from 'next/image';

interface Props {
  type: string;
  extension: string;
  url?: string;
  imageClassName?: string;
  className?: string;
}

export const Thumbnail = ({
  type,
  extension,
  url = '',
  imageClassName,
  className,
}: Props) => {
  const isImage =
    type === 'image' && extension !== 'svg';

  return (
    <figure
      className={cn(
        'size-[30px] min-w-[50px] overflow-hidden rounded-full',
        className
      )}
    >
      <Image
        src={
          isImage
            ? url
            : getFileIcon(extension, type)
        }
        alt='thumbnail'
        width={100}
        height={100}
        className={cn(
          'size-8 object-contain',
          imageClassName,
          isImage &&
            'size-full object-cover object-center !important'
        )}
      />
    </figure>
  );
};
export default Thumbnail;
