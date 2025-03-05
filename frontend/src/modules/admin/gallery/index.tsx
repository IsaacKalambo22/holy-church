import { fetchGallery } from '@/lib/api';
import AddNewHeader from '@/modules/admin/add-new-header';
import GalleryList from './gallery-list';

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
        <AddNewHeader
          name='Gallery'
          buttonName='New Gallery'
        />
        <p className='text-red-500'>
          Failed to load gallery. Please try again
          later.
        </p>
      </div>
    );
  }

  return (
    <div>
      <AddNewHeader
        name='Gallery'
        buttonName='New Gallery'
      />
      {gallery.length > 0 ? (
        <GalleryList gallery={gallery} />
      ) : (
        <p className='text-gray-500 text-lg mt-5'>
          No gallery available. Create a new
          gallery to get started!
        </p>
      )}
    </div>
  );
};

export default Gallery;
