import { createContext, useContext, useState } from "react";
import { authService } from "../services/authService";
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

    localStorage.setItem("user", JSON.stringify(profile)); // 👈 ADD ISSO

    setUser(profile);

    return profile;
  }

  async function register(name: string, username: string, email: string, password: string) {
    return await authService.register({ name, username, email, password });
  }

  function logout() {
    authService.logout();
    setUser(null);

    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
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