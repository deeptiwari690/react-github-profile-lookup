export const ERRORS = {
  blank: "Username cannot be blank",
  tooLong: "Username is too long (maximum is 39 characters)",
  invalidFormat:
    "Username may only contain alphanumeric characters or single hyphens, and cannot begin or end with a hyphen",
};

const validFormat = /^(?!-|.*--)[a-z\d-]+(?<!-)$/i;

export function validateGitHubUsername(username: string) {
  if (username.trim() === "") return ERRORS.blank;
  if (username.length > 39) return ERRORS.tooLong;
  if (!validFormat.test(username)) return ERRORS.invalidFormat;
  return null;
}
