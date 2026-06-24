import { createContext, useContext, useState } from "react";
import { authService } from "../services/authService";
import { userService } from "../services/userService";
import { useEffect } from "react";

const AuthContext = createContext<any>(null);

export function AuthProvider({ children }: any) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  async function login(email: string, password: string) {
    const response = await authService.login({ email, password });
    const { access_token, refresh_token } = response;
    localStorage.setItem("token", access_token);
    localStorage.setItem("refreshToken", refresh_token);
    const profile = await authService.getProfile();
    localStorage.setItem("user", JSON.stringify(profile));
    setUser(profile);
    return profile;
  }

  async function register(name: string, username: string, email: string, password: string) {
    return await authService.register({ name, username, email, password });
  }

  async function updateUser(data: {
    name?: string;
    username?: string;
    bio?: string;
    pronoun?: string;
    avatar?: string;
    email?: string;
  }) {
    const currentUser = user as any;
    const userId = currentUser?.id ?? currentUser?.sub;
    if (!userId) throw new Error("Usuário não autenticado");

    const updated = await userService.update(userId, data);

    // busca o perfil atualizado do servidor
    const fresh = await authService.getProfile();
    // usa o fresh como base (tem select seguro) e sobrescreve só os campos editáveis
    const merged = {
      ...fresh,
      name:     updated.name     ?? fresh.name,
      username: updated.username ?? fresh.username,
      bio:      updated.bio      ?? fresh.bio,
      pronoun:  updated.pronoun  ?? fresh.pronoun,
      avatar:   updated.avatar   ?? fresh.avatar,
    };

    localStorage.setItem("user", JSON.stringify(merged));
    setUser(merged);
    window.dispatchEvent(new CustomEvent("user-updated", { detail: { userId } }));

    return merged;
  }

  async function deleteAccount() {
    const currentUser = user as any;
    const userId = currentUser?.id ?? currentUser?.sub;
    if (!userId) throw new Error("Usuário não autenticado");
    await userService.remove(userId);
    logout();
  }

  function logout() {
    authService.logout();
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser, deleteAccount }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
};