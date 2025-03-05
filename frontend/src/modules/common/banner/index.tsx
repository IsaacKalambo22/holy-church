import {
  cva,
  type VariantProps,
} from 'class-variance-authority';
import {
  AlertTriangle,
  CheckCircleIcon,
} from 'lucide-react';

import { cn } from '@/lib/utils';

const bannerVariants = cva(
  'border text-center p-4 text-sm flex items-center w-full rounded-md',
  {
    variants: {
      variant: {
        warning:
          'bg-yellow-200/80 border-yellow-300 text-black dark:bg-yellow-500/80 dark:border-yellow-400 dark:text-primary',
        success:
          'bg-emerald-700 border-emerald-800 text-secondary dark:bg-emerald-600 dark:border-emerald-700 dark:text-secondary',
      },
    },
    defaultVariants: {
      variant: 'warning',
    },
  }
);

interface BannerProps
  extends VariantProps<typeof bannerVariants> {
  label: string;
  className?: string;
}

const iconMap = {
  warning: AlertTriangle,
  success: CheckCircleIcon,
};

export const Banner = ({
  label,
  variant,
  className,
}: BannerProps) => {
  const Icon = iconMap[variant || 'warning'];

  return (
    <div
      className={cn(
        bannerVariants({ variant }),
        className
      )}
    >
      <Icon className='h-4 w-4 mr-2' />
      {label}
    </div>
  );
};
