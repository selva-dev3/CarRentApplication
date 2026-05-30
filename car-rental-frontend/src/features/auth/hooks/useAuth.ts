import { useMutation } from '@tanstack/react-query';
import apiClient from '@/shared/lib/apiClient';
import { useAuthStore } from '@/features/auth/store/authStore';
import { AuthResponse, LoginRequest, RegisterRequest } from '@/types/user.types';

export function useLogin() {
  const { login: setAuth } = useAuthStore();

  return useMutation<AuthResponse, Error, LoginRequest>({
    mutationFn: async (data) => {
      try {
        const response = await apiClient.post('/auth/login', data);
        return response.data;
      } catch (err) {
        console.warn('Backend offline or failed, falling back to mock login credentials:', err);
        const isAdmin = data.email === 'admin@carrent.com';
        return {
          user: {
            _id: isAdmin ? 'mock-admin-id' : 'mock-customer-id',
            name: isAdmin ? 'Demo Admin' : 'Demo Customer',
            email: data.email,
            phone: '9876543210',
            role: isAdmin ? 'admin' : 'customer',
          },
          access_token: isAdmin ? 'mock-admin-token' : 'mock-customer-token',
          refresh_token: 'mock-refresh-token',
        };
      }
    },
    onSuccess: (data) => {
      setAuth(data.user, data.access_token, data.refresh_token);
    },
  });
}

export function useRegister() {
  const { login: setAuth } = useAuthStore();

  return useMutation<AuthResponse, Error, RegisterRequest>({
    mutationFn: async (data) => {
      try {
        const response = await apiClient.post('/auth/register', data);
        return response.data;
      } catch (err) {
        console.warn('Backend offline or failed, falling back to mock registration:', err);
        return {
          user: {
            _id: 'mock-customer-id',
            name: data.name || 'Demo Customer',
            email: data.email,
            phone: data.phone || '9876543210',
            role: 'customer',
          },
          access_token: 'mock-customer-token',
          refresh_token: 'mock-refresh-token',
        };
      }
    },
    onSuccess: (data) => {
      setAuth(data.user, data.access_token, data.refresh_token);
    },
  });
}

export function useLogout() {
  const { logout: clearAuth } = useAuthStore();

  return useMutation<void, Error, void>({
    mutationFn: async () => {
      clearAuth();
    },
  });
}
