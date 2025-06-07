import type { Metadata } from 'next';
import { PodcastGrid } from '@/modules/client/podcast/components/PodcastGrid';

export const metadata: Metadata = {
  title: 'Podcasts | Holy Church',
  description:
    'Listen to inspiring podcasts from Holy Church. Access our collection of spiritual discussions, teachings, and conversations.',
  keywords: [
    'Holy Church Podcasts',
    'Christian Podcasts',
    'Spiritual Audio',
    'Religious Discussions',
    'Faith Conversations',
    'Church Teachings',
  ],
  openGraph: {
    title: 'Podcasts | Holy Church',
    description:
      'Listen to our collection of inspiring podcasts featuring spiritual discussions and teachings.',
    url: 'https://holychurch.com/podcasts',
    images: [
      {
        url: 'https://holychurch.com/assets/images/podcasts-og.png',
        width: 1200,
        height: 630,
        alt: 'Podcasts - Holy Church',
      },
    ],
    type: 'website',
  },
};

// Sample podcast episodes data - This would typically come from an API or CMS
const sampleEpisodes = [
  {
    id: '1',
    title: 'Walking in Faith: A Daily Practice',
    slug: 'walking-in-faith-daily-practice',
    description: 'Join Pastor John as he discusses practical ways to strengthen your faith through daily spiritual practices.',
    audioUrl: '/audio/podcasts/walking-in-faith.mp3',
    duration: '32:15',
    coverImage: '/assets/images/carousel/3.jpg',
    date: 'June 1, 2025',
    series: 'Faith Journey',
    host: {
      name: 'Pastor John',
      image: '/images/hosts/pastor-john.jpg'
    },
    guests: [
      {
        name: 'Sarah Wilson',
        image: '/images/guests/sarah.jpg'
      }
    ]
  },
  {
    id: '2',
    title: 'Understanding Modern Christianity',
    slug: 'understanding-modern-christianity',
    description: 'A deep dive into how traditional Christian values and teachings apply in our modern world.',
    audioUrl: '/audio/podcasts/modern-christianity.mp3',
    duration: '45:30',
    coverImage: '/assets/images/carousel/4.jpg',
    date: 'May 28, 2025',
    series: 'Modern Faith',
    host: {
      name: 'Dr. Michael Brown',
      image: '/images/hosts/michael.jpg'
    }
  },
  {
    id: '3',
    title: 'Prayer and Meditation',
    slug: 'prayer-and-meditation',
    description: 'Learn effective techniques for deepening your prayer life and incorporating meaningful meditation into your daily routine.',
    audioUrl: '/audio/podcasts/prayer-meditation.mp3',
    duration: '28:45',
    coverImage: '/assets/images/carousel/5.jpg',
    date: 'May 25, 2025',
    series: 'Spiritual Practices',
    host: {
      name: 'Sister Mary Grace',
      image: '/images/hosts/mary-grace.jpg'
    }
  }
];

export default function PodcastsPage() {
  return (
    <div className="py-12 container mx-auto px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Our Podcasts</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Listen to our collection of inspiring podcasts featuring spiritual discussions, teachings, and conversations that will enrich your faith journey.
        </p>
      </div>
      
      <PodcastGrid episodes={sampleEpisodes} />
    </div>
  );
}
