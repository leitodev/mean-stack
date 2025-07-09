export interface Post {
  id: string;
  title: string;
  content: string;
  short?: string;
  image?: File | null;
  imagePath?: string;
  totalPosts?: number;
}
