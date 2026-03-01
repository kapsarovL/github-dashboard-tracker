/**
 * Robustly parses a repository string into owner and repo name.
 * Handles:
 * - owner/repo
 * - owner repo
 * - https://github.com/owner/repo
 * - github.com/owner/repo
 */
export function parseRepoString(
  input: string,
): { owner: string; repo: string } | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  // Handle full URLs
  try {
    if (trimmed.startsWith("http") || trimmed.includes("github.com")) {
      const urlString = trimmed.startsWith("http")
        ? trimmed
        : `https://${trimmed}`;
      const url = new URL(urlString);
      if (url.hostname === "github.com") {
        const pathParts = url.pathname.split("/").filter(Boolean);
        if (pathParts.length >= 2) {
          return { owner: pathParts[0], repo: pathParts[1] };
        }
      }
    }
  } catch {
    // Fallback to regex if URL parsing fails
  }

  // Handle owner/repo or owner repo
  const parts = trimmed.split(/[\/\s]+/).filter(Boolean);
  if (parts.length >= 2) {
    return { owner: parts[0], repo: parts[1] };
  }

  return null;
}

/**
 * Validates if the input string can be parsed into a valid repository format.
 */
export function isValidRepoFormat(input: string): boolean {
  return parseRepoString(input) !== null;
}
