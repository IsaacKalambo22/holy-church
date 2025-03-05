import { IconText } from '@/modules/common/icon-text';
import { LucideIcon } from 'lucide-react';

interface BannerCardProps {
  variant?: 'default' | 'success';
  label: string;
  description: string;
  icon: LucideIcon;
}

export const BannerCard = ({
  variant,
  icon: Icon,
  description,
  label,
}: BannerCardProps) => {
  return (
    <div className='border rounded-md flex items-center gap-x-2 p-3'>
      <IconText variant={variant} icon={Icon} />
      <div>
        <p className='font-medium'>{label}</p>
        <p className='text-gray-700 dark:text-gray-200 text-sm'>
          {description}
        </p>
      </div>
    </div>
  );
};
