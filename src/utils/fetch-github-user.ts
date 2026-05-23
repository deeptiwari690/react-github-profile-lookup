import { GitHubUserSchema } from "../types.ts";

export const formatHttpErrorMessage = (status: number, username: string) => `HTTP error ${status} for user ${username}`;

export async function fetchGitHubUser(username: string) {
  const url = `https://api.github.com/users/${username}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(formatHttpErrorMessage(response.status, username));
  }
  const rawUserData = await response.json();
  const parsedUserData = GitHubUserSchema.parse(rawUserData);
  return parsedUserData;
}