import { LoginCredentials, LoginResponse } from '@/types/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from './client';

const TOKEN_KEY = '@navtour:token';
const USER_KEY = '@navtour:user';

export const authService = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    try {
      console.debug('[authService] login request', { email: credentials.email });
      const response = await api.post<LoginResponse>('/auth/login', credentials);
      const data = response.data;
      console.debug('[authService] login response', { status: response.status, data });

      if (data?.token) {
        await AsyncStorage.setItem(TOKEN_KEY, data.token);
        console.debug('[authService] token stored', data.token);
      }
      if (data?.usuario) {
        await AsyncStorage.setItem(USER_KEY, JSON.stringify(data.usuario));
        console.debug('[authService] usuario stored', data.usuario);
      }

      return data;
    } catch (error: any) {
      const message = error?.response?.data?.message || error?.message || 'Erro ao efetuar login';
      console.warn('[authService] login error', { message, error });
      throw new Error(message);
    }
  },

  logout: async (): Promise<void> => {
    await AsyncStorage.removeItem(TOKEN_KEY);
    await AsyncStorage.removeItem(USER_KEY);
  },

  getStoredUser: async () => {
    const raw = await AsyncStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },
};

export default authService;
