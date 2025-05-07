import type { Repository } from "../types"; // Using type-only import
import { StarIcon as StarSolidIcon } from "@heroicons/react/24/solid";
import { StarIcon as StarOutlineIcon } from "@heroicons/react/24/outline";

interface RepositoryItemProps {
  repo: Repository;
  isFavorite: boolean;
  onToggleFavorite: (repoId: string | number) => void;
}

export const RepositoryItem = ({
  repo,
  isFavorite,
  onToggleFavorite,
}: RepositoryItemProps) => {
  const lastUpdated = new Date(repo.updated_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const handleFavoriteClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    onToggleFavorite(repo.id);
  };

  return (
    <div className="relative p-4 border border-neutral-200 dark:border-neutral-700 rounded-md shadow-sm bg-white dark:bg-neutral-800 hover:shadow-lg transition-shadow duration-150 ease-in-out">
      <button
        onClick={handleFavoriteClick}
        className="absolute top-3 right-3 p-1 text-gray-500 hover:text-yellow-500 dark:text-gray-400 dark:hover:text-yellow-400 focus:outline-none z-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        title={isFavorite ? "Remove from favorites" : "Add to favorites"} // Tooltip for better UX
      >
        {isFavorite ? (
          <StarSolidIcon className="w-6 h-6 text-yellow-500 dark:text-yellow-400" />
        ) : (
          <StarOutlineIcon className="w-6 h-6" />
        )}
      </button>

      <div className="mb-2 pr-10">
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
            <span className={`w-3 h-3 rounded-full bg-blue-500 mr-1.5`}></span>
            {repo.language}
          </span>
        )}
        <span className="flex items-center whitespace-nowrap">
          Updated: {lastUpdated}
        </span>
      </div>
    </div>
  );
};
