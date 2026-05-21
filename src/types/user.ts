export interface UserRaw {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface User {
  id: number;
  fullName: string;
  emailAddress: string;
  roleName: string;
  initials: string;
}

export interface CacheData {
  timestamp: number;
  users: User[];
}
