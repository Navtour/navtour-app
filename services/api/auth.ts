import { LoginCredentials, LoginResponse, RegisterCredentials } from '@/types/auth';
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

  register: async (credentials: RegisterCredentials): Promise<void> => {
    try {
      console.debug('[authService] register request', { email: credentials.email }, { nome: credentials.nome }, { cpf: credentials.cpf }, { telefone: credentials.telefone }, { data_nascimento: credentials.data_nascimento }, { endereco: credentials.endereco });
      const response = await api.post('/auth/register', credentials);
      console.debug('[authService] register response', { status: response.status, data: response.data });
      const data = response.data;
      return data;
    } catch (error: any) {
      const mensage = error?.response?.data?.message || error?.message || 'Erro ao efetuar registro';
      console.warn('[authService] register error', { mensage, error });
      throw new Error(mensage);
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
