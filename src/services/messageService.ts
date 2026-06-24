import api from "./api";

export interface Message {
  id: string;
  content?: string;
  image?: string;
  senderId: string;
  receiverId: string;
  read: boolean;
  createdAt: string;
  sender: {
    id: string;
    name: string;
    username: string;
    avatar?: string;
  };
  receiver: {
    id: string;
    name: string;
    username: string;
    avatar?: string;
  };
}

export interface InboxItem {
  id: string;
  content?: string;
  image?: string;
  senderId: string;
  receiverId: string;
  read: boolean;
  createdAt: string;
  sender: {
    id: string;
    name: string;
    username: string;
    avatar?: string;
  };
}

export const messageService = {
  async send(data: {
    senderId: string;
    receiverId: string;
    content?: string;
    image?: string;
  }): Promise<Message> {
    const res = await api.post("/messages", data);
    return res.data;
  },

  async getConversation(userId: string, otherUserId: string): Promise<Message[]> {
    const res = await api.get("/messages/conversation", {
      params: { userId, otherUserId },
    });
    return res.data;
  },

  async getInbox(userId: string): Promise<InboxItem[]> {
    const res = await api.get(`/messages/inbox/${userId}`);
    return res.data;
  },

  async getUnreadCount(userId: string): Promise<number> {
    const res = await api.get(`/messages/unread/${userId}`);
    return res.data;
  },

  async markAsRead(currentUserId: string, otherUserId: string): Promise<void> {
    await api.patch(`/messages/read/${otherUserId}`, { currentUserId });
  },
};
