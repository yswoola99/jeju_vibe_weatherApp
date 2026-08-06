import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { GoogleUser } from "@/lib/googleAuth";
import { decodeGoogleCredential } from "@/lib/googleAuth";

const STORAGE_KEY = "weatherapp:google-user";

function readStoredUser(): GoogleUser | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as GoogleUser) : null;
  } catch {
    return null;
  }
}

interface AuthContextValue {
  user: GoogleUser | null;
  isSignedIn: boolean;
  loginWithCredential: (credential: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<GoogleUser | null>(readStoredUser);

  const loginWithCredential = (credential: string) => {
    const decoded = decodeGoogleCredential(credential);
    if (!decoded) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(decoded));
    setUser(decoded);
  };

  const logout = () => {
    window.localStorage.removeItem(STORAGE_KEY);
    setUser(null);
    window.google?.accounts.id.disableAutoSelect();
  };

  const value = useMemo(
    () => ({ user, isSignedIn: user !== null, loginWithCredential, logout }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
