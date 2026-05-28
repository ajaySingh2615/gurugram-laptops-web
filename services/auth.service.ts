import { apiClient } from '../lib/api-client';

// We mirror the exact DTO types from the backend!
export interface RegisterDto {
  fullName: string;
  email: string;
  password?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      id: string;
      fullName: string | null;
      email: string;
    };
    tokens: {
      accessToken: string;
      refreshToken: string;
    };
  };
}

export class AuthService {
  public static async register(data: RegisterDto): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/register', data);
    return response.data;
  }
}
