import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';

export default function Index() {
  const router = useRouter();
  const { user, initializing } = useAuth() as any;

  useEffect(() => {
    if (initializing) return;
    router.replace(user ? '/(app)/(tabs)/home' : '/login');
  }, [initializing, user]);

  return null;
}