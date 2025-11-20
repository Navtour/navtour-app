import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { router } from 'expo-router';

export const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('@navtour:token');
    if (token) {
      console.debug('[api] attaching token to request');
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.debug('[api] no token found in storage');
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      console.debug('[api] 401 response - clearing storage and redirecting to login');
      await AsyncStorage.removeItem('@navtour:token');
      await AsyncStorage.removeItem('@navtour:user');
      router.replace('/login');
    }
    return Promise.reject(error);
  }
);