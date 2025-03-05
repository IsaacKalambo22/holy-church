'use client';

import { IconType } from 'react-icons';
import {
  FcBusinessman,
  FcCheckmark,
  FcGlobe,
  FcIdea,
} from 'react-icons/fc';

import { CategoryItem } from './category-item';

interface CategoriesProps {
  items: Category[];
}

const iconMap: Record<
  Category['name'],
  IconType
> = {
  Destiny: FcGlobe,
  Success: FcCheckmark,
  Identity: FcBusinessman,
  'Purpose of existence': FcIdea,
};

export const Categories = ({
  items,
}: CategoriesProps) => {
  return (
    <div className='flex gap-4 flex-wrap items-center gap-x-2 overflow-x-auto pb-2'>
      {items.map((item) => (
        <CategoryItem
          key={item.id}
          label={item.name}
          icon={iconMap[item.name]}
          value={item.id}
        />
      ))}
    </div>
  );
};
