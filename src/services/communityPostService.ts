import api from "./api";

export interface CommunityPost {
  id: string;
  title: string;
  content?: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
  authorId: string;
  communityId: string;
  community?: {
    id: string;
    name: string;
    image?: string;
  };
  author: {
    id: string;
    username: string;
    name: string;
    avatar?: string;
  };
  likes: number;
  _count: { comments: number };
}

export const communityPostService = {
  async getByCommunity(communityId: string): Promise<CommunityPost[]> {
    const res = await api.get(`/community-posts/community/${communityId}`);
    return res.data;
  },

  // busca todos os posts de comunidade (feed global)
  // tenta GET /community-posts; se não existir, agrega por todas as comunidades
  async getAll(): Promise<CommunityPost[]> {
    try {
      const res = await api.get("/community-posts");
      return res.data;
    } catch {
      // fallback: busca todas as comunidades e agrega os posts injetando community.name
      try {
        const commRes = await api.get("/communities");
        const communities: { id: string; name: string; image?: string }[] = commRes.data;
        const allPosts = await Promise.all(
          communities.map(async (c) => {
            const posts: CommunityPost[] = await api
              .get(`/community-posts/community/${c.id}`)
              .then((r) => r.data as CommunityPost[])
              .catch(() => [] as CommunityPost[]);
            // injeta o objeto community em cada post para o front poder usar o nome
            return posts.map((p) => ({
              ...p,
              community: { id: c.id, name: c.name, image: c.image },
            }));
          })
        );
        return allPosts.flat().sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      } catch {
        return [];
      }
    }
  },

  // busca posts de comunidade de um usuário específico
  // tenta GET /community-posts/user/:id; se não existir, filtra do getAll
  async getByUser(userId: string): Promise<CommunityPost[]> {
    try {
      const res = await api.get(`/community-posts/user/${userId}`);
      return res.data;
    } catch {
      try {
        const all = await communityPostService.getAll();
        return all.filter((p) => p.authorId === userId);
      } catch {
        return [];
      }
    }
  },

  async create(data: {
    title: string;
    content?: string;
    image?: string;
    authorId: string;
    communityId: string;
  }): Promise<CommunityPost> {
    const res = await api.post("/community-posts", data);
    return res.data;
  },

  async remove(postId: string, userId: string): Promise<void> {
    await api.delete(`/community-posts/${postId}`, { data: { userId } });
  },
};
