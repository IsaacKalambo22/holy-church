export interface PodcastEpisode {
  id: string;
  title: string;
  slug: string;
  description: string;
  audioUrl: string;
  duration: string;
  coverImage: string;
  date: string;
  series?: string;
  host: {
    name: string;
    image?: string;
  };
  guests?: {
    name: string;
    image?: string;
  }[];
}
