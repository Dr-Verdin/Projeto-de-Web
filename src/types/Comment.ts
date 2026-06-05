export type Comment = {
  postId: string;
  id: string;
  userId: string;
  text: string;
  image?: string
  createdAt: string;
  likes: number
  comments?: number
};