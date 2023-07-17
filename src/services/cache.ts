import cacheData from 'memory-cache';

export class CacheService {
  get (key: string) {
    return cacheData.get(key);
  }

  put (key: string, value: unknown, ttl?: number) {
    cacheData.put(key, value, ttl);
  }
}
