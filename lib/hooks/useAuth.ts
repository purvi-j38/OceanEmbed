"use client";
import { useState, useCallback, useEffect } from "react";

export type AuthUser = {
  name: string;
  email: string;
  role: string;
  isAdmin?: boolean;
};

const DEMO_USER: AuthUser = {
  name: "Dr. Ananya Rao",
  email: "ananya.rao@incois.gov.in",
  role: "Researcher · INCOIS",
};

const ADMIN_USER: AuthUser = {
  name: "OceanEmbed Admin",
  email: "admin@oceanembed.in",
  role: "System Administrator",
  isAdmin: true,
};

const STORAGE_KEY = "oe-auth-user";

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);

  // Restore from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setUser(JSON.parse(stored));
    } catch {
      // ignore
    }
  }, []);

  const isGuest = user === null;
  const isAdmin = user?.isAdmin === true;

  const signIn = useCallback((customUser?: Partial<AuthUser>) => {
    const u = customUser
      ? { ...DEMO_USER, ...customUser }
      : DEMO_USER;
    setUser(u);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
  }, []);

  const signInAsAdmin = useCallback(() => {
    setUser(ADMIN_USER);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ADMIN_USER));
  }, []);

  const signOut = useCallback(() => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return { user, isGuest, isAdmin, signIn, signInAsAdmin, signOut, DEMO_USER };
}
