import Link from 'next/link';

export default function SermonNotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <h1 className="text-4xl font-bold mb-4">Sermon Not Found</h1>
      <p className="text-gray-600 mb-8">
        The sermon you are looking for does not exist or has been removed.
      </p>
      <Link 
        href="/sermons" 
        className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        Back to Sermons
      </Link>
    </div>
  );
} 