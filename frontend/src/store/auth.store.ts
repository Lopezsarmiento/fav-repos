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
  githubAccessToken: string | null;
  favoriteRepoIds: (string | number)[];
  login: (user: User) => void;
  logout: () => void;
  setGithubAccessToken: (token: string | null) => void;
  addFavoriteRepo: (repoId: string | number) => void;
  removeFavoriteRepo: (repoId: string | number) => void;
}

// Create the store using persist middleware
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // initial state
      user: null,
      isAuthenticated: false,
      githubAccessToken: null,
      favoriteRepoIds: [],
      // actions
      login: (user) => set({ user, isAuthenticated: true }),
      logout: () =>
        set({ user: null, isAuthenticated: false, githubAccessToken: null }),
      setGithubAccessToken: (token) => set({ githubAccessToken: token }),
      addFavoriteRepo: (repoId) =>
        set((state) => ({
          favoriteRepoIds: state.favoriteRepoIds.includes(repoId)
            ? state.favoriteRepoIds
            : [...state.favoriteRepoIds, repoId],
        })),
      removeFavoriteRepo: (repoId) =>
        set((state) => ({
          favoriteRepoIds: state.favoriteRepoIds.filter((id) => id !== repoId),
        })),
    }),
    {
      name: "auth-storage", // Key used in localStorage
      storage: createJSONStorage(() => localStorage), // Use localStorage for persistence
      // Only persist these parts of the state
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        githubAccessToken: state.githubAccessToken,
      }),
    }
  )
);

export type { User };
