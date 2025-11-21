import { Text } from '@/components/ui/text';
import authService from '@/services/api/auth';
import {
  AuthContextData,
  LoginCredentials,
  RegisterCredentials,
  UserResponse
} from '@/types/auth';
import { router } from 'expo-router';
import React, { ReactNode, createContext, useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);


export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const stored = await authService.getStoredUser();
        if (stored) {
          setUser(stored as UserResponse);
        }
      } catch (e) {
        console.warn('Erro ao carregar usuário armazenado', e);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  const signIn = async (credentials: LoginCredentials) => {
    console.debug('[AuthProvider] signIn start', { email: credentials.email });
    setLoading(true);
    try {
      const response = await authService.login(credentials);
      console.debug('[AuthProvider] signIn success', { usuario: response.usuario });
      setUser(response.usuario);
    } catch (error: any) {
      console.warn('[AuthProvider] signIn error', error?.message || error);
      throw new Error(error.message || 'Erro ao efetuar login');
    } finally {
      setLoading(false);
      console.debug('[AuthProvider] signIn end');
    }
  };

  const signUp = async (credentials: RegisterCredentials) => {
    setLoading(true);
    try {
      await authService.register(credentials);
      const email = credentials.email;
      try {
        router.replace(`/login?email=${encodeURIComponent(email)}`);
      } catch {
        router.replace('/login');
      }
    } catch (error: any) {
      console.warn('[AuthProvider] signUp error', error?.message || error);
      throw new Error(error?.message || 'Erro ao cadastrar usuário');
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    await authService.logout();
    setUser(null);
    setLoading(false);
    router.replace('/login');
  };

  async function signInWithGoogle() { }

  async function resetPassword(_email: string) { }

  const authData: AuthContextData = {
    user,
    loading,
    signIn,
    signOut,
    signUp,
    signInWithGoogle: async () => { console.log('Google Sign In não implementado'); },
    resetPassword: async () => { console.log('Reset Password não implementado'); },
  };

  return (
    <AuthContext.Provider
      value={authData}
    >
      {loading && user === null ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF' }}>
          <ActivityIndicator size="large" color="#1238b4" />
          <Text className="mt-4 text-primary">Carregando sessão...</Text>
        </View>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}