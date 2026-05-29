export interface AuthUser {
  id: string | number;
  email: string;
  username: string;
  fullName: string;
}

export interface AuthResponse {
  accessToken: string;
  user: AuthUser;
}

export interface UserStorageData {
  token: string;
  user: AuthUser;
}
