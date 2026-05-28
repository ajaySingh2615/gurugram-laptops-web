import { apiClient } from '../lib/api-client';

// We mirror the exact DTO types from the backend!
export interface RegisterDto {
  fullName: string;
  email: string;
  password?: string;
}

export interface LoginDto {
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
  };
}

export class AuthService {
  public static async register(data: RegisterDto): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/register', data);
    return response.data;
  }

  public static async login(data: LoginDto): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', data);
    return response.data;
  }

  public static async getMe(): Promise<{ userId: string }> {
    const response = await apiClient.get('/auth/me');
    // Note: Our current backend only returns { success, message, userId } for the /me route.
    return { userId: response.data.userId };
  }

  public static async logout(): Promise<void> {
    await apiClient.post('/auth/logout');
  }

  public static async refreshToken(): Promise<void> {
    await apiClient.post('/auth/refresh-token');
  }
}
