import { useAuthStore } from "../../../store/auth.store"; // Adjust path as needed
import type { Repository } from "../types"; // Assuming your Repository type is here

const GITHUB_API_BASE_URL = "https://api.github.com";

interface FetchGitHubParams {
  endpoint: string;
  method?: "GET" | "POST" | "PUT" | "DELETE"; // Add other methods if needed
  body?: Record<string, unknown>;
}

export async function fetchGitHubApi<T>({
  endpoint,
  method = "GET",
  body,
}: FetchGitHubParams): Promise<T> {
  const token = useAuthStore.getState().githubAccessToken;

  if (!token) {
    throw new Error("GitHub access token not found. Please connect to GitHub.");
  }

  const headers: HeadersInit = {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github.v3+json", // Recommended by GitHub
    "X-GitHub-Api-Version": "2022-11-28", // Recommended by GitHub
  };

  if (method !== "GET" && body) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(`${GITHUB_API_BASE_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("GitHub API Error:", errorData);
    // You might want to throw a custom error object or handle specific status codes
    // e.g., if 401, token might be invalid/expired -> trigger re-auth
    throw new Error(
      errorData.message || `GitHub API request failed: ${response.status}`
    );
  }

  // For 204 No Content (e.g. from a successful DELETE or PUT without a response body)
  if (response.status === 204) {
    return {} as T; // Or handle as appropriate for your use case
  }

  return response.json() as Promise<T>;
}

// Specific function to fetch user's own repositories
export async function fetchUserRepositories(): Promise<Repository[]> {
  // By default, fetches repositories for the authenticated user
  // By default, sorts by `full_name` (name with owner).
  // You can add params like sort, direction, per_page, page
  // e.g., endpoint: '/user/repos?sort=updated&per_page=10'
  return fetchGitHubApi<Repository[]>({
    endpoint: "/user/repos?sort=pushed&per_page=100",
  });
}

// Later, you can add:
// export async function fetchStarredRepositories(): Promise<Repository[]> {
//   return fetchGitHubApi<Repository[]>({ endpoint: '/user/starred?per_page=100' });
// }
