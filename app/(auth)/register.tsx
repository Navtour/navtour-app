import { Button } from '@/components/ui/Button';
import { Divider } from '@/components/ui/Divider';
import { Input } from '@/components/ui/Input';
import { Logo } from '@/components/ui/Logo';
import { Text } from '@/components/ui/text';
import { useAuth } from '@/hooks/useAuth';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RegisterScreen() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { signUp, loading } = useAuth();

  const onlyDigits = (text: string) => text.replace(/\D/g, '');

  const formatCPF = (text: string) => {
    const d = onlyDigits(text).slice(0, 11);
    let out = d;
    if (d.length > 9) out = d.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    else if (d.length > 6) out = d.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
    else if (d.length > 3) out = d.replace(/(\d{3})(\d{1,3})/, '$1.$2');
    return out;
  };

  const formatPhoneDisplay = (text: string) => {
    const d = onlyDigits(text).slice(0, 11); 
    if (d.length <= 2) return d;
    const area = d.slice(0, 2);
    const rest = d.slice(2);
    if (rest.length <= 5) return `(${area})${rest}`;
    return `(${area})${rest.slice(0,5)}-${rest.slice(5)}`;
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (event.type === 'dismissed') return;
    const current = selectedDate || new Date();
    const iso = current.toISOString().slice(0, 10);
    setDataNascimento(iso);
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

            <View className="mb-6">
              <Text className="text-primary font-bold text-3xl mb-2">
                Criar Conta
              </Text>
              <Text className="text-primary text-base">
                Preencha os dados abaixo para se cadastrar
              </Text>
            </View>

            <View className="w-full gap-4">
              <View className="gap-2">
                <Text className="text-primary font-bold text-sm">Nome de usuário</Text>
                <Input
                  value={username}
                  onChangeText={setUsername}
                  placeholder="Digite seu nome de usuário"
                  autoCapitalize="none"
                  className="bg-white border-2 border-primary"
                />
              </View>

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
                <Text className="text-primary font-bold text-sm">CPF</Text>
                <Input
                  value={cpf}
                  onChangeText={(t) => setCpf(formatCPF(t))}
                  placeholder="000.000.000-00"
                  keyboardType="default"
                  autoCapitalize="none"
                  className="bg-white border-2 border-primary"
                />
              </View>

              <View className="gap-2">
                <Text className="text-primary font-bold text-sm">Telefone</Text>
                <Input
                  value={telefone}
                  onChangeText={(t) => setTelefone(formatPhoneDisplay(t))}
                  placeholder="(00)00000-0000"
                  keyboardType="phone-pad"
                  className="bg-white border-2 border-primary"
                />
              </View>

              <View className="gap-2">
                <Text className="text-primary font-bold text-sm">Data de nascimento</Text>
                <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                  <View className="bg-white border-2 border-primary p-3">
                    <Text className="text-primary">{dataNascimento || 'YYYY-MM-DD'}</Text>
                  </View>
                </TouchableOpacity>
                {showDatePicker && (
                  <DateTimePicker
                    value={dataNascimento ? new Date(dataNascimento) : new Date(1990, 0, 1)}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={handleDateChange}
                    maximumDate={new Date()}
                  />
                )}
              </View>

              <View className="gap-2">
                <Text className="text-primary font-bold text-sm">Criar senha</Text>
                <View className="relative">
                  <Input
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Crie uma senha segura"
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

              <View className="gap-2">
                <Text className="text-primary font-bold text-sm">Confirmar senha</Text>
                <View className="relative">
                  <Input
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder="Confirme sua senha"
                    secureTextEntry={!showConfirmPassword}
                    className="bg-white border-2 border-primary pr-12"
                  />
                  <TouchableOpacity
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-0 h-full justify-center"
                  >
                    <Ionicons
                      name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                      size={24}
                      color="#1238b4"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <Button className="bg-primary h-12 mt-2" onPress={async () => {
                setError(null);
                if (!username || !email || !password || !confirmPassword) {
                  setError('Preencha os campos obrigatórios');
                  return;
                }
                if (password !== confirmPassword) {
                  setError('As senhas não coincidem');
                  return;
                }

                const payload = {
                  nome: username,
                  email,
                  senha: password,
                  cpf,
                  telefone,
                  data_nascimento: dataNascimento,
                } as any;

                try {
                  await signUp(payload);
                } catch (err: any) {
                  setError(err?.message || 'Erro ao cadastrar usuário');
                }
              }} disabled={loading}>
                {loading ? <ActivityIndicator color="#fff" /> : <Text className="text-secondary font-semibold">Cadastrar</Text>}
              </Button>
              {error ? <Text className="text-destructive text-sm mt-2">{error}</Text> : null}
            </View>

            <Divider />

            <Button
              variant="outline"
              className="border-2 border-primary bg-transparent h-12"
            >
              <View className="flex-row items-center gap-2">
                <Ionicons name="logo-google" size={24} color="#1238b4" />
                <Text className="text-primary font-semibold">Cadastrar com Google</Text>
              </View>
            </Button>

            <View className="flex-row items-center justify-center mt-6">
              <Text className="text-primary text-sm">
                Já tem uma conta?{' '}
              </Text>
              <TouchableOpacity onPress={() => router.push('/login')}>
                <Text className="text-primary font-bold text-sm">
                  Logar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}