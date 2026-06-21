import api from "./api";

export interface LoginDTO {
  email: string;
  password: string;
}

export interface RegisterDTO {
  username: string;
  email: string;
  password: string;
}

export const authService = {
  async login(data: LoginDTO) {
    const response = await api.post("/auth/login", data);

    const { token, user } = response.data;

    localStorage.setItem("token", token);

    return user;
  },

  async register(data: RegisterDTO) {
    const response = await api.post("/auth/register", data);
    return response.data;
  },

  logout() {
    localStorage.removeItem("token");
  },
};