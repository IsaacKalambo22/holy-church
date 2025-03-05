import { Card } from '@/components/ui/card';
import { GalleryProps } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import ImageSlider from '@/modules/common/image-slider';
import { CalendarIcon } from 'lucide-react';

interface Props {
  gallery: GalleryProps;
}

const GalleryCard = ({ gallery }: Props) => {
  return (
    <Card className='shadow-lg rounded-3xl overflow-hidden hover:shadow-xl transition-shadow duration-300 p-6'>
      <ImageSlider urls={gallery.imageUrls} />

      <div className='pt-3'>
        <p className='text-gray-600 text-[1rem] leading-relaxed mb-2'>
          {gallery.caption}
        </p>
        <div className='flex items-center gap-2'>
          <CalendarIcon className='w-5 h-5 text-gray-600' />
          <p className='text-sm font-semibold text-gray-800'>
            {formatDate(gallery.date)}
          </p>
        </div>
      </div>
    </Card>
  );
};
export default GalleryCard;
