export interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  name: string | null;
  company: string | null;
  location: string | null;
  public_repos: number;
  followers: number;
  following: number;
}