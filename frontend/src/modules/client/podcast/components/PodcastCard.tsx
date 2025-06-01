import Image from 'next/image';
import Link from 'next/link';
import { PodcastEpisode } from '../types';
import { AudioPlayer } from './AudioPlayer';

interface PodcastCardProps {
  episode: PodcastEpisode;
}

export const PodcastCard = ({ episode }: PodcastCardProps) => {
  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden">
      <Link href={`/podcasts/${episode.slug}`}>
        <div className="relative h-48 w-full">
          <Image
            src={episode.coverImage}
            alt={episode.title}
            fill
            className="object-cover"
          />
        </div>
      </Link>
      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm text-gray-500">{episode.date}</span>
          {episode.series && (
            <span className="px-3 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
              {episode.series}
            </span>
          )}
          <span className="text-sm text-gray-500 ml-auto">{episode.duration}</span>
        </div>
        <Link href={`/podcasts/${episode.slug}`}>
          <h2 className="text-xl font-semibold mb-2 hover:text-blue-600 transition-colors">
            {episode.title}
          </h2>
        </Link>
        <p className="text-gray-600 mb-4 line-clamp-2">{episode.description}</p>
        
        <div className="mb-4">
          <div className="flex items-center gap-2">
            {episode.host.image && (
              <Image
                src={episode.host.image}
                alt={episode.host.name}
                width={24}
                height={24}
                className="rounded-full"
              />
            )}
            <span className="text-sm font-medium">{episode.host.name}</span>
            {episode.guests && episode.guests.length > 0 && (
              <>
                <span className="text-gray-400 mx-2">with</span>
                <div className="flex items-center -space-x-1">
                  {episode.guests.map((guest) => (
                    <div key={guest.name} className="relative">
                      {guest.image && (
                        <Image
                          src={guest.image}
                          alt={guest.name}
                          width={24}
                          height={24}
                          className="rounded-full border-2 border-white"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        <AudioPlayer audioUrl={episode.audioUrl} title={episode.title} />
      </div>
    </article>
  );
};
