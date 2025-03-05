import GalleryCard from '../gallery-card';
interface Props {
  gallery: Gallery[];
}
const GalleryList = ({ gallery }: Props) => {
  return (
    <div className='grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'>
      {gallery.map((item) => (
        <GalleryCard
          key={item.id}
          gallery={item}
        />
      ))}
    </div>
  );
};

export default GalleryList;
