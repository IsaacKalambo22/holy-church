'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export const SermonSearch = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [preacher, setPreacher] = useState(searchParams.get('preacher') || '');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (category) params.append('category', category);
    if (preacher) params.append('preacher', preacher);
    
    router.push(`/sermons${params.toString() ? `?${params.toString()}` : ''}`);
  };
  
  return (
    <div className="bg-gray-50 p-6 rounded-lg shadow-sm mb-8">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <input
              type="text"
              id="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search sermons..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Categories</option>
              <option value="faith">Faith</option>
              <option value="prayer">Prayer</option>
              <option value="worship">Worship</option>
              <option value="bible-study">Bible Study</option>
              <option value="testimony">Testimony</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="preacher" className="block text-sm font-medium text-gray-700 mb-1">
              Preacher
            </label>
            <select
              id="preacher"
              value={preacher}
              onChange={(e) => setPreacher(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Preachers</option>
              <option value="pastor-john">Pastor John</option>
              <option value="pastor-sarah">Pastor Sarah</option>
              <option value="pastor-michael">Pastor Michael</option>
              <option value="pastor-rebecca">Pastor Rebecca</option>
            </select>
          </div>
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Search
          </button>
        </div>
      </form>
    </div>
  );
}; 