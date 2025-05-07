import { useEffect, useState } from "react";
import type { Repository } from "../features/repositories/types";
import { RepositoryItem } from "../features/repositories/components/RepositoryItem";
import { useAuthStore } from "../store/auth.store";
import {
  generateCodeVerifier,
  generateCodeChallenge,
} from "../features/auth/utils/pkce";
import { fetchUserRepositories } from "../features/repositories/api/githubAPI";

const GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID;
const GITHUB_REDIRECT_URI = import.meta.env.VITE_GITHUB_REDIRECT_URI;
const GITHUB_SCOPES = import.meta.env.VITE_GITHUB_SCOPES;

// Note: Ensure this component name matches what's expected in your router
export const RepositoriesPage = () => {
  const githubAccessToken = useAuthStore((state) => state.githubAccessToken);
  const [isLoadingGithubData, setIsLoadingGithubData] = useState(false);
  const [ownedRepositories, setOwnedRepositories] = useState<Repository[]>([]);
  const [favoriteRepositories, setFavoriteRepositories] = useState<
    Repository[]
  >([]);
  const [isLoadingRepos, setIsLoadingRepos] = useState(false);
  const [reposError, setReposError] = useState<string | null>(null);

  // Inside RepositoriesPage component
  useEffect(() => {
    if (githubAccessToken) {
      const loadRepositories = async () => {
        setIsLoadingRepos(true);
        setReposError(null);
        try {
          const userRepos = await fetchUserRepositories();
          setOwnedRepositories(userRepos);
          // Later, you'll also fetch favoriteRepos here
          // const starredRepos = await fetchStarredRepositories();
          // setFavoriteRepositories(starredRepos);
        } catch (err: unknown) {
          console.error("Failed to fetch repositories:", err);

          const errorMessage =
            err instanceof Error ? err.message : "Failed to load repositories.";

          setReposError(errorMessage);

          if (errorMessage.includes("401") || errorMessage.includes("token")) {
            // Potentially clear the token if it's invalid, prompting re-auth
            // useAuthStore.getState().setGithubAccessToken(null);
          }
        } finally {
          setIsLoadingRepos(false);
        }
      };
      loadRepositories();
    } else {
      // Clear repos if token is removed (e.g., user logs out from GitHub elsewhere or token expires)
      setOwnedRepositories([]);
      setFavoriteRepositories([]);
    }
  }, [githubAccessToken]); // Re-run if githubAccessToken changes

  const handleGithubLogin = async () => {
    setIsLoadingGithubData(true);
    try {
      const verifier = generateCodeVerifier();
      localStorage.setItem("github_code_verifier", verifier);
      const challenge = await generateCodeChallenge(verifier);

      const authUrl = new URL("https://github.com/login/oauth/authorize");
      authUrl.searchParams.set("client_id", GITHUB_CLIENT_ID);
      authUrl.searchParams.set("redirect_uri", GITHUB_REDIRECT_URI);
      authUrl.searchParams.set("scope", GITHUB_SCOPES);
      authUrl.searchParams.set("response_type", "code");
      authUrl.searchParams.set("code_challenge", challenge);
      authUrl.searchParams.set("code_challenge_method", "S256");

      window.location.href = authUrl.toString();
    } catch (error) {
      console.error("Error during GitHub login:", error);
    } finally {
      setIsLoadingGithubData(false);
    }
  };

  if (isLoadingRepos) {
    return (
      <div className="container mx-auto p-6 text-center">
        Loading your repositories...
      </div>
    );
  }

  if (reposError) {
    return (
      <div className="container mx-auto p-6 text-center">
        <h1 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-4">
          Error Loading Repositories
        </h1>
        <p className="text-neutral-700 dark:text-neutral-300 mb-6">
          {reposError}
        </p>
        {/* Optionally, add a button to try reconnecting or logging out */}
      </div>
    );
  }

  if (!githubAccessToken) {
    return (
      <div className="container mx-auto p-6 text-center flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        {" "}
        {/* Adjust min-h as needed */}
        <h1 className="text-2xl font-semibold text-neutral-800 dark:text-neutral-100 mb-4">
          Connect to GitHub
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400 mb-8 max-w-md">
          To see your repositories and manage your favorites, please connect
          your GitHub account.
        </p>
        <button
          onClick={handleGithubLogin}
          disabled={isLoadingGithubData}
          className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-neutral-800 hover:bg-neutral-700 dark:bg-neutral-700 dark:hover:bg-neutral-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-500 disabled:opacity-50"
        >
          {/* You can add a GitHub icon here */}
          <svg
            className="w-5 h-5 mr-2 -ml-1"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.001 10.001 0 0022 12.017C22 6.484 17.522 2 12 2z"
              clipRule="evenodd"
            />
          </svg>
          {isLoadingGithubData ? "Redirecting..." : "Connect to GitHub"}
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <section className="mb-12">
        <h1 className="text-2xl md:text-3xl font-semibold text-neutral-800 dark:text-neutral-100 mb-6 border-b border-neutral-300 dark:border-neutral-600 pb-3">
          My Repositories
        </h1>
        {ownedRepositories.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {ownedRepositories.map((repo) => (
              <RepositoryItem key={repo.id} repo={repo} />
            ))}
          </div>
        ) : (
          <p className="text-neutral-600 dark:text-neutral-400">
            No repositories found. You might not have any, or there was an issue
            fetching them.
          </p>
        )}
      </section>

      <section>
        <h2 className="text-2xl md:text-3xl font-semibold text-neutral-800 dark:text-neutral-100 mb-6 border-b border-neutral-300 dark:border-neutral-600 pb-3">
          Favorite Repositories (Coming Soon)
        </h2>
        {/*
          {favoriteRepositories.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {favoriteRepositories.map((repo) => (
                <RepositoryItem key={repo.id} repo={repo} />
              ))}
            </div>
          ) : (
            <p className="text-neutral-600 dark:text-neutral-400">
              You haven't favorited any repositories yet, or we couldn't fetch them.
            </p>
          )}
          */}
        <p className="text-neutral-600 dark:text-neutral-400">
          Favorite repositories will be implemented soon.
        </p>
      </section>
    </div>
  );
};
