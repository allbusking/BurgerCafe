import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: "user" | "admin";
}

interface AuthContextType {
  user: AuthUser | null;
  isLoggedIn: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  signup: (email: string, password: string, name: string) => Promise<AuthUser>;
  logout: () => void;
  loginWithGoogle: () => Promise<AuthUser>;
}

const AUTH_KEY = "hotbb-user-v1";
const AuthContext = createContext<AuthContextType | undefined>(undefined);

function makeUser(email: string, name?: string): AuthUser {
  const adminEmails = ["admin@hotbb.in", "admin@houseoftea.in"];
  return {
    id: `user-${Date.now()}`,
    email,
    name: name?.trim() || email.split("@")[0] || "HOT B&B Fan",
    role: adminEmails.includes(email.toLowerCase()) ? "admin" : "user",
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(AUTH_KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch (error) {
      console.error("Failed to load auth session:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const persist = (nextUser: AuthUser | null) => {
    setUser(nextUser);
    if (nextUser) {
      localStorage.setItem(AUTH_KEY, JSON.stringify(nextUser));
      localStorage.setItem("hotbb-role", nextUser.role);
    } else {
      localStorage.removeItem(AUTH_KEY);
      localStorage.removeItem("hotbb-role");
    }
  };

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      isLoggedIn: Boolean(user),
      isAdmin: user?.role === "admin",
      isLoading,
      login: async (email: string) => {
        const nextUser = makeUser(email);
        persist(nextUser);
        return nextUser;
      },
      signup: async (email: string, _password: string, name: string) => {
        const nextUser = makeUser(email, name);
        persist(nextUser);
        return nextUser;
      },
      logout: () => persist(null),
      loginWithGoogle: async () => {
        const nextUser = makeUser("guest@hotbb.in", "Google Guest");
        persist(nextUser);
        return nextUser;
      },
    }),
    [isLoading, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }
  return context;
}
