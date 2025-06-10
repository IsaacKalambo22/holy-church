import Image from 'next/image';
import Link from 'next/link';
import { Sermon } from '../types';

interface SermonCardProps {
  sermon: Sermon;
}

export const SermonCard = ({ sermon }: SermonCardProps) => {
  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-[1.02]">
      <Link href={`/sermons/${sermon.id}`}>
        <div className="relative h-48 w-full">
          <Image
            src={sermon.thumbnailUrl}
            alt={sermon.title}
            fill
            className="object-cover"
          />
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
            {sermon.duration}
          </div>
        </div>
        <div className="p-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm text-gray-500">{sermon.date}</span>
            {sermon.category && (
              <span className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                {sermon.category}
              </span>
            )}
          </div>
          <h2 className="text-xl font-semibold mb-2 line-clamp-2">{sermon.title}</h2>
          <p className="text-gray-600 line-clamp-3">{sermon.description}</p>
          <div className="mt-4 flex items-center">
            <span className="text-sm font-medium">By {sermon.preacher}</span>
          </div>
        </div>
      </Link>
    </article>
  );
}; 