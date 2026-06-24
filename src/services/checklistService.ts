import api from "./api";

export interface ChecklistItem {
  id: string;
  content: string;
  done: boolean;
  createdAt: string;
  userId: string;
}

export const checklistService = {
  async getAll(): Promise<ChecklistItem[]> {
    const res = await api.get("/checklist");
    return res.data;
  },

  async create(content: string): Promise<ChecklistItem> {
    const res = await api.post("/checklist", { content });
    return res.data;
  },

  async toggle(id: string): Promise<ChecklistItem> {
    const res = await api.patch(`/checklist/${id}/toggle`);
    return res.data;
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/checklist/${id}`);
  },
};
