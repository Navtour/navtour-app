import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, Image, Pressable, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Text } from '@/components/ui/text';

// @TODO: vincular o explorar para para a localização do roteiro
// @TODO: Não limitar/extipular quantidade de locais ao dia

type Activity = {
  id: number;
  name: string;
  time: string;
  description: string;
  location: string;
  category: 'nature' | 'culture' | 'food' | 'adventure';
  icon: string;
};

type DayItinerary = {
  day: number;
  date: string;
  activities: Activity[];
};

type Accommodation = {
  id: number;
  name: string;
  type: 'hotel' | 'hostel' | 'airbnb';
  address: string;
  checkIn: string;
  checkOut: string;
  startDay: number;
  endDay: number;
};

const DUMMY_ITINERARY = {
  id: 1,
  name: 'Ceará Completo - 7 dias',
  destination: 'Fortaleza, CE',
  startDate: '15/03/2025',
  endDate: '22/03/2025',
  accommodations: [
    {
      id: 1,
      name: 'Hotel Praia Mar',
      type: 'hotel' as const,
      address: 'Av. Beira Mar, 3500',
      checkIn: '15/03 - 14:00',
      checkOut: '18/03 - 12:00',
      startDay: 1,
      endDay: 3,
    },
    {
      id: 2,
      name: 'Pousada Cumbuco',
      type: 'hostel' as const,
      address: 'Rua das Dunas, 150',
      checkIn: '18/03 - 14:00',
      checkOut: '22/03 - 12:00',
      startDay: 4,
      endDay: 7,
    },
  ],
  days: [
    {
      day: 1,
      date: 'seg 15/03',
      activities: [
        {
          id: 1,
          name: 'Beach Park',
          time: '08:00 - 12:00',
          description: 'Manhã no maior parque aquático da América Latina',
          location: 'Aquiraz, CE',
          category: 'adventure' as const,
          icon: '🎢',
        },
        {
          id: 2,
          name: 'Almoço no Restaurante Oca',
          time: '12:30 - 14:00',
          description: 'Culinária regional com frutos do mar',
          location: 'Beach Park, Aquiraz',
          category: 'food' as const,
          icon: '🍽️',
        },
        {
          id: 3,
          name: 'Praia de Porto das Dunas',
          time: '14:30 - 17:00',
          description: 'Relaxar na praia e curtir o mar',
          location: 'Aquiraz, CE',
          category: 'nature' as const,
          icon: '🏖️',
        },
        {
          id: 4,
          name: 'Pôr do sol no Mirante',
          time: '17:30 - 18:30',
          description: 'Vista panorâmica da costa',
          location: 'Beach Park, Aquiraz',
          category: 'nature' as const,
          icon: '🌅',
        },
        {
          id: 5,
          name: 'Jantar no Barraca do Chico',
          time: '19:00 - 21:00',
          description: 'Ambiente descontraído com música ao vivo',
          location: 'Praia do Futuro',
          category: 'food' as const,
          icon: '🎵',
        },
        {
          id: 6,
          name: 'Caminhada noturna na orla',
          time: '21:30 - 22:30',
          description: 'Conhecer a vida noturna da orla',
          location: 'Beira Mar',
          category: 'culture' as const,
          icon: '🌙',
        },
      ],
    },
    {
      day: 2,
      date: 'ter 16/03',
      activities: [
        {
          id: 7,
          name: 'Café da manhã no hotel',
          time: '07:30 - 08:30',
          description: 'Buffet completo com tapioca e frutas',
          location: 'Hotel Praia Mar',
          category: 'food' as const,
          icon: '☕',
        },
        {
          id: 8,
          name: 'Centro Dragão do Mar',
          time: '09:00 - 12:00',
          description: 'Museu de Arte Contemporânea e Planetário',
          location: 'Praia de Iracema',
          category: 'culture' as const,
          icon: '🎭',
        },
        {
          id: 9,
          name: 'Almoço na Varjota',
          time: '12:30 - 14:00',
          description: 'Restaurantes variados na região boêmia',
          location: 'Varjota, Fortaleza',
          category: 'food' as const,
          icon: '🍴',
        },
        {
          id: 10,
          name: 'Mercado Central',
          time: '14:30 - 17:00',
          description: 'Compras de artesanato e produtos locais',
          location: 'Centro, Fortaleza',
          category: 'culture' as const,
          icon: '🛍️',
        },
        {
          id: 11,
          name: 'Theatro José de Alencar',
          time: '17:30 - 19:00',
          description: 'Arquitetura art nouveau e jardins',
          location: 'Centro, Fortaleza',
          category: 'culture' as const,
          icon: '🏛️',
        },
        {
          id: 12,
          name: 'Jantar no Santa Grelha',
          time: '19:30 - 21:30',
          description: 'Churrascaria premium',
          location: 'Meireles, Fortaleza',
          category: 'food' as const,
          icon: '🥩',
        },
      ],
    },
    {
      day: 3,
      date: 'quar 17/03',
      activities: [
        {
          id: 13,
          name: 'Passeio de buggy em Cumbuco',
          time: '08:00 - 12:00',
          description: 'Dunas, lagoas e esquibunda',
          location: 'Cumbuco, CE',
          category: 'adventure' as const,
          icon: '🏎️',
        },
        {
          id: 14,
          name: 'Almoço em Cumbuco',
          time: '12:30 - 14:00',
          description: 'Barraca de praia com peixe frito',
          location: 'Praia de Cumbuco',
          category: 'food' as const,
          icon: '🐟',
        },
        {
          id: 15,
          name: 'Kitesurf (aula ou observação)',
          time: '14:30 - 16:30',
          description: 'Um dos melhores spots do Brasil',
          location: 'Cumbuco, CE',
          category: 'adventure' as const,
          icon: '🪁',
        },
        {
          id: 16,
          name: 'Lagoa do Parnamirim',
          time: '17:00 - 18:30',
          description: 'Água doce com vista das dunas',
          location: 'Cumbuco, CE',
          category: 'nature' as const,
          icon: '💧',
        },
        {
          id: 17,
          name: 'Check-out Hotel Praia Mar',
          time: '11:00 - 12:00',
          description: 'Preparar bagagem e fazer check-out',
          location: 'Hotel Praia Mar',
          category: 'culture' as const,
          icon: '🧳',
        },
        {
          id: 18,
          name: 'Check-in Pousada Cumbuco',
          time: '14:00 - 14:30',
          description: 'Instalação na nova hospedagem',
          location: 'Pousada Cumbuco',
          category: 'culture' as const,
          icon: '🏨',
        },
      ],
    },
    {
      day: 4,
      date: 'qui 18/03',
      activities: [
        {
          id: 19,
          name: 'Praia de Jericoacoara',
          time: '06:00 - 10:00',
          description: 'Transfer matinal para Jeri (4h de viagem)',
          location: 'Jijoca de Jericoacoara',
          category: 'nature' as const,
          icon: '🚐',
        },
        {
          id: 20,
          name: 'Café da manhã em Jeri',
          time: '10:30 - 11:30',
          description: 'Restaurante na vila',
          location: 'Centro de Jericoacoara',
          category: 'food' as const,
          icon: '🥐',
        },
        {
          id: 21,
          name: 'Pedra Furada',
          time: '12:00 - 14:00',
          description: 'Cartão postal de Jericoacoara',
          location: 'Jericoacoara, CE',
          category: 'nature' as const,
          icon: '🪨',
        },
        {
          id: 22,
          name: 'Almoço no Bistrôgonoff',
          time: '14:30 - 16:00',
          description: 'Culinária variada em ambiente rústico',
          location: 'Jericoacoara, CE',
          category: 'food' as const,
          icon: '🍝',
        },
        {
          id: 23,
          name: 'Duna do Pôr do Sol',
          time: '17:00 - 18:30',
          description: 'Melhor pôr do sol do Brasil',
          location: 'Jericoacoara, CE',
          category: 'nature' as const,
          icon: '🌄',
        },
        {
          id: 24,
          name: 'Jantar e Forró',
          time: '20:00 - 23:00',
          description: 'Forró pé de serra na rua principal',
          location: 'Centro de Jericoacoara',
          category: 'culture' as const,
          icon: '💃',
        },
      ],
    },
    {
      day: 5,
      date: 'sex 19/03',
      activities: [
        {
          id: 25,
          name: 'Lagoa Azul',
          time: '08:00 - 11:00',
          description: 'Passeio de stand up paddle',
          location: 'Jericoacoara, CE',
          category: 'adventure' as const,
          icon: '🏄',
        },
        {
          id: 26,
          name: 'Lagoa do Paraíso',
          time: '11:30 - 15:00',
          description: 'Almoço e relaxamento nas redes',
          location: 'Jericoacoara, CE',
          category: 'nature' as const,
          icon: '🌴',
        },
        {
          id: 27,
          name: 'Retorno a Fortaleza',
          time: '15:30 - 19:30',
          description: 'Transfer de volta',
          location: 'Estrada',
          category: 'culture' as const,
          icon: '🚗',
        },
        {
          id: 28,
          name: 'Jantar no Coco Bambu',
          time: '20:00 - 22:00',
          description: 'Restaurante famoso de Fortaleza',
          location: 'Meireles, Fortaleza',
          category: 'food' as const,
          icon: '🦐',
        },
        {
          id: 29,
          name: 'Drinks na Praia de Iracema',
          time: '22:30 - 00:00',
          description: 'Bares e música ao vivo',
          location: 'Praia de Iracema',
          category: 'culture' as const,
          icon: '🍹',
        },
        {
          id: 30,
          name: 'Descanso no hotel',
          time: '00:30 - 07:00',
          description: 'Recuperar energias',
          location: 'Pousada Cumbuco',
          category: 'culture' as const,
          icon: '😴',
        },
      ],
    },
    {
      day: 6,
      date: 'sáb 20/03',
      activities: [
        {
          id: 31,
          name: 'Praia do Futuro',
          time: '09:00 - 12:00',
          description: 'Praia famosa com barracas estruturadas',
          location: 'Fortaleza, CE',
          category: 'nature' as const,
          icon: '⛱️',
        },
        {
          id: 32,
          name: 'Almoço no Crocobeach',
          time: '12:30 - 14:30',
          description: 'Barraca tradicional com caranguejo',
          location: 'Praia do Futuro',
          category: 'food' as const,
          icon: '🦀',
        },
        {
          id: 33,
          name: 'Parque Ecológico do Cocó',
          time: '15:00 - 17:00',
          description: 'Trilhas e observação de aves',
          location: 'Fortaleza, CE',
          category: 'nature' as const,
          icon: '🦜',
        },
        {
          id: 34,
          name: 'Shopping Iguatemi',
          time: '17:30 - 19:00',
          description: 'Compras e ar condicionado',
          location: 'Água Fria, Fortaleza',
          category: 'culture' as const,
          icon: '🛒',
        },
        {
          id: 35,
          name: 'Jantar no Geppos',
          time: '19:30 - 21:00',
          description: 'Massas e ambiente familiar',
          location: 'Aldeota, Fortaleza',
          category: 'food' as const,
          icon: '🍕',
        },
        {
          id: 36,
          name: 'Cinema',
          time: '21:30 - 00:00',
          description: 'Sessão de cinema no shopping',
          location: 'Iguatemi, Fortaleza',
          category: 'culture' as const,
          icon: '🎬',
        },
      ],
    },
    {
      day: 7,
      date: 'dom 21/03',
      activities: [
        {
          id: 37,
          name: 'Feira da Beira Mar',
          time: '08:00 - 11:00',
          description: 'Artesanato local aos domingos',
          location: 'Av. Beira Mar',
          category: 'culture' as const,
          icon: '🎨',
        },
        {
          id: 38,
          name: 'Brunch no Café Viriato',
          time: '11:30 - 13:00',
          description: 'Café especial e brunch',
          location: 'Aldeota, Fortaleza',
          category: 'food' as const,
          icon: '🥞',
        },
        {
          id: 39,
          name: 'Museu do Ceará',
          time: '13:30 - 15:30',
          description: 'História e cultura cearense',
          location: 'Centro, Fortaleza',
          category: 'culture' as const,
          icon: '🏺',
        },
        {
          id: 40,
          name: 'Catedral Metropolitana',
          time: '16:00 - 17:00',
          description: 'Uma das maiores igrejas do Brasil',
          location: 'Centro, Fortaleza',
          category: 'culture' as const,
          icon: '⛪',
        },
        {
          id: 41,
          name: 'Passeio na Ponte dos Ingleses',
          time: '17:30 - 18:30',
          description: 'Pôr do sol e fotos',
          location: 'Praia de Iracema',
          category: 'nature' as const,
          icon: '🌉',
        },
        {
          id: 42,
          name: 'Jantar de despedida',
          time: '19:00 - 21:00',
          description: 'Última refeição em Fortaleza',
          location: 'Varjota, Fortaleza',
          category: 'food' as const,
          icon: '🍷',
        },
      ],
    },
  ],
};

const CATEGORY_COLORS = {
  nature: '#68c7d1',
  culture: '#1238b4',
  food: '#ff6a32',
  adventure: '#68c7d1',
};

export default function ItineraryDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [selectedDay, setSelectedDay] = useState(1);
  const [activeTab, setActiveTab] = useState<'general' | 'itinerary' | 'explore'>('general');
  const [accommodationQuery, setAccommodationQuery] = useState('');

  const itinerary = DUMMY_ITINERARY;
  const currentDayData = itinerary.days.find(d => d.day === selectedDay);

  return (
    <SafeAreaView className="flex-1 bg-secondary">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Image */}
        <View className="relative h-48 bg-primary/5">
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800' }}
            className="w-full h-full"
            resizeMode="cover"
          />
          
          {/* Back Button */}
          <TouchableOpacity 
            onPress={() => router.back()}
            className="absolute top-4 left-4 w-10 h-10 rounded-full bg-white/95 items-center justify-center shadow-md"
          >
            <Ionicons name="arrow-back" size={22} color="#1238b4" />
          </TouchableOpacity>

          {/* Share Button */}
          <TouchableOpacity 
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/95 items-center justify-center shadow-md"
          >
            <Ionicons name="share-outline" size={22} color="#1238b4" />
          </TouchableOpacity>
        </View>

        {/* Info Card Overlay */}
        <View className="px-6 -mt-8">
          <View className="bg-white rounded-card p-5 shadow-card">
            <Text className="text-h1 text-primary font-bold mb-2">
              {itinerary.name}
            </Text>
            <Text className="text-small text-primary/70 mb-3 leading-5">
              Roteiro completo com praias, cultura e gastronomia local
            </Text>
            <View className="flex-row items-center justify-between">
              <View className="bg-primary/10 px-3 py-1.5 rounded-full flex-row items-center">
                <Ionicons name="calendar-outline" size={14} color="#1238b4" />
                <Text className="text-tiny text-primary font-semibold ml-1.5">
                  {itinerary.startDate}
                </Text>
              </View>
              <Ionicons name="arrow-forward" size={14} color="#1238b486" />
              <View className="bg-primary/10 px-3 py-1.5 rounded-full flex-row items-center">
                <Ionicons name="calendar-outline" size={14} color="#1238b4" />
                <Text className="text-tiny text-primary font-semibold ml-1.5">
                  {itinerary.endDate}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Tabs */}
        <View className="px-6 pt-4">
          <View className="flex-row bg-white rounded-button p-1 shadow-sm mb-4">
            <TouchableOpacity
              onPress={() => setActiveTab('general')}
              className={`flex-1 py-3 rounded-button items-center ${
                activeTab === 'general' ? 'bg-primary' : ''
              }`}
            >
              <Text className={`text-small font-semibold ${
                activeTab === 'general' ? 'text-white' : 'text-primary/60'
              }`}>
                Geral
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setActiveTab('itinerary')}
              className={`flex-1 py-3 rounded-button items-center ${
                activeTab === 'itinerary' ? 'bg-primary' : ''
              }`}
            >
              <Text className={`text-small font-semibold ${
                activeTab === 'itinerary' ? 'text-white' : 'text-primary/60'
              }`}>
                Itinerário
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setActiveTab('explore')}
              className={`flex-1 py-3 rounded-button items-center ${
                activeTab === 'explore' ? 'bg-primary' : ''
              }`}
            >
              <Text className={`text-small font-semibold ${
                activeTab === 'explore' ? 'text-white' : 'text-primary/60'
              }`}>
                Explorar
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Content */}
        <View className="px-6 pb-6">
          {/* TAB: GERAL */}
          {activeTab === 'general' && (
            <>
              {/* Hospedagem Section */}
              <View className="mb-6">
                <View className="flex-row items-center justify-between mb-3">
                  <Text className="text-h3 text-primary font-bold">Hospedagem</Text>
                  <TouchableOpacity 
                    className="flex-row items-center"
                    onPress={() => console.log('Adicionar hospedagem')}
                  >
                    <Ionicons name="add-circle-outline" size={20} color="#1238b4" />
                    <Text className="text-small text-primary font-semibold ml-1">
                      Adicionar
                    </Text>
                  </TouchableOpacity>
                </View>
                
                {itinerary.accommodations && itinerary.accommodations.length > 0 ? (
                  <View className="gap-3">
                    {itinerary.accommodations.map((accommodation) => (
                      <View key={accommodation.id} className="bg-white rounded-card p-4 shadow-card">
                        {/* Header com nome e botão remover */}
                        <View className="flex-row items-start justify-between mb-3">
                          <View className="flex-row items-start flex-1">
                            <View className="w-12 h-12 rounded-lg bg-primary/10 items-center justify-center mr-3">
                              <Ionicons name="bed-outline" size={24} color="#1238b4" />
                            </View>
                            <View className="flex-1">
                              <Text className="text-body text-primary font-bold mb-1">
                                {accommodation.name}
                              </Text>
                              <Text className="text-small text-primary/60">
                                {accommodation.address}
                              </Text>
                            </View>
                          </View>
                          <TouchableOpacity 
                            onPress={() => console.log('Remover', accommodation.id)}
                            className="w-8 h-8 items-center justify-center"
                          >
                            <Ionicons name="close-circle" size={24} color="#ff6a32" />
                          </TouchableOpacity>
                        </View>

                        {/* Dias */}
                        <View className="bg-cyan/10 px-3 py-2 rounded-lg mb-3">
                          <Text className="text-cyan font-bold text-center text-small">
                            Dia {accommodation.startDay} - {accommodation.endDay}
                          </Text>
                        </View>

                        {/* Check-in e Check-out */}
                        <View className="flex-row gap-2">
                          <View className="flex-1 border-l-4 border-cyan pl-3 py-2">
                            <Text className="text-tiny text-cyan font-bold mb-1">Check-in</Text>
                            <Text className="text-small text-cyan font-semibold">
                              {accommodation.checkIn}
                            </Text>
                          </View>
                          <View className="flex-1 border-l-4 border-orange pl-3 py-2">
                            <Text className="text-tiny text-orange font-bold mb-1">Check-out</Text>
                            <Text className="text-small text-orange font-semibold">
                              {accommodation.checkOut}
                            </Text>
                          </View>
                        </View>
                      </View>
                    ))}
                  </View>
                ) : (
                  <View className="bg-white rounded-card p-4 shadow-card mb-3">
                    <View className="items-center py-4">
                      <Ionicons name="home-outline" size={40} color="#1238b440" />
                      <Text className="text-small text-primary/60 mt-2 mb-3">
                        Aonde você vai ficar?
                      </Text>
                      <TextInput
                        placeholder="Digite o nome do local"
                        placeholderTextColor="#1238b460"
                        value={accommodationQuery}
                        onChangeText={setAccommodationQuery}
                        className="w-full bg-secondary rounded-input px-4 py-3 text-body text-primary mb-3"
                      />
                      <TouchableOpacity className="w-full bg-primary rounded-button py-3">
                        <Text className="text-white text-body font-semibold text-center">
                          Adicionar hospedagem
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>
            </>
          )}

          {/* TAB: ITINERÁRIO */}
          {activeTab === 'itinerary' && (
            <>
              {/* Day Selector */}
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                className="mb-4"
                contentContainerStyle={{ gap: 12 }}
              >
                {itinerary.days.map((dayData) => (
                  <TouchableOpacity
                    key={dayData.day}
                    onPress={() => setSelectedDay(dayData.day)}
                    className={`px-5 py-3 rounded-button min-w-[100px] items-center ${
                      selectedDay === dayData.day
                        ? 'bg-primary shadow-md'
                        : 'bg-white shadow-sm'
                    }`}
                  >
                    <Text className={`text-body font-bold ${
                      selectedDay === dayData.day ? 'text-white' : 'text-primary'
                    }`}>
                      Dia {dayData.day}
                    </Text>
                    <Text className={`text-tiny mt-1 ${
                      selectedDay === dayData.day ? 'text-white/80' : 'text-primary/60'
                    }`}>
                      {dayData.date}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Activities */}
              {currentDayData?.activities.map((activity, index) => (
                <View key={activity.id} className="mb-4">
                  <View className="flex-row">
                    <View className="items-center mr-4">
                      <View 
                        className="w-12 h-12 rounded-full items-center justify-center"
                        style={{ backgroundColor: CATEGORY_COLORS[activity.category] + '20' }}
                      >
                        <Text className="text-xl">{activity.icon}</Text>
                      </View>
                      {index < currentDayData.activities.length - 1 && (
                        <View 
                          className="w-0.5 flex-1 my-2"
                          style={{ backgroundColor: CATEGORY_COLORS[activity.category] + '40' }}
                        />
                      )}
                    </View>

                    <Pressable className="flex-1 bg-white rounded-card p-4 shadow-card active:scale-[0.98]">
                      <View className="flex-row items-start justify-between mb-2">
                        <Text className="text-h3 text-primary font-bold flex-1 mr-2">
                          {activity.name}
                        </Text>
                        <View 
                          className="px-2 py-1 rounded-full"
                          style={{ backgroundColor: CATEGORY_COLORS[activity.category] + '20' }}
                        >
                          <Text 
                            className="text-tiny font-semibold"
                            style={{ color: CATEGORY_COLORS[activity.category] }}
                          >
                            {activity.time}
                          </Text>
                        </View>
                      </View>

                      <Text className="text-small text-primary/70 mb-3">
                        {activity.description}
                      </Text>

                      <View className="flex-row items-center">
                        <Ionicons name="location-outline" size={16} color="#1238b4" />
                        <Text className="text-tiny text-primary/60 ml-1">
                          {activity.location}
                        </Text>
                      </View>
                    </Pressable>
                  </View>
                </View>
              ))}
            </>
          )}

          {/* TAB: EXPLORAR */}
          {activeTab === 'explore' && (
            <View className="items-center justify-center py-16">
              <Ionicons name="compass-outline" size={64} color="#1238b440" />
              <Text className="text-body text-primary/60 mt-4">
                Explore pontos turísticos próximos
              </Text>
              <Text className="text-small text-primary/40 mt-2 text-center px-8">
                Em breve você poderá descobrir novos lugares para adicionar ao seu roteiro
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}