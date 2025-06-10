export interface Sermon {
  id: string;
  title: string;
  description: string;
  preacher: string;
  date: string;
  videoUrl?: string;
  audioUrl?: string;
  thumbnailUrl: string;
  duration: string;
  category?: string;
  tags?: string[];
}

export interface SermonsResponse {
  sermons: Sermon[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

export interface SermonsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  preacher?: string;
} 