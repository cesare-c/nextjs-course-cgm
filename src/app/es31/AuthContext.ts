import { createContext } from 'react';
import type { AuthUser } from '../../exercises/Es31_Auth/types/auth';

export interface AuthContextType {
  user: AuthUser | null;
  login: (token: string, loggedUser: AuthUser) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
});
