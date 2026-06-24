import api from "./api";

export interface UpdateUserDTO {
  name?: string;
  username?: string;
  email?: string;
  bio?: string;
  pronoun?: string;
  avatar?: string;
}

export const userService = {
  async getAll() {
    const res = await api.get("/users");
    return res.data;
  },

  async getById(id: string) {
    const res = await api.get(`/users/${id}`);
    return res.data;
  },

  async update(id: string, data: UpdateUserDTO) {
    const res = await api.put(`/users/${id}`, data);
    return res.data;
  },

  async remove(id: string) {
    await api.delete(`/users/${id}`);
  },

  async addStudyTime(id: string, hours: number) {
    const res = await api.patch(`/users/${id}/study-time`, { hours });
    return res.data;
  },

  // PATCH /users/:id/follow — { followerId }
  async toggleFollow(targetId: string, followerId: string) {
    const res = await api.patch(`/users/${targetId}/follow`, { followerId });
    return res.data as { following: boolean };
  },

  // GET /users/:id/follow-status?userId=...
  async getFollowStatus(targetId: string, userId: string) {
    const res = await api.get(`/users/${targetId}/follow-status`, {
      params: { userId },
    });
    return res.data as { following: boolean };
  },
};
