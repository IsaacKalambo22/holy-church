

// API Response Type
export interface APIResponse {
  success: boolean;
  message: string;
  [key: string]: any; // Optional additional data
}

// Token Payload Type (for authentication)
export enum Role {
  ADMIN = "ADMIN",
  SUPER_ADMIN = "SUPER_ADMIN",
  MANAGER = "MANAGER",
  USER = "USER",
  STUDENT = "STUDENT",
  TEACHER = "TEACHER",
}

export interface TokenPayloadProps {
  id: string
  email: string
  role: Role[]
}

// User Type
export interface User {
  id: string;
  name: string;
  email: string;
  profileImage?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Preacher Type (User who preaches)
export interface Preacher {
  id: string;
  name: string;
  email: string;
  profileImage?: string;
}

// Category Type (For categorizing sermons)
export interface Category {
  id: string;
  name: string;
}

// Sermon Type
export interface Sermon {
  id: string;
  title: string;
  description?: string;
  date: Date;
  videoUrl?: string;
  audioUrl?: string;
  preacher?: Preacher;
  preacherId?: string;
  category?: Category;
  attachments?: SermonAttachment[];
  comments?: SermonComment[];
  likes?: SermonLike[];
  createdAt: Date;
  updatedAt: Date;
}

// Sermon Attachment Type
export interface SermonAttachment {
  id: string;
  name: string;
  url: string;
  sermonId: string;
  createdAt: Date;
}

// Sermon Comment Type
export interface SermonComment {
  id: string;
  userId: string;
  sermonId: string;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}

// Sermon Like Type
export interface SermonLike {
  id: string;
  userId: string;
  sermonId: string;
  createdAt: Date;
}

// Sermon Progress Tracking
export interface SermonProgress {
  userId: string;
  sermonId: string;
  completed: boolean;
  progress: number; // Percentage of progress
  lastWatchedAt: Date;
}

// User Sermon Progress
export interface UserSermonProgress {
  completedSermons: SermonProgress[];
  sermonsInProgress: SermonProgress[];
}

// Sermon Data for Display
export interface SermonData {
  id: string;
  title: string;
  description?: string;
  date: Date;
  videoUrl?: string;
  audioUrl?: string;
  preacher?: {
    id: string;
    name: string;
    profileImage?: string;
  };
  category?: {
    id: string;
    name: string;
  };
  attachments?: {
    id: string;
    name: string;
    url: string;
    sermonId: string;
    createdAt: Date;
  }[];
  comments?: {
    id: string;
    userId: string;
    sermonId: string;
    comment: string;
    createdAt: Date;
    updatedAt: Date;
  }[];
  likes?: {
    id: string;
    userId: string;
    sermonId: string;
    createdAt: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
}
