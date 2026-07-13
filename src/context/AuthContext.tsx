import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import toast from "react-hot-toast";
import { getCurrentUser, loginUser, registerUser } from "../api/auth";
import type { AuthResponse, LoginPayload, RegisterPayload, Role, User } from "../api/auth";
import { getErrorMessage } from "../api/axios";

interface AuthContextValue {
  user: User | null;
  role: Role | null;
  companyId: string | number | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (payload: LoginPayload) => Promise<Role>;
  register: (payload: RegisterPayload) => Promise<Role>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function persistSession(data: AuthResponse) {
  localStorage.setItem("access_token", data.access_token);
  localStorage.setItem("role", data.role);
  if (data.company_id !== undefined && data.company_id !== null) {
    localStorage.setItem("company_id", String(data.company_id));
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role | null>(
    (localStorage.getItem("role") as Role | null) ?? null
  );
  const [companyId, setCompanyId] = useState<string | number | null>(
    localStorage.getItem("company_id")
  );
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const me = await getCurrentUser();
      setUser(me);
      setRole(me.role);
      localStorage.setItem("role", me.role);
      if (me.company_id) {
        setCompanyId(me.company_id);
        localStorage.setItem("company_id", String(me.company_id));
      }
    } catch {
      localStorage.removeItem("access_token");
      localStorage.removeItem("role");
      localStorage.removeItem("company_id");
      setUser(null);
      setRole(null);
      setCompanyId(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (payload: LoginPayload) => {
    try {
      const data = await loginUser(payload);
      persistSession(data);
      setRole(data.role);
      setCompanyId(data.company_id ?? null);
      await refreshUser();
      toast.success("Welcome back!");
      return data.role;
    } catch (err) {
      toast.error(getErrorMessage(err, "Invalid email or password"));
      throw err;
    }
  };

  const register = async (payload: RegisterPayload) => {
    try {
      const data = await registerUser(payload);
      persistSession(data);
      setRole(data.role);
      setCompanyId(data.company_id ?? null);
      await refreshUser();
      toast.success("Account created successfully!");
      return data.role;
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not create account"));
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("role");
    localStorage.removeItem("company_id");
    setUser(null);
    setRole(null);
    setCompanyId(null);
    toast.success("Logged out");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        companyId,
        isAuthenticated: Boolean(localStorage.getItem("access_token")),
        loading,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
