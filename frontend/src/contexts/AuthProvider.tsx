import { useCallback, useMemo, useState, type ReactNode } from "react";
import { apolloClient } from "@/lib/apollo";
import { AuthContext, type AuthContextValue, type User } from "./auth-context";

function loadFromStorage(): { token: string | null; user: User | null } {
  try {
    const token = localStorage.getItem("token");
    const raw = localStorage.getItem("user");
    const user: User | null = raw ? (JSON.parse(raw) as User) : null;
    return { token, user };
  } catch {
    return { token: null, user: null };
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const stored = loadFromStorage();
  const [token, setToken] = useState<string | null>(stored.token);
  const [user, setUser] = useState<User | null>(stored.user);

  const login = useCallback((newToken: string, newUser: User) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    void apolloClient.clearStore();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, token, isAuthenticated: !!token, login, logout }),
    [user, token, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
