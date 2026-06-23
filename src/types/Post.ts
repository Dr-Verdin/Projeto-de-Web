export type Post = {
  id: string;
  title: string;
  content?: string;
  image?: string;
  createdAt: string;
  likes: number;

  author: {
    id: string;
    name: string;
    username: string;
    avatar?: string;
  };

  authorId?: string;
  communityId?: string;

  _count?: {
    comments: number;
  };
};