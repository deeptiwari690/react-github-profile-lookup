import type { GitHubUser } from "../types.ts";

export const httpErrorMessage = (status: number, username: string) => `HTTP error ${status} for user ${username}`;

export async function fetchGithubUser(username: string): Promise<GitHubUser> {
  const url = `https://api.github.com/users/${username}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(httpErrorMessage(response.status, username));
  }
  const userData = await response.json();
  return userData as GitHubUser;
}