import { api } from '../client.js';
import { API_ROUTES, LoginRequest, LoginResponse } from 'shared';

export const authService = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>(API_ROUTES.AUTH.LOGIN, credentials);
    if (response.token) {
      localStorage.setItem('auth_token', response.token);
    }
    return response;
  },

  async logout(): Promise<void> {
    try {
      await api.post(API_ROUTES.AUTH.LOGOUT);
    } finally {
      localStorage.removeItem('auth_token');
    }
  },

  async getCurrentUser() {
    return api.get<{ user: LoginResponse['user'] }>(API_ROUTES.AUTH.ME);
  },

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};

