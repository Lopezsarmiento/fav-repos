export interface Repository {
  id: string | number;
  name: string;
  description: string | null;
  language: string | null;
  updated_at: string;
  html_url: string;
}
