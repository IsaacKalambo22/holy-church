import {
  AudioWaveform,
  BookOpen,
  Command,
  DollarSign,
  GalleryVerticalEnd,
  GraduationCap,
  Image,
  LayoutDashboard,
  LucideIcon,
  User2,
} from 'lucide-react';

export interface SidebarTeamProps {
  name: string;
  logo: LucideIcon;
  plan: string;
}

export interface SidebarNavItemProps {
  title: string;
  url: string;
  icon?: LucideIcon;
  isActive?: boolean;
  items?: {
    title: string;
    url: string;
  }[];
}

export interface SidebarProps {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
  teams: SidebarTeamProps[];
  navMain: SidebarNavItemProps[];
}

// This is sample data.
export const ADMIN_SIDEBAR_DATA: SidebarProps = {
  user: {
    name: 'Resten Madzalo',
    email: 'madzaloresten8@gmail.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'Acme Inc',
      logo: GalleryVerticalEnd,
      plan: 'Enterprise',
    },
    {
      name: 'Acme Corp.',
      logo: AudioWaveform,
      plan: 'Startup',
    },
    {
      name: 'Evil Corp.',
      logo: Command,
      plan: 'Free',
    },
  ],
  navMain: [
    {
      title: 'Dashboard',
      url: '/admin/dashboard',
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: 'Courses',
      url: '/admin/courses',
      icon: BookOpen,
      isActive: false,
    },
    {
      title: 'Billing',
      url: '/admin/billing',
      icon: DollarSign,
      isActive: false,
    },
    {
      title: 'Users',
      url: '/admin/users',
      icon: User2,
      isActive: false,
    },
    {
      title: 'Students',
      url: '/admin/students',
      icon: GraduationCap,
      isActive: false,
    },
    {
      title: 'Gallery',
      url: '/admin/gallery',
      icon: Image,
      isActive: false,
    },
    // {
    //   title: 'Models',
    //   url: '#',
    //   icon: Bot,
    //   items: [
    //     {
    //       title: 'Genesis',
    //       url: '/dashboard',
    //     },
    //     {
    //       title: 'Explorer',
    //       url: '#',
    //     },
    //     {
    //       title: 'Quantum',
    //       url: '#',
    //     },
    //   ],
    // },
  ],
};
export const USER_SIDEBAR_DATA: SidebarProps = {
  user: {
    name: 'Resten Madzalo',
    email: 'madzaloresten8@gmail.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'Acme Inc',
      logo: GalleryVerticalEnd,
      plan: 'Enterprise',
    },
    {
      name: 'Acme Corp.',
      logo: AudioWaveform,
      plan: 'Startup',
    },
    {
      name: 'Evil Corp.',
      logo: Command,
      plan: 'Free',
    },
  ],
  navMain: [
    {
      title: 'Dashboard',
      url: '/user/dashboard',
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: 'Browse',
      url: '/user/search',
      icon: BookOpen,
      isActive: false,
    },

    {
      title: 'Billing',
      url: '/user/billing',
      icon: DollarSign,
      isActive: false,
    },
    // {
    //   title: 'Users',
    //   url: '/user/users',
    //   icon: User2,
    //   isActive: false,
    // },
    // {
    //   title: 'Models',
    //   url: '#',
    //   icon: Bot,
    //   items: [
    //     {
    //       title: 'Genesis',
    //       url: '/dashboard',
    //     },
    //     {
    //       title: 'Explorer',
    //       url: '#',
    //     },
    //     {
    //       title: 'Quantum',
    //       url: '#',
    //     },
    //   ],
    // },
  ],
};

export const adminActionsDropdownItems = [
  {
    label: 'Edit',
    icon: '/assets/icons/edit.svg',
    value: 'edit',
  },
  // {
  //   label: 'Details',
  //   icon: '/assets/icons/info.svg',
  //   value: 'details',
  // },
  {
    label: 'Delete',
    icon: '/assets/icons/delete.svg',
    value: 'delete',
  },
];
