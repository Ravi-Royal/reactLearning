import type { CachedData } from './types';

const MS_PER_HOUR = 60 * 60 * 1000;

export function setCache<T>(key: string, data: T, ttlHours: number = 24): void {
  try {
    const cachedObj: CachedData<T> = {
      data,
      timestamp: Date.now() + ttlHours * MS_PER_HOUR,
    };
    localStorage.setItem(key, JSON.stringify(cachedObj));
  } catch (error) {
    console.error('Error writing to localStorage cache:', error);
  }
}

export function getCache<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      return null;
    }

    const parsed: CachedData<T> = JSON.parse(raw);
    if (Date.now() > parsed.timestamp) {
      localStorage.removeItem(key);
      return null;
    }

    return parsed.data;
  } catch (error) {
    console.error('Error reading from localStorage cache:', error);
    localStorage.removeItem(key);
    return null;
  }
}

export function clearCache(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing from localStorage cache:', error);
  }
}
