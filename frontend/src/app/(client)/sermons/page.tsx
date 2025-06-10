import type { Metadata } from 'next';
import { fetchSermons } from '@/modules/client/sermons/actions';
import { SermonGrid } from '@/modules/client/sermons/components/SermonGrid';
import { SermonSearch } from '@/modules/client/sermons/components/SermonSearch';

export const metadata: Metadata = {
  title: 'Sermons | Holy Church',
  description:
    'Watch and listen to inspiring sermons from Holy Church. Access our collection of spiritual teachings and messages.',
  keywords: [
    'Holy Church Sermons',
    'Christian Teachings',
    'Spiritual Messages',
    'Online Sermons',
    'Church Preachings',
    'Religious Teachings',
  ],
  openGraph: {
    title: 'Sermons | Holy Church',
    description:
      'Access our collection of inspiring sermons and spiritual teachings at Holy Church.',
    url: 'https://holychurch.com/sermons',
    images: [
      {
        url: 'https://holychurch.com/assets/images/sermons-og.png',
        width: 1200,
        height: 630,
        alt: 'Sermons - Holy Church',
      },
    ],
    type: 'website',
  },
};

interface SermonsPageProps {
  searchParams: {
    search?: string;
    category?: string;
    preacher?: string;
    page?: string;
  };
}

export default async function SermonsPage({ searchParams }: SermonsPageProps) {
  const { search, category, preacher, page } = searchParams;
  
  const response = await fetchSermons({ 
    search,
    category,
    preacher,
    page: page ? parseInt(page) : 1,
    limit: 9 
  });
  
  const sermons = response.success ? response.data.sermons : [];
  
  return (
    <div className="py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Our Sermons</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Explore our collection of inspiring sermons and spiritual teachings. Watch or listen to messages that will uplift your faith and deepen your understanding.
        </p>
      </div>
      
      <SermonSearch />
      
      {sermons.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No sermons available matching your criteria. Please try a different search.</p>
        </div>
      ) : (
        <>
          <SermonGrid sermons={sermons} />
          
          {response.success && response.data.totalPages > 1 && (
            <div className="mt-12 flex justify-center">
              <div className="flex space-x-2">
                {Array.from({ length: response.data.totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <a
                    key={pageNum}
                    href={`/sermons?${new URLSearchParams({
                      ...(search ? { search } : {}),
                      ...(category ? { category } : {}),
                      ...(preacher ? { preacher } : {}),
                      page: pageNum.toString(),
                    }).toString()}`}
                    className={`px-4 py-2 rounded-md ${
                      pageNum === (page ? parseInt(page) : 1)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {pageNum}
                  </a>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
