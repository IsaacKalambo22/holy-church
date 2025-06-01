import { PodcastEpisode } from '../types';
import { PodcastCard } from './PodcastCard';

interface PodcastGridProps {
  episodes: PodcastEpisode[];
}

export const PodcastGrid = ({ episodes }: PodcastGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {episodes.map((episode) => (
        <PodcastCard key={episode.id} episode={episode} />
      ))}
    </div>
  );
};
