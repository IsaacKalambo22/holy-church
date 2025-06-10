import { SermonsAdmin } from '@/modules/admin/sermons';

export const metadata = {
  title: 'Manage Sermons | Admin Dashboard',
  description: 'Manage church sermons - create, edit, and delete sermon content.',
};

export default function AdminSermonsPage() {
  return <SermonsAdmin />;
} 