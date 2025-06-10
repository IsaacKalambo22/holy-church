'use client';

import { useState } from 'react';
import { SermonList } from './sermon-list';
import { CreateSermonModal } from './create-sermon';

export const SermonsAdmin = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Sermons</h1>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
        >
          <span>Add Sermon</span>
        </button>
      </div>
      
      <SermonList />
      
      <CreateSermonModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
      />
    </div>
  );
}; 