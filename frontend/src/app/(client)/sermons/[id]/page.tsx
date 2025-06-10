import { notFound } from 'next/navigation';
import Image from 'next/image';
import { fetchSermonById } from '@/modules/client/sermons/actions';
import type { Metadata, ResolvingMetadata } from 'next';
import dynamic from 'next/dynamic';

// Dynamically import ReactPlayer to avoid SSR issues
const ReactPlayer = dynamic(() => import('react-player/lazy'), { ssr: false });

interface SermonPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata(
  { params }: SermonPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const id = params.id;
  const response = await fetchSermonById(id);
  
  if (!response.success) {
    return {
      title: 'Sermon Not Found | Holy Church',
    };
  }
  
  const sermon = response.data;
  
  return {
    title: `${sermon.title} | Holy Church Sermons`,
    description: sermon.description,
    openGraph: {
      title: `${sermon.title} | Holy Church Sermons`,
      description: sermon.description,
      url: `https://holychurch.com/sermons/${sermon.id}`,
      images: [
        {
          url: sermon.thumbnailUrl,
          width: 1200,
          height: 630,
          alt: sermon.title,
        },
      ],
      type: 'video.other',
    },
  };
}

export default async function SermonPage({ params }: SermonPageProps) {
  const { id } = params;
  const response = await fetchSermonById(id);
  
  if (!response.success) {
    notFound();
  }
  
  const sermon = response.data;
  
  return (
    <div className="py-12 max-w-6xl mx-auto px-4">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">{sermon.title}</h1>
        <div className="flex flex-wrap gap-3 mb-6">
          <span className="text-gray-600">By {sermon.preacher}</span>
          <span className="text-gray-600">•</span>
          <span className="text-gray-600">{sermon.date}</span>
          {sermon.category && (
            <>
              <span className="text-gray-600">•</span>
              <span className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                {sermon.category}
              </span>
            </>
          )}
        </div>
      </div>
      
      {sermon.videoUrl ? (
        <div className="aspect-video w-full mb-8 bg-black rounded-lg overflow-hidden">
          <ReactPlayer
            url={sermon.videoUrl}
            width="100%"
            height="100%"
            controls
            config={{
              youtube: {
                playerVars: { showinfo: 1 }
              }
            }}
          />
        </div>
      ) : sermon.audioUrl ? (
        <div className="w-full mb-8">
          <audio className="w-full" controls src={sermon.audioUrl}>
            Your browser does not support the audio element.
          </audio>
        </div>
      ) : (
        <div className="relative aspect-video w-full mb-8 rounded-lg overflow-hidden">
          <Image
            src={sermon.thumbnailUrl}
            alt={sermon.title}
            fill
            className="object-cover"
          />
        </div>
      )}
      
      <div className="prose max-w-none">
        <p className="text-lg">{sermon.description}</p>
      </div>
      
      {sermon.tags && sermon.tags.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-3">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {sermon.tags.map((tag) => (
              <span 
                key={tag} 
                className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 