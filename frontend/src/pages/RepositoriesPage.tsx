import type { Repository } from "../features/repositories/types";
import { RepositoryItem } from "../features/repositories/components/RepositoryItem";
import { useAuthStore } from "../store/auth.store";
import { useState } from "react";
import { generateCodeVerifier } from "../features/auth/utils/pkce";
import { generateCodeChallenge } from "../features/auth/utils/pkce";

// --- GitHub OAuth Configuration ---
// IMPORTANT: Replace with your actual Client ID and ensure Redirect URI matches your GitHub App settings
// TODO move to env variables
const GITHUB_CLIENT_ID = "Ov23liNVBP07iWV4iAtN";
const GITHUB_REDIRECT_URI = "http://localhost:5173/auth/github/callback"; // Or your configured port
const GITHUB_SCOPES = "read:user repo public_repo user:email"; // Added user:email for potentially fetching user info
// --- End GitHub OAuth Configuration ---

// Mock Data - Replace with actual data fetching later
const mockOwnedRepositories: Repository[] = [
  {
    id: "owned-1",
    name: "my-first-amazing-app",
    description:
      "A revolutionary application built with cutting-edge technology and a lot of coffee. It solves a problem you didn't even know you had.",
    language: "TypeScript",
    stargazers_count: 199,
    forks_count: 42,
    updated_at: "2024-03-10T10:00:00Z",
    html_url: "https://github.com/your-username/my-first-amazing-app",
  },
  {
    id: "owned-2",
    name: "project-phoenix",
    description: null, // No description
    language: "Python",
    stargazers_count: 75,
    forks_count: 15,
    updated_at: "2024-02-15T14:30:00Z",
    html_url: "https://github.com/your-username/project-phoenix",
  },
  {
    id: "owned-3",
    name: "dotfiles-and-configs",
    description:
      "My personal collection of dotfiles, scripts, and configurations for various tools and environments.",
    language: "Shell",
    stargazers_count: 12,
    forks_count: 3,
    updated_at: "2023-12-01T11:20:00Z",
    html_url: "https://github.com/your-username/dotfiles-and-configs",
  },
];

const mockFavoriteRepositories: Repository[] = [
  {
    id: "fav-1",
    name: "awesome-react-framework",
    description:
      "A very popular and comprehensive framework for building modern web applications with React. Features a great developer experience.",
    language: "JavaScript",
    stargazers_count: 150234,
    forks_count: 35678,
    updated_at: "2024-03-01T12:00:00Z",
    html_url: "https://github.com/popular-org/awesome-react-framework",
  },
  {
    id: "fav-2",
    name: "data-science-toolkit",
    description:
      "An indispensable library for data manipulation, analysis, and visualization in Python.",
    language: "Python",
    stargazers_count: 85000,
    forks_count: 23000,
    updated_at: "2024-03-05T09:15:00Z",
    html_url: "https://github.com/another-org/data-science-toolkit",
  },
];

// Note: Ensure this component name matches what's expected in your router
export const RepositoriesPage = () => {
  const githubAccessToken = useAuthStore((state) => state.githubAccessToken);

  const [isLoadingGithubData, setIsLoadingGithubData] = useState(false);

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

  // TODO: Add loading and error states when fetching real data
  // const [isLoading, setIsLoading] = useState(true);
  // const [error, setError] = useState<string | null>(null);
  // const [ownedRepos, setOwnedRepos] = useState<Repository[]>([]);
  // const [favoriteRepos, setFavoriteRepos] = useState<Repository[]>([]);

  // useEffect(() => {
  //   // Simulate fetching data
  //   setTimeout(() => {
  //     setOwnedRepos(mockOwnedRepositories);
  //     setFavoriteRepos(mockFavoriteRepositories);
  //     setIsLoading(false);
  //   }, 1000);
  // }, []);

  // if (isLoading) {
  //   return <div className="container mx-auto p-6 text-center">Loading repositories...</div>;
  // }

  // if (error) {
  //   return <div className="container mx-auto p-6 text-center text-red-500">Error loading repositories: {error}</div>;
  // }

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
        {mockOwnedRepositories.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {mockOwnedRepositories.map((repo) => (
              <RepositoryItem key={repo.id} repo={repo} />
            ))}
          </div>
        ) : (
          <p className="text-neutral-600 dark:text-neutral-400">
            You don\'t seem to have any repositories, or we couldn\'t fetch
            them.
          </p>
        )}
      </section>

      <section>
        <h2 className="text-2xl md:text-3xl font-semibold text-neutral-800 dark:text-neutral-100 mb-6 border-b border-neutral-300 dark:border-neutral-600 pb-3">
          Favorite Repositories
        </h2>
        {mockFavoriteRepositories.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {mockFavoriteRepositories.map((repo) => (
              <RepositoryItem key={repo.id} repo={repo} />
            ))}
          </div>
        ) : (
          <p className="text-neutral-600 dark:text-neutral-400">
            You haven\'t favorited any repositories yet, or we couldn\'t fetch
            them.
          </p>
        )}
      </section>
    </div>
  );
};
