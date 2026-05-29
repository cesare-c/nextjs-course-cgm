import type { AuthUser } from '../types/auth';

const TOKEN_KEY = 'auth_token_day31';
const USER_KEY = 'auth_user_day31';

export const localStorageHelper = {
  setAuthData(token: string, user: AuthUser): void {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  getAuthToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  getAuthUser(): AuthUser | null {
    const userStr = localStorage.getItem(USER_KEY);
    if (!userStr) return null;
    try {
      return JSON.parse(userStr) as AuthUser;
    } catch {
      return null;
    }
  },

  clearAuthData(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  isAuthenticated(): boolean {
    return !!this.getAuthToken();
  }
};
