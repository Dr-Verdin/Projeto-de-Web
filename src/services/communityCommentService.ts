import api from "./api";

export interface CommunityComment {
  id: string;
  content: string;
  createdAt: string;
  postId: string;
  authorId: string;
  parentId?: string | null;
  likes: number;
  author: {
    id: string;
    name: string;
    username: string;
    avatar?: string;
  };
  commentLikes?: { userId: string }[];
  replies?: CommunityComment[];
}

export const communityCommentService = {
  async getByPost(postId: string): Promise<CommunityComment[]> {
    const res = await api.get(`/community-comments/${postId}`);
    return res.data;
  },

  async create(data: {
    content: string;
    authorId: string;
    postId: string;
    parentId?: string;
  }): Promise<CommunityComment> {
    const res = await api.post("/community-comments", data);
    return res.data;
  },

  async remove(commentId: string): Promise<void> {
    await api.delete(`/community-comments/${commentId}`);
  },

  async toggleLike(commentId: string, userId: string): Promise<{ liked: boolean }> {
    const res = await api.post(`/community-comments/${commentId}/like`, { userId });
    return res.data;
  },
};
