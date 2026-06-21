import { createContext, useContext, useState } from "react";
import { authService } from "../services/authService";

const AuthContext = createContext<any>(null);

export function AuthProvider({ children }: any) {
  const [user, setUser] = useState(null);

  async function login(email: string, password: string) {
    const data = await authService.login({ email, password });
    setUser(data);
  }

  async function register(username: string, email: string, password: string) {
    return await authService.register({ username, email, password });
  }

  function logout() {
    authService.logout();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);