import api from "./axios";

export type Role = "candidate" | "recruiter" | "admin";

export interface User {
  id: string | number;
  full_name: string;
  email: string;
  role: Role;
  company_id?: string | number | null;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  full_name: string;
  email: string;
  password: string;
  role: Role;
}

export interface AuthResponse {
  access_token: string;
  token_type?: string;
  role: Role;
  company_id?: string | number | null;
  user?: User;
}

export const loginUser = (payload: LoginPayload) =>
  api.post<AuthResponse>("/users/login", payload).then((res) => res.data);

export const registerUser = (payload: RegisterPayload) =>
  api.post<AuthResponse>("/users/register", payload).then((res) => res.data);

export const getCurrentUser = () =>
  api.get<User>("/users/me").then((res) => res.data);
