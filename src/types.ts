import { z } from "zod";

export const GitHubUserSchema = z.object({
  login: z.string(),
  avatar_url: z.string(),
  html_url: z.string(),
  name: z.string().nullable(),
  company: z.string().nullable(),
  location: z.string().nullable(),
  public_repos: z.number(),
  followers: z.number(),
  following: z.number(),
});

export type GitHubUser = z.infer<typeof GitHubUserSchema>;
