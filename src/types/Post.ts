export type Post = {
  id: string;
  title: string;
  content?: string;
  image?: string;
  createdAt: string;
  updatedAt?: string;
  likes: number;

  author: {
    id: string;
    name: string;
    username: string;
    avatar?: string;
  };

  authorId?: string;
  communityId?: string;
  community?: {
    id: string;
    name: string;
    image?: string;
  };

  _count?: {
    comments: number;
  };
};
