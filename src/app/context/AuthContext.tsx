import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  user: {
    id: number;
    username: string;
    email: string;
    role: string;
    userType: "petugas" | "warga" | null;
  } | null;
  login: (
    username: string,
    password: string,
    userType: "petugas" | "warga",
  ) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<AuthContextType["user"]>(null);

  const login = async (
    username: string,
    password: string,
    userType: "petugas" | "warga",
  ): Promise<boolean> => {
    try {
      const res = await fetch("http://localhost:3001/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, userType }),
      });

      const data = await res.json();

      if (data.success) {
        setIsAuthenticated(true);
        setUser(data.user);
        return true;
      }
      return false;
    } catch (err) {
      console.error("Login error:", err);
      // Fallback ke hardcode kalau server mati
      if (
        userType === "petugas" &&
        username === "petugas" &&
        password === "petugas123"
      ) {
        setIsAuthenticated(true);
        setUser({
          id: 1,
          username: "petugas",
          email: "",
          role: "Petugas Lalu Lintas",
          userType: "petugas",
        });
        return true;
      }
      if (
        userType === "warga" &&
        username === "warga" &&
        password === "warga123"
      ) {
        setIsAuthenticated(true);
        setUser({
          id: 4,
          username: "warga",
          email: "",
          role: "Warga",
          userType: "warga",
        });
        return true;
      }
      return false;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
