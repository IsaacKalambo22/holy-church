import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

export interface APIResponse {
  success: boolean;
  message: string;
  [key: string]: any; // Optional additional data
}

export interface TokenPayloadProps {
  id: string;
  email: string;
  role: string;
}

interface Attachment {
  id: string;
  name: string;
  url: string;
  courseId: string;
  createdAt: string;
}

interface Chapter {
  id: string;
  title: string;
  description?: string;
  videoUrl?: string;
  content?: string;
  position: number;
  isPublished: boolean;
  isFree: boolean;
  courseId: string;
  createdAt: string;
}

interface Category {
  id: string;
  name: string;
}
export interface CourseProgress {
  id: string;
  title: string;
  teacherName: string;
  userId: string;
  price: number | null;
  imageUrl: string | null;
  isPublished: boolean;
  description: string | null; // Ensure it's always a string
  progress: number | null;
  category: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    name: string;
  } | null;
  attachments: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    name: string;
    url: string;
    courseId: string;
  }[];
  chapters: {
    id: string;
    title: string;
    isPublished: boolean;
    createdAt: Date;
    updatedAt: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
  isPublished: boolean;
  categoryId: string | null;
}

export interface CourseData {
  id: string;
  title: string;
  teacherName: string;
  userId: string;
  price: number | null;
  imageUrl: string | null;
  isPublished: boolean;
  description: string | null; // Ensure it's always a string
  category: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    name: string;
  } | null;
  attachments: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    name: string;
    url: string;
    courseId: string;
  }[];
  chapters: {
    id: string;
    title: string;
    isPublished: boolean;
    createdAt: Date;
    updatedAt: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
  isPublished: boolean;
  categoryId: string | null;
}

export interface UserCourseProgress {
  completedCourses: CourseProgress[];
  coursesInProgress: CourseProgress[];
}
