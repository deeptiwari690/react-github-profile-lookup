import type { GitHubUser } from "../types.ts";

export const formatHttpErrorMessage = (status: number, username: string) => `HTTP error ${status} for user ${username}`;

export async function fetchGithubUser(username: string): Promise<GitHubUser> {
  const url = `https://api.github.com/users/${username}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(formatHttpErrorMessage(response.status, username));
  }
  const userData = await response.json();
  return userData as GitHubUser;
}
