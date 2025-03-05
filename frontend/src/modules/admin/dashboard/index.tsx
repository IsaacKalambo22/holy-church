import { Card } from '@/components/ui/card';
import {
  fetchCourses,
  fetchUsers,
} from '@/lib/api';
import { formatCount } from '@/lib/utils';
import AddNewHeader from '@/modules/admin/add-new-header';
import { BookIcon } from 'lucide-react';
import { FaUsers } from 'react-icons/fa';

interface AdminStats {
  title: string;
  count: number;
  icon: React.ReactNode;
}

const stats: AdminStats[] = [
  {
    title: 'Courses',
    count: 7, // Mocked value will be replaced by fetched data
    icon: (
      <BookIcon
        size={30}
        className='text-orange-500'
      />
    ),
  },

  {
    title: 'Users',
    count: 1024, // Mocked value will be replaced by fetched data
    icon: (
      <FaUsers
        size={30}
        className='text-purple-500'
      />
    ),
  },
];

export default async function Dashboard() {
  // Fetch all required data
  const [courses, users] = await Promise.all([
    fetchCourses(),
    fetchUsers(),
  ]);

  // Update the stats with fetched data or fallback to the mocked value
  const updatedStats = stats.map((stat) => {
    switch (stat.title) {
      case 'Courses':
        stat.count = courses?.data?.length || 0;
        break;

      case 'Users':
        stat.count = users?.data?.length || 0;
        break;

      default:
        break;
    }
    return stat;
  });

  return (
    <section className='flex flex-col'>
      <AddNewHeader name='Dashboard' />
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8'>
        {updatedStats.map((stat, index) => (
          <Card
            key={index}
            className='shadow-none rounded-xl overflow-hidden hover:shadow-xl transition-shadow duration-300 p-6 flex items-center justify-between'
          >
            <div className='flex items-center space-x-4'>
              <div className='p-4 bg-blue-50 rounded-lg'>
                {stat.icon}
              </div>
              <div>
                <h3 className='text-xl font-semibold text-gray-800'>
                  {stat.title}
                </h3>
                <p className='text-2xl font-bold text-gray-600'>
                  {formatCount(stat.count)}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
