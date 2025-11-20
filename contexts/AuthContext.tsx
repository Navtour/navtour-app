import authService from '@/services/api/auth';
import {
  AuthContextData,
  LoginCredentials,
  RegisterCredentials,
  UserResponse
} from '@/types/auth';
import { router } from 'expo-router';
import React, { ReactNode, createContext, useState } from 'react';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);


export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const signIn = async (credentials: LoginCredentials) => {
    setLoading(true);
    try {
      const response = await authService.login(credentials);
      setUser(response.usuario);
    } catch (error: any) {
      throw new Error(error.message);
    } finally {
      setLoading(false);
    }
  };

  async function signUp(_credentials: RegisterCredentials) { }

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
    signUp: async (c: RegisterCredentials) => { console.log('Cadastro não implementado'); },
    signInWithGoogle: async () => { console.log('Google Sign In não implementado'); },
    resetPassword: async () => { console.log('Reset Password não implementado'); },
  };

  return (
    <AuthContext.Provider
      value={authData}
    >
      {children}
    </AuthContext.Provider>
  );
}