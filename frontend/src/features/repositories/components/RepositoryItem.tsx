import type { Repository } from "../types"; // Using type-only import

// Consider adding icons later for a richer UI
// import { StarIcon, RepoForkedIcon, LawIcon, CalendarIcon } from '@primer/octicons-react';

interface RepositoryItemProps {
  repo: Repository;
}

export const RepositoryItem = ({ repo }: RepositoryItemProps) => {
  const lastUpdated = new Date(repo.updated_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  // Simple colored dot for language - you can expand this with a color mapping
  const languageColor = "bg-blue-500"; // Default color

  return (
    <div className="p-4 border border-neutral-200 dark:border-neutral-700 rounded-md shadow-sm bg-white dark:bg-neutral-800 hover:shadow-lg transition-shadow duration-150 ease-in-out">
      <div className="mb-2">
        <a
          href={repo.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 dark:text-blue-400 hover:underline text-xl font-semibold break-all"
        >
          {repo.name}
        </a>
      </div>
      <p className="text-sm text-neutral-600 dark:text-neutral-300 mb-3 min-h-[40px] break-words">
        {repo.description || "No description available."}
      </p>
      <div className="flex flex-wrap items-center text-xs text-neutral-500 dark:text-neutral-400 gap-x-4 gap-y-1">
        {repo.language && (
          <span className="flex items-center">
            <span
              className={`w-3 h-3 rounded-full ${languageColor} mr-1.5`}
            ></span>
            {/* <LawIcon className="mr-1" /> */}
            {repo.language}
          </span>
        )}
        <span className="flex items-center">
          {/* <StarIcon className="mr-1" /> */}
          Stars: {repo.stargazers_count.toLocaleString()}
        </span>
        <span className="flex items-center">
          {/* <RepoForkedIcon className="mr-1" /> */}
          Forks: {repo.forks_count.toLocaleString()}
        </span>
        <span className="flex items-center whitespace-nowrap">
          {/* <CalendarIcon className="mr-1" /> */}
          Updated: {lastUpdated}
        </span>
      </div>
    </div>
  );
};
