import { apiService } from './api';
import type { User, LoginCredentials, RegisterData } from '@/types';

export const authService = {
  async login(credentials: LoginCredentials): Promise<User> {
    const { token, user } = await apiService.post<{ token: string; user: User }>(
      '/auth/login',
      credentials
    );
    localStorage.setItem('token', token);
    return user;
  },

  async register(data: RegisterData): Promise<User> {
    const { token, user } = await apiService.post<{ token: string; user: User }>(
      '/auth/register',
      data
    );
    localStorage.setItem('token', token);
    return user;
  },

  async loginWithGoogle(accessToken: string): Promise<User> {
    const { token, user } = await apiService.post<{ token: string; user: User }>('/auth/google', { accessToken });
    localStorage.setItem('token', token);
    return user;
  },

  async loginWithFacebook(accessToken: string): Promise<User> {
    const { token, user } = await apiService.post<{ token: string; user: User }>('/auth/facebook', { accessToken });
    localStorage.setItem('token', token);
    return user;
  },

  async loginWithApple(identityToken: string): Promise<User> {
    const { token, user } = await apiService.post<{ token: string; user: User }>('/auth/apple', { identityToken });
    localStorage.setItem('token', token);
    return user;
  },

  async logout(): Promise<void> {
    await apiService.post('/auth/logout');
    localStorage.removeItem('token');
  },

  async getCurrentUser(): Promise<User> {
    return apiService.get<User>('/auth/me');
  },

  async updateProfile(data: Partial<User>): Promise<User> {
    return apiService.patch<User>('/auth/profile', data);
  },

  async updatePassword(currentPassword: string, newPassword: string): Promise<void> {
    await apiService.patch('/auth/password', { currentPassword, newPassword });
  },

  async requestPasswordReset(email: string): Promise<void> {
    await apiService.post('/auth/reset-password', { email });
  },

  async resetPassword(token: string, newPassword: string): Promise<void> {
    await apiService.post('/auth/reset-password/confirm', { token, newPassword });
  },

  async verifyEmail(token: string): Promise<void> {
    await apiService.post('/auth/verify-email', { token });
  },

  async resendVerificationEmail(): Promise<void> {
    await apiService.post('/auth/resend-verification');
  },
};
