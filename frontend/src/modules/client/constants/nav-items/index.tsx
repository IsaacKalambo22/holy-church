import { Icon } from '@iconify/react';
import { JSX } from 'react';

// Define a type for a navigation item, including optional icon and submenu fields.
export type NavItem = {
  title: string;
  href: string;
  description?: string;
  icon?: JSX.Element;
  submenu?: boolean;
  subMenuItems?: NavItem[];
};

// Create and export the navigation items object.
export const navItems: NavItem[] = [
  {
    title: 'Home',
    href: '/',
    description:
      'Industry insights and articles from experts.',
    icon: (
      <Icon
        icon='lucide:pen-tool'
        width='16'
        height='16'
      />
    ),
  },
  {
    title: 'Sermons',
    href: '/sermons',
    description:
      'Industry insights and articles from experts.',
    icon: (
      <Icon
        icon='lucide:pen-tool'
        width='16'
        height='16'
      />
    ),
  },
  {
    title: 'Events',
    href: '/events',
    description:
      'Industry insights and articles from experts.',
    icon: (
      <Icon
        icon='lucide:pen-tool'
        width='16'
        height='16'
      />
    ),
  },
  {
    title: 'Blog',
    href: '/blog',
    description:
      'Industry insights and articles from experts.',
    icon: (
      <Icon
        icon='lucide:pen-tool'
        width='16'
        height='16'
      />
    ),
  },
  {
    title: 'Donate',
    href: '/give',
    description:
      'Industry insights and articles from experts.',
    icon: (
      <Icon
        icon='lucide:pen-tool'
        width='16'
        height='16'
      />
    ),
  },
  {
    title: 'Prayer Requests',
    href: '/prayer-requests',
    description:
      'Industry insights and articles from experts.',
    icon: (
      <Icon
        icon='lucide:pen-tool'
        width='16'
        height='16'
      />
    ),
  },
  {
    title: 'Podcasts',
    href: '/podcasts',
    description:
      'Industry insights and articles from experts.',
    icon: (
      <Icon
        icon='lucide:pen-tool'
        width='16'
        height='16'
      />
    ),
  },
  {
    title: 'Contact',
    href: '/contact-us',
    description:
      'Industry insights and articles from experts.',
    icon: (
      <Icon
        icon='lucide:pen-tool'
        width='16'
        height='16'
      />
    ),
  },
    {
      title: 'About Us',
      href: '/about-us',
      description:
        'Learn more about our organization and mission.',
      icon: (
        <Icon
          icon='lucide:info'
          width='16'
          height='16'
        />
      ),
    },
];
