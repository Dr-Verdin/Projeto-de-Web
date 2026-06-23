export type Comment = {
  id: string;
  content: string;
  createdAt: string;
  likes?: number;
  comments?: number;

  author?: {
    id: string;
    name?: string;
    username?: string;
    avatar?: string | null;
  };

  replies?: Comment[];
};