// src/store/auth.store.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// Define the shape of the User object (simple for now)
interface User {
  username: string;
  // Add other details if needed later (e.g., from GitHub profile)
}

// Define the shape of the Auth state and actions
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  // We might add the GitHub token here later
  // githubToken: string | null;
  login: (user: User) => void;
  logout: () => void;
  // setGithubToken: (token: string | null) => void;
}

// Create the store using persist middleware
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      // githubToken: null,

      // Actions
      login: (user) => set({ user, isAuthenticated: true }),
      logout: () =>
        set({ user: null, isAuthenticated: false /* githubToken: null */ }),
      // setGithubToken: (token) => set({ githubToken: token }),
    }),
    {
      name: "auth-storage", // Key used in localStorage
      storage: createJSONStorage(() => localStorage), // Use localStorage for persistence
      // Only persist these parts of the state
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        // githubToken: state.githubToken, // Add this if/when we store the token
      }),
    }
  )
);

// Optional: Export the User type if needed elsewhere
export type { User };
