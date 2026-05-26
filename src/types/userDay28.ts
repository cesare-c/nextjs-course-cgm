export interface User {
  id: number | string;
  username: string;
  email: string;
  isActive: boolean;
  firstName: string;
  lastName: string;
  middleName?: string;
}

export interface UserInput {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  isActive?: boolean;
}
