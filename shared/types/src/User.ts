export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface Profile {
  id: string;
  userId: string;
  bio?: string;
  avatar?: string;
  skills: string[];
  experience: Experience[];
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  startDate: Date;
  endDate?: Date;
  description: string;
}

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  HR = 'hr'
}