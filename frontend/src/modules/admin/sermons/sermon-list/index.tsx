'use client';

import { useEffect, useState } from 'react';
import { SermonCard } from '../sermon-card';
import { serverAction } from '../../actions';

export const SermonList = () => {
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSermons = async () => {
      setIsLoading(true);
      try {
        const response = await serverAction('sermons/admin', 'GET', null);
        if (response.success) {
          setSermons(response.data || []);
        } else {
          setError(response.error || 'Failed to fetch sermons');
        }
      } catch (err) {
        setError('An error occurred while fetching sermons');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSermons();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-2 text-red-600 underline"
        >
          Try again
        </button>
      </div>
    );
  }

  if (sermons.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 p-8 rounded-md text-center">
        <h3 className="text-lg font-medium text-gray-700 mb-2">No sermons found</h3>
        <p className="text-gray-500">Create your first sermon to get started.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {sermons.map((sermon) => (
        <SermonCard key={sermon.id} sermon={sermon} />
      ))}
    </div>
  );
}; 