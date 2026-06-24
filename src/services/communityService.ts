import api from "./api";

export interface CommunityMember {
  id: string;
  userId: string;
  communityId: string;
  role: string;
  createdAt: string;
}

export interface Community {
  id: string;
  name: string;
  description?: string;
  image?: string;
  wallpaper?: string;
  adminId: string;
  admin: { id: string; username: string; name: string; avatar?: string };
  createdAt: string;
  updatedAt: string;
  _count: { members: number; posts: number };
}

export const communityService = {
  async getAll(): Promise<Community[]> {
    const res = await api.get("/communities");
    return res.data;
  },

  async getById(id: string): Promise<Community | null> {
    try {
      const res = await api.get(`/communities/${id}`);
      return res.data;
    } catch {
      // fallback: busca na lista geral caso a rota individual não exista
      const res = await api.get("/communities");
      const all: Community[] = res.data;
      return all.find((c) => c.id === id) ?? null;
    }
  },

  async create(data: {
    name: string;
    description?: string;
    image?: string;
    wallpaper?: string;
    adminId: string;
  }): Promise<Community> {
    const res = await api.post("/communities", data);
    return res.data;
  },

  async join(communityId: string, userId: string): Promise<void> {
    await api.post(`/communities/${communityId}/join`, { userId });
  },

  async leave(communityId: string, userId: string): Promise<void> {
    await api.post(`/communities/${communityId}/leave`, { userId });
  },

  async update(
    communityId: string,
    userId: string,
    data: { name?: string; description?: string; image?: string; wallpaper?: string },
  ): Promise<Community> {
    const res = await api.patch(`/communities/${communityId}`, { userId, ...data });
    return res.data;
  },

  async remove(communityId: string, userId: string): Promise<void> {
    await api.delete(`/communities/${communityId}`, { data: { userId } });
  },
};
