export interface LoginResponse {
  token: string;
  expiresIn: number;
  detail?: string;
  description?: string;
}
