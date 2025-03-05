import { fetchGallery } from '@/lib/api';
import HeaderText from '../header-text';
import GalleryCard from './gallery-card';

const Gallery = async () => {
  let gallery: Gallery[] = [];
  try {
    const data = await fetchGallery();
    gallery = data?.data || []; // Safely handle possible null or undefined values
  } catch (error) {
    console.error(
      'Failed to fetch gallery:',
      error
    );
    return (
      <div>
        <HeaderText title='Gallery' />
        <p className='text-red-500'>
          Failed to load gallery. Please try again
          later.
        </p>
      </div>
    );
  }

  return (
    <div>
      <HeaderText title='Gallery' />
      {gallery.length > 0 ? (
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-8 w-full'>
          {gallery.map((item) => (
            <GalleryCard
              key={item.id}
              gallery={item}
            />
          ))}
        </div>
      ) : (
        <p className='text-gray-500 text-lg mt-5 text-center'>
          No gallery available at the moment
        </p>
      )}
    </div>
  );
};

export default Gallery;
