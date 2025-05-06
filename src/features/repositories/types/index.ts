export interface Repository {
  id: string | number;
  name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string; // ISO date string
  html_url: string; // URL to the repo on GitHub
}
