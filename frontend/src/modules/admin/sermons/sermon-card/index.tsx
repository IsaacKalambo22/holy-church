'use client';

import Image from 'next/image';
import { useState } from 'react';
import { format } from 'date-fns';
import { SermonActionDropdown } from '../sermon-action-dropdown';
import { Badge } from '@/components/ui/badge';

interface SermonCardProps {
  sermon: Sermon;
}

export const SermonCard = ({ sermon }: SermonCardProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  
  const formattedDate = sermon.date ? format(new Date(sermon.date), 'MMM d, yyyy') : 'No date';
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative h-48 w-full">
        <Image
          src={sermon.thumbnailUrl}
          alt={sermon.title}
          fill
          className="object-cover"
        />
        <div className="absolute top-2 right-2">
          <SermonActionDropdown 
            sermon={sermon}
            isDeleting={isDeleting}
            setIsDeleting={setIsDeleting}
            isPublishing={isPublishing}
            setIsPublishing={setIsPublishing}
          />
        </div>
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
          {sermon.duration}
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-500">{formattedDate}</span>
          <Badge variant={sermon.isPublished ? "success" : "secondary"}>
            {sermon.isPublished ? 'Published' : 'Draft'}
          </Badge>
        </div>
        <h3 className="font-semibold text-lg mb-1 line-clamp-2">{sermon.title}</h3>
        <p className="text-gray-600 text-sm mb-2 line-clamp-2">{sermon.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">By {sermon.preacher}</span>
          {sermon.category && (
            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
              {sermon.category}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}; 