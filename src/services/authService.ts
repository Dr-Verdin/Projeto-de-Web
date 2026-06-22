import api from "./api";

export interface LoginDTO {
  email: string;
  password: string;
}

export interface RegisterDTO {
  name: string;
  username: string;
  email: string;
  password: string;
}

export const authService = {
  async login(data: LoginDTO) {
    const response = await api.post("/auth/login", data);

    localStorage.setItem(
        "token",
        response.data.access_token
    );

    localStorage.setItem(
        "refreshToken",
        response.data.refresh_token
    );

    return response.data;
  },

  async register(data: RegisterDTO) {
    const response = await api.post("/auth/register", data);
    return response.data;
  },

  logout() {
    localStorage.removeItem("token");
  },

  async getProfile() {
    const response = await api.get("/auth/profile");
    return response.data;
  },
};