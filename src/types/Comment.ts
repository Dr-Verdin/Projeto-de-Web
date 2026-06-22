export type Comment = {
  postId: string;
  id: string;
  userId: string;
  content: string;
  image?: string
  createdAt: string;
  likes: number
  comments?: number
};