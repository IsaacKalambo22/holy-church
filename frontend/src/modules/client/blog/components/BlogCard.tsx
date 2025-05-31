import Image from 'next/image';
import Link from 'next/link';
import { BlogPost } from '../types';

interface BlogCardProps {
  post: BlogPost;
}

export const BlogCard = ({ post }: BlogCardProps) => {
  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-[1.02]">
      <Link href={`/blog/${post.slug}`}>
        <div className="relative h-48 w-full">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover"
          />
        </div>
        <div className="p-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm text-gray-500">{post.date}</span>
            {post.category && (
              <span className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                {post.category}
              </span>
            )}
          </div>
          <h2 className="text-xl font-semibold mb-2 line-clamp-2">{post.title}</h2>
          <p className="text-gray-600 line-clamp-3">{post.excerpt}</p>
        </div>
      </Link>
    </article>
  );
};
