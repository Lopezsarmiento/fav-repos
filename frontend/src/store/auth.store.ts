import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface User {
  username: string;
}

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
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        githubAccessToken: state.githubAccessToken,
      }),
    }
  )
);

export type { User };
