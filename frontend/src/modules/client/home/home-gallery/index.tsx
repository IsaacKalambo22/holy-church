import { fetchGallery } from '@/lib/api';
import GalleryCard from '../../gallery/gallery-card';

const HomeGallery = async () => {
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
      <div className='flex flex-col items-center gap-10 mb-16'>
        <h2 className='blue_gradient'>
          Our Gallery
        </h2>
        <p className='text-red-500'>
          Failed to load gallery. Please try again
          later.
        </p>
      </div>
    );
  }

  return (
    <div className='w-full'>
      {gallery.length > 0 ? (
        <div className='flex flex-col items-center gap-5 mb-10'>
          <h2 className='blue_gradient'>
            Our Gallery
          </h2>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-8 w-full'>
            {gallery.slice(0, 2).map((item) => (
              <GalleryCard
                key={item.id}
                gallery={item}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className='flex flex-col items-center gap-5 mb-10'>
          <h2 className='blue_gradient'>
            Our Gallery
          </h2>
          <p className='text-gray-500 text-lg mt-5'>
            No gallery available at the moment
          </p>
        </div>
      )}
    </div>
  );
};

export default HomeGallery;
