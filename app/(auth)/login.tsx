import { Button } from '@/components/ui/Button';
import { Divider } from '@/components/ui/Divider';
import { Input } from '@/components/ui/Input';
import { Logo } from '@/components/ui/Logo';
import { Text } from '@/components/ui/text';
import { useAuth } from '@/hooks/useAuth';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { signIn, loading } = useAuth();
  const params = useLocalSearchParams();

  useEffect(() => {
    if (params?.email) {
      setEmail(String(params.email));
    }
  }, [params?.email]);

  const handleLogin = async () => {
    setError(null);
    try {
      await signIn({ email, senha: password });
      router.replace('/onboarding');
    } catch (err: any) {
      setError(err?.message || 'Erro ao efetuar login');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-secondary">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View className="px-6 py-8">
            <View className="items-center mb-6">
              <Logo variant="long" color="primary" size={260} />
            </View>

            <View className="w-full gap-4">
              <View className="gap-2">
                <Text className="text-primary font-bold text-sm">Email</Text>
                <Input
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Digite seu e-mail"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  className="bg-white border-2 border-primary"
                />
              </View>

              <View className="gap-2">
                <Text className="text-primary font-bold text-sm">Senha</Text>
                <View className="relative">
                  <Input
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Digite sua senha"
                    secureTextEntry={!showPassword}
                    className="bg-white border-2 border-primary pr-12"
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-0 h-full justify-center"
                  >
                    <Ionicons
                      name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                      size={24}
                      color="#1238b4"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity
                onPress={() => router.push('/forgot-password')}
                className="self-end"
              >
                <Text className="text-primary text-sm">
                  Esqueceu a senha?
                </Text>
              </TouchableOpacity>

              <Button className="bg-primary h-12 mt-2" onPress={handleLogin} disabled={loading}>
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text className="text-secondary font-semibold">Login</Text>
                )}
              </Button>

              {error ? (
                <Text className="text-destructive text-sm mt-2">{error}</Text>
              ) : null}
            </View>

            <Divider />

            <Button
              variant="outline"
              className="border-2 border-primary bg-transparent h-12"
            >
              <View className="flex-row items-center gap-2">
                <Ionicons name="logo-google" size={24} color="#1238b4" />
                <Text className="text-primary font-semibold">Entrar com Google</Text>
              </View>
            </Button>

            <View className="flex-row items-center justify-center mt-6">
              <Text className="text-primary text-sm">
                Ainda não tem uma conta?{' '}
              </Text>
              <TouchableOpacity onPress={() => router.push('/register')}>
                <Text className="text-primary font-bold text-sm">
                  Cadastrar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}