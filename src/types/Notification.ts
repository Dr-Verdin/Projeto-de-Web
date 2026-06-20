export type Notification = {
  id: string;
  userId: string;
  type: "like" | "comment" | "follow" | "community" | "message";
  title: string;
  message: string;
  avatar: string;
  createdAt: string;
  read: boolean;
  relatedId?: string;
};
