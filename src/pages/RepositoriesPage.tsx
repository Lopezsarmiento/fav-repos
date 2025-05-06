import React from "react";
import type { Repository } from "../features/repositories/types";
import { RepositoryItem } from "../features/repositories/components/RepositoryItem";

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
export const RepositoriesPage: React.FC = () => {
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
