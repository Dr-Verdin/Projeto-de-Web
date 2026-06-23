import api from "./api";

export const commentService = {
  async getByPost(postId: string) {
    const res = await api.get(`/comments/post/${postId}`);
    return res.data;
  },

  async create(data: {
    content: string;
    authorId: string;
    postId: string;
    parentId?: string;
  }) {
    const res = await api.post("/comments", data);
    return res.data;
  },

  async remove(commentId: string) {
    const res = await api.delete(`/comments/${commentId}`);
    return res.data;
  },

  async toggleLike(commentId: string, userId: string) {
    const res = await api.patch(`/comments/${commentId}/like`, { userId });
    return res.data;
  },
};