import api from "./api";

export const postService = {
  async getAll() {
    const res = await api.get("/posts");
    return res.data;
  },

  async getByUser(userId: string) {
    const res = await api.get(`/posts/user/${userId}`);
    return res.data;
  },

  async create(data: { content: string; authorId: string }) {
    const res = await api.post("/posts", data);
    return res.data;
  },

  async update(id: string, data: any) {
    const res = await api.put(`/posts/${id}`, data);
    return res.data;
  },

  async remove(id: string) {
    const res = await api.delete(`/posts/${id}`);
    return res.data;
  },
};