import { useAuth } from '@/hooks/useAuth';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const router = useRouter();
  
  const { signOut } = useAuth();

  const stats = [
    { icon: 'location', value: '47', label: 'Destinos', color: '#ff6a32' },
    { icon: 'star', value: '892', label: 'Pontos', color: '#1238b4' },
    { icon: 'trophy', value: '12', label: 'Badges', color: '#68c7d1' },
  ];

  const menuItems = [
    { icon: 'person-outline', label: 'Dados Pessoais', color: '#1238b4', route: '/personal-data' },
    { icon: 'heart-outline', label: 'Preferências de Viagem', color: '#ff6a32' },
    { icon: 'lock-closed-outline', label: 'Privacidade & Segurança', color: '#1238b4', badge: 1, route: '/privacy-security' },
    { icon: 'help-circle-outline', label: 'Ajuda & Suporte', color: '#ff6a32' },
  ];

  const handleLogout = () => {
    signOut();
  };

  return (
    <SafeAreaView className="flex-1 bg-secondary">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-6 pt-4 pb-6">
          <View className="flex-row items-center justify-between mb-6">
            <Text className="text-h1 text-primary font-bold">Perfil</Text>
            <TouchableOpacity 
              onPress={() => router.push('/settings')}
              className="w-10 h-10 rounded-full bg-white items-center justify-center shadow-sm"
            >
              <Ionicons name="settings-outline" size={22} color="#1238b4" />
            </TouchableOpacity>
          </View>

          {/* Avatar & Info */}
          <View className="items-center mb-6">
            <View className="relative mb-4">
              <View className="w-28 h-28 rounded-full bg-white items-center justify-center shadow-md border-4 border-primary/10">
                <Ionicons name="person" size={50} color="#1238b4" />
              </View>
              <TouchableOpacity className="absolute bottom-0 right-0 w-9 h-9 rounded-full bg-primary items-center justify-center shadow-md border-3 border-secondary">
                <Ionicons name="camera" size={18} color="#fff5dc" />
              </TouchableOpacity>
            </View>
            
            <Text className="text-h2 text-primary font-bold">@devluz</Text>
            <Text className="text-body text-primary/60 mt-1">d3vluz@gmail.com</Text>
          </View>

          {/* Stats */}
          <View className="flex-row justify-between gap-3">
            {stats.map((stat, idx) => (
              <View key={idx} className="flex-1 bg-white rounded-card p-4 shadow-card items-center">
                <View className="w-12 h-12 rounded-full items-center justify-center mb-2" style={{ backgroundColor: stat.color + '15' }}>
                  <Ionicons name={stat.icon as any} size={24} color={stat.color} />
                </View>
                <Text className="text-h2 text-primary font-bold">{stat.value}</Text>
                <Text className="text-tiny text-primary/60 mt-1">{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Menu */}
        <View className="px-6 pb-6">
          <View className="bg-white rounded-card shadow-card overflow-hidden">
            {menuItems.map((item, idx) => (
              <Pressable 
                key={idx} 
                onPress={() => item.route && router.push(item.route as any)}
                className={`flex-row items-center p-4 active:bg-primary/5 ${idx !== menuItems.length - 1 ? 'border-b border-primary/5' : ''}`}
              >
                <View className="w-10 h-10 rounded-full items-center justify-center mr-3" style={{ backgroundColor: item.color + '15' }}>
                  <Ionicons name={item.icon as any} size={22} color={item.color} />
                </View>
                <Text className="text-body text-primary flex-1 font-medium">{item.label}</Text>
                {item.badge && (
                  <View className="w-6 h-6 rounded-full bg-orange items-center justify-center mr-2">
                    <Text className="text-white text-tiny font-bold">{item.badge}</Text>
                  </View>
                )}
                <Ionicons name="chevron-forward" size={20} color="#1238b4" />
              </Pressable>
            ))}
          </View>
        </View>

        {/* Logout */}
        <View className="px-6 pb-8">
          <TouchableOpacity 
            onPress={handleLogout}
            className="bg-white border-2 border-orange rounded-card p-4 flex-row items-center justify-center gap-2 shadow-sm active:bg-red-50"
          >
            <Ionicons name="log-out-outline" size={24} color="#EF4444" />
            <Text className="text-orange font-bold text-body">Sair da Conta</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}