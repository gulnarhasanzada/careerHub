import { User } from "./User";

export interface LoginRequest{
    email: string;
    password: string;
}

export interface LoginResponse{
    user: User;
    accessToken: string;
    refreshToken: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}