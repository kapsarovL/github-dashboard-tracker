/**
 * A simple in-memory cache implementation with TTL support.
 * Used as a zero-config alternative to Redis.
 */
class LocalCache {
  private cache = new Map<string, { value: unknown; expiry: number }>();

  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }
    return item.value as T;
  }

  set(key: string, value: unknown, ttlSeconds: number): void {
    this.cache.set(key, {
      value,
      expiry: Date.now() + ttlSeconds * 1000,
    });
  }

  delete(key: string): void {
    this.cache.delete(key);
  }
}

const localCache = new LocalCache();

/**
 * Retrieves a value from the cache.
 */
export async function getCache<T>(key: string): Promise<T | null> {
  try {
    return localCache.get<T>(key);
  } catch (error) {
    console.error("Cache Get Error for key %s:", key, error);
    return null;
  }
}

/**
 * Sets a value in the cache with a Time-To-Live (TTL).
 */
export async function setCache<T>(
  key: string,
  value: T,
  ttlSeconds: number,
): Promise<void> {
  try {
    localCache.set(key, value, ttlSeconds);
  } catch (error) {
    console.error("Cache Set Error for key %s:", key, error);
  }
}

/**
 * Deletes a value from the cache.
 */
export async function delCache(key: string): Promise<void> {
  try {
    localCache.delete(key);
  } catch (error) {
    console.error("Cache Del Error for key %s:", key, error);
  }
}
