/**
 * Default TTL strategies for various types of cached data in seconds.
 * Extracted here to centralize configuration and easily tune performance vs freshness.
 */

export const TTL_STRATEGY = {
  // Frequently changing stats like recent commits or issues (e.g. 15 minutes)
  DASHBOARD_STATS: 15 * 60,

  // Repository metadata that rarely changes like description, license (e.g. 24 hours)
  REPO_METADATA: 24 * 60 * 60,

  // Fallback default (e.g. 1 hour)
  DEFAULT: 60 * 60,
};

/**
 * Helper to determine the appropriate TTL based on the key prefix.
 * @param keyPrefix A string identifier for the type of data (e.g., 'stats', 'metadata')
 * @returns The TTL in seconds
 */
export function getTTL(keyPrefix: string): number {
  switch (keyPrefix.toLowerCase()) {
    case "stats":
    case "dashboard_stats":
      return TTL_STRATEGY.DASHBOARD_STATS;
    case "metadata":
    case "repo_metadata":
      return TTL_STRATEGY.REPO_METADATA;
    default:
      return TTL_STRATEGY.DEFAULT;
  }
}
