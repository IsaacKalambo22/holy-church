import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog | Holy Church',
  description:
    'Read inspiring articles, spiritual insights, and community stories from Holy Church. Stay connected with our latest updates and teachings.',
  keywords: [
    'Holy Church Blog',
    'Christian Articles',
    'Spiritual Insights',
    'Church News',
    'Faith Stories',
    'Religious Teachings',
  ],
  openGraph: {
    title: 'Blog | Holy Church',
    description:
      'Explore our collection of inspiring articles, spiritual insights, and community stories.',
    url: 'https://holychurch.com/blog',
    images: [
      {
        url: 'https://holychurch.com/assets/images/blog-og.png',
        width: 1200,
        height: 630,
        alt: 'Blog - Holy Church',
      },
    ],
    type: 'website',
  },
};

export default function BlogPage() {
  return (
    <div className="py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Our Blog</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Discover inspiring articles, spiritual insights, and stories from our community. Stay connected with our latest updates and teachings.
        </p>
      </div>
      
      {/* Blog Posts Grid will be implemented here */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Blog post cards will be mapped here */}
      </div>
    </div>
  );
}
