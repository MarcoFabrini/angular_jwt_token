export interface LoginResponse {
  token: string;
  expiresIn: number;
  description?: string;
}
