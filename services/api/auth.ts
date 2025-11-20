import { LoginCredentials, LoginResponse } from '@/types/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from './client';

const TOKEN_KEY = '@navtour:token';
const USER_KEY = '@navtour:user';

export const authService = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    try {
      const response = await api.post<LoginResponse>('/auth/login', credentials);
      const data = response.data;

      if (data?.token) {
        await AsyncStorage.setItem(TOKEN_KEY, data.token);
      }
      if (data?.usuario) {
        await AsyncStorage.setItem(USER_KEY, JSON.stringify(data.usuario));
      }

      return data;
    } catch (error: any) {
      const message = error?.response?.data?.message || error?.message || 'Erro ao efetuar login';
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
