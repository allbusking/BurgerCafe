import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { AuthChangeEvent, Session, User } from "@supabase/supabase-js";

import supabase from "../lib/supabaseClient";

type Profile = {
  id: string;
  full_name?: string | null;
  email?: string | null;
  avatar_url?: string | null;
  role?: string | null;
  phone?: string | null;
  name?: string | null;
  [key: string]: unknown;
};

type AuthContextValue = {
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

async function fetchProfile(userId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) return null;

  return data as Profile;
}

async function saveProfileEmail(user: User, fullName?: string) {
  if (!user.email) return;

  await supabase.from("profiles").upsert(
    {
      id: user.id,
      email: user.email,
      ...(fullName ? { full_name: fullName } : {}),
    },
    { onConflict: "id" },
  );
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const updateAuthState = async (nextUser: User | null) => {
      if (!isMounted) return;

      setUser(nextUser);

      if (nextUser) {
        await saveProfileEmail(nextUser);
        const nextProfile = await fetchProfile(nextUser.id);
        if (isMounted) setProfile(nextProfile);
      } else {
        setProfile(null);
      }
    };

    const loadSession = async () => {
      const { data } = await supabase.auth.getSession();
      await updateAuthState(data.session?.user ?? null);
      if (isMounted) setIsLoading(false);
    };

    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event: AuthChangeEvent, session: Session | null) => {
      await updateAuthState(session?.user ?? null);
      if (isMounted) setIsLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      profile,
      isLoading,
      isLoggedIn: !!user,
      isAdmin: profile?.role === "admin",
      login: async (email: string, password: string) => {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      },
      signup: async (email: string, password: string, fullName: string) => {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              email,
              full_name: fullName,
            },
          },
        });

        if (error) throw error;

        if (data.user) {
          await saveProfileEmail(data.user, fullName);
        }
      },
      logout: async () => {
        await supabase.auth.signOut();
      },
      loginWithGoogle: async () => {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: window.location.origin,
          },
        });

        if (error) throw error;
      },
    }),
    [isLoading, profile, user],
  );

  if (isLoading) return null;

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
