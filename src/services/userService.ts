import api from "./api";

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
}

export interface UpdateUserDTO {
  name?: string;
  email?: string;
}

export const userService = {
  async getAll(): Promise<User[]> {
    const res = await api.get("/users");
    return res.data;
  },

  async getById(id: number): Promise<User> {
    const res = await api.get(`/users/${id}`);
    return res.data;
  },

  async create(data: CreateUserDTO): Promise<User> {
    const res = await api.post("/users", data);
    return res.data;
  },

  async update(id: number, data: UpdateUserDTO): Promise<User> {
    const res = await api.put(`/users/${id}`, data);
    return res.data;
  },

  async remove(id: number): Promise<void> {
    await api.delete(`/users/${id}`);
  },
};