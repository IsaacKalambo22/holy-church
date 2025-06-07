import type { Metadata } from 'next';
import { BlogGrid } from '@/modules/client/blog/components/BlogGrid';

export const metadata: Metadata = {
  title: 'Blog | Holy Church Assembly',
  description:
    'Read inspiring articles, spiritual insights, and community stories from Holy Church Assembly. Stay connected with our latest updates and teachings.',
  keywords: [
    'Holy Church Assembly Blog',
    'Christian Articles',
    'Spiritual Insights',
    'Holy Church Assembly News',
    'Faith Stories',
    'Religious Teachings',
  ],
  openGraph: {
    title: 'Blog | Holy Church Assembly',
    description:
      'Explore our collection of inspiring articles, spiritual insights, and community stories from Holy Church Assembly.',
    url: 'https://holychurch.com/blog',
    images: [
      {
        url: 'https://holychurch.com/assets/images/blog-og.png',
        width: 1200,
        height: 630,
        alt: 'Blog - Holy Church Assembly',
      },
    ],
    type: 'website',
  },
};

// Sample blog posts data - This would typically come from an API or CMS
const samplePosts = [
  {
    id: '1',
    title: 'Finding Peace Through Prayer',
    slug: 'finding-peace-through-prayer',
    excerpt: 'Discover how daily prayer can bring inner peace and spiritual growth in your life.',
    content: '',
    coverImage: '/images/blog/prayer.jpg',
    date: 'May 31, 2025',
    category: 'Spiritual Growth',
    author: {
      name: 'Pastor John',
      image: '/images/authors/pastor-john.jpg'
    }
  },
  {
    id: '2',
    title: 'Building a Strong Church Community',
    slug: 'building-strong-church-community',
    excerpt: 'Learn the essential elements that create a vibrant and supportive church community.',
    content: '',
    coverImage: '/images/blog/community.jpg',
    date: 'May 28, 2025',
    category: 'Community',
    author: {
      name: 'Sarah Wilson',
      image: '/images/authors/sarah.jpg'
    }
  },
  {
    id: '3',
    title: 'Understanding Biblical Wisdom',
    slug: 'understanding-biblical-wisdom',
    excerpt: 'A deep dive into the practical application of biblical wisdom in modern life.',
    content: '',
    coverImage: '/images/blog/bible-study.jpg',
    date: 'May 25, 2025',
    category: 'Bible Study',
    author: {
      name: 'Dr. Michael Brown',
      image: '/images/authors/michael.jpg'
    }
  }
];

export default function BlogPage() {
  return (
    <div className="py-12 container mx-auto px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Our Blog</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Discover inspiring articles, spiritual insights, and stories from our community. Stay connected with our latest updates and teachings.
        </p>
      </div>
      
      <BlogGrid posts={samplePosts} />
    </div>
  );
}
