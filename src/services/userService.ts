import type { UserRaw, User, CacheData } from '../types/user';
import rawUsersData from '../data/users.json';

const CACHE_KEY = 'USERS_LIST_CACHE_KEY';
const CACHE_DURATION_MS = 2 * 60 * 1000; // 2 minutes in milliseconds

// In-memory cache variable
let inMemoryCache: CacheData | null = null;

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const userService = {
  // 1. Fetching (simulated with random delay and error/empty probabilities)
  fetchUsersRaw: async (): Promise<UserRaw[]> => {
    // Random delay between 1000ms and 3000ms
    const waitTime = Math.floor(Math.random() * 2001) + 1000;
    await delay(waitTime);

    // 5% chance that the call fails (throws error)
    const errorRoll = Math.random();
    if (errorRoll < 0.05) {
      throw new Error('MOCK_NETWORK_FAILURE');
    }

    // 5% chance that the list is empty
    const emptyRoll = Math.random();
    if (emptyRoll < 0.05) {
      return [];
    }

    return rawUsersData as UserRaw[];
  },

  // 2. Validation
  validateUsers: (data: any): UserRaw[] => {
    if (!Array.isArray(data)) {
      throw new Error('MOCK_VALIDATION_FAILURE');
    }
    
    for (const item of data) {
      if (
        typeof item.id !== 'number' || 
        typeof item.name !== 'string' || !item.name.trim() ||
        typeof item.email !== 'string' || !item.email.trim() ||
        typeof item.role !== 'string' || !item.role.trim()
      ) {
        throw new Error('MOCK_VALIDATION_FAILURE');
      }
    }
    
    return data as UserRaw[];
  },

  // 3. Mapping
  mapUsers: (rawUsers: UserRaw[]): User[] => {
    return rawUsers.map(user => {
      // Calculate initials (e.g. "Mario Rossi" -> "MR")
      const nameParts = user.name.trim().split(/\s+/);
      const initials = nameParts
        .map(part => part.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2);

      return {
        id: user.id,
        fullName: user.name,
        emailAddress: user.email,
        roleName: user.role,
        initials: initials || '?'
      };
    });
  },

  // 4. Caching
  getCache: (): CacheData | null => {
    return inMemoryCache;
  },

  isCacheValid: (cache: CacheData | null): boolean => {
    if (!cache) return false;
    const now = Date.now();
    return (now - cache.timestamp) < CACHE_DURATION_MS;
  },

  setCache: (users: User[]): CacheData => {
    inMemoryCache = {
      timestamp: Date.now(),
      users
    };
    return inMemoryCache;
  },

  clearCache: (): void => {
    inMemoryCache = null;
  },

  getCacheKey: (): string => {
    return CACHE_KEY;
  },

  getCacheDurationMs: (): number => {
    return CACHE_DURATION_MS;
  }
};
