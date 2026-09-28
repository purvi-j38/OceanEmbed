"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import { SignInClient } from "@/app/sign-in/SignInClient";

type AuthModalContextType = {
  isOpen: boolean;
  openSignIn: () => void;
  closeSignIn: () => void;
};

const AuthModalContext = createContext<AuthModalContextType | undefined>(undefined);

export function AuthModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <AuthModalContext.Provider value={{ isOpen, openSignIn: () => setIsOpen(true), closeSignIn: () => setIsOpen(false) }}>
      {children}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
          <div className="relative w-full max-w-md mx-4 bg-[var(--color-card)] dark:bg-[var(--color-card-dark)] shadow-2xl rounded-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 z-10 p-1.5 rounded-full hover:bg-[var(--color-hairline)] dark:hover:bg-[var(--color-hairline-dark)] transition-colors">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="M4 4L12 12M4 12L12 4" />
              </svg>
            </button>
            <SignInClient onSuccess={() => setIsOpen(false)} isModal />
          </div>
        </div>
      )}
    </AuthModalContext.Provider>
  );
}

export function useAuthModal() {
  const context = useContext(AuthModalContext);
  if (!context) throw new Error("useAuthModal must be used within AuthModalProvider");
  return context;
}
