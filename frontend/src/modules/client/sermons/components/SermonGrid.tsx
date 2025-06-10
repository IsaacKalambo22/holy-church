import { Sermon } from '../types';
import { SermonCard } from './SermonCard';

interface SermonGridProps {
  sermons: Sermon[];
}

export const SermonGrid = ({ sermons }: SermonGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {sermons.map((sermon) => (
        <SermonCard key={sermon.id} sermon={sermon} />
      ))}
    </div>
  );
}; 