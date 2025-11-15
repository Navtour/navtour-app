import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, Pressable, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Text } from '@/components/ui/text';

type Itinerary = {
  id: number;
  name: string;
  description: string;
  image: string;
  createdAt: Date;
  lastModified: Date;
};

const DUMMY_ACTIVE: Itinerary[] = [
  {
    id: 1,
    name: 'Ceará Completo - 7 dias',
    description: 'Roteiro com praias, cultura e gastronomia local',
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400',
    createdAt: new Date('2025-10-20'),
    lastModified: new Date('2025-10-27'),
  },
  {
    id: 2,
    name: 'Fortaleza Cultural',
    description: 'Imersão na cultura e história da capital',
    image: 'https://images.unsplash.com/photo-1516738901171-8eb4fc13bd20?w=400',
    createdAt: new Date('2025-10-15'),
    lastModified: new Date('2025-10-26'),
  },
  {
    id: 3,
    name: 'Rota das Praias',
    description: 'As melhores praias do litoral cearense',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400',
    createdAt: new Date('2025-10-10'),
    lastModified: new Date('2025-10-25'),
  },
];

const DUMMY_ARCHIVED: Itinerary[] = [
  {
    id: 4,
    name: 'Weekend Jericoacoara',
    description: 'Final de semana em Jeri',
    image: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=400',
    createdAt: new Date('2025-08-15'),
    lastModified: new Date('2025-08-20'),
  },
  {
    id: 5,
    name: 'Canoa Quebrada Express',
    description: 'Bate e volta para Canoa Quebrada',
    image: 'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=400',
    createdAt: new Date('2025-09-01'),
    lastModified: new Date('2025-09-03'),
  },
];

export default function ItinerariesScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'active' | 'archived'>('active');
  const [activeItineraries, setActiveItineraries] = useState(DUMMY_ACTIVE);
  const [archivedItineraries, setArchivedItineraries] = useState(DUMMY_ARCHIVED);

  const handleDelete = (id: number, isArchived: boolean) => {
    if (isArchived) {
      setArchivedItineraries(prev => prev.filter(item => item.id !== id));
    } else {
      setActiveItineraries(prev => prev.filter(item => item.id !== id));
    }
  };

  const handleRecover = (id: number) => {
    const itinerary = archivedItineraries.find(item => item.id === id);
    if (itinerary) {
      setArchivedItineraries(prev => prev.filter(item => item.id !== id));
      setActiveItineraries(prev => [...prev, { ...itinerary, lastModified: new Date() }]);
    }
  };

  const handleShare = (id: number) => {
    console.log('Compartilhar roteiro:', id);
  };

  return (
    <SafeAreaView className="flex-1 bg-secondary">
      {/* Tabs */}
      <View className="px-6 pt-4 pb-4">
        <View className="flex-row bg-white rounded-button p-1 shadow-sm">
          <TouchableOpacity
            onPress={() => setActiveTab('active')}
            className={`flex-1 py-3 rounded-button items-center ${
              activeTab === 'active' ? 'bg-primary' : ''
            }`}
          >
            <Text className={`text-body font-semibold ${
              activeTab === 'active' ? 'text-white' : 'text-primary/60'
            }`}>
              Ativos
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab('archived')}
            className={`flex-1 py-3 rounded-button items-center ${
              activeTab === 'archived' ? 'bg-primary' : ''
            }`}
          >
            <Text className={`text-body font-semibold ${
              activeTab === 'archived' ? 'text-white' : 'text-primary/60'
            }`}>
              Arquivados
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        <View className="px-6 pb-24">
          {/* Warning for Archived */}
          {activeTab === 'archived' && (
            <View className="bg-orange/10 border-l-4 border-orange rounded-lg p-4 mb-4">
              <View className="flex-row items-start gap-3">
                <Ionicons name="time-outline" size={22} color="#ff6a32" />
                <View className="flex-1">
                  <Text className="text-orange font-bold text-sm mb-1">Atenção</Text>
                  <Text className="text-orange/90 text-tiny">
                    Roteiros arquivados há mais de 60 dias sem alterações serão automaticamente deletados.
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Active Itineraries */}
          {activeTab === 'active' && (
            <>
              {activeItineraries.length === 0 ? (
                <View className="items-center justify-center py-16">
                  <Ionicons name="map-outline" size={64} color="#1238b440" />
                  <Text className="text-body text-primary/60 mt-4">Nenhum roteiro ativo</Text>
                </View>
              ) : (
                <View className="gap-4">
                  {activeItineraries.map((itinerary) => (
                    <Pressable 
                      key={itinerary.id} 
                      onPress={() => router.push(`/itinerary/${itinerary.id}` as any)}
                      className="bg-white rounded-card shadow-card overflow-hidden active:opacity-90"
                    >
                      {/* Image */}
                      <View className="h-40 bg-primary/5 relative">
                        <Image 
                          source={{ uri: itinerary.image }}
                          className="w-full h-full"
                          resizeMode="cover"
                        />
                      </View>

                      {/* Content */}
                      <View className="p-4">
                        <Text className="text-h3 text-primary font-bold mb-2">
                          {itinerary.name}
                        </Text>
                        <Text className="text-small text-primary/70 mb-4">
                          {itinerary.description}
                        </Text>

                        {/* Actions */}
                        <View className="flex-row gap-3">
                          <TouchableOpacity 
                            onPress={(e) => {
                              e.stopPropagation();
                              handleShare(itinerary.id);
                            }}
                            className="flex-1 flex-row items-center justify-center bg-cyan/10 py-3 rounded-button"
                          >
                            <Ionicons name="share-outline" size={18} color="#68c7d1" />
                            <Text className="text-small text-cyan font-semibold ml-2">
                              Compartilhar
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity 
                            onPress={(e) => {
                              e.stopPropagation();
                              handleDelete(itinerary.id, false);
                            }}
                            className="w-12 h-12 items-center justify-center bg-orange/10 rounded-button"
                          >
                            <Ionicons name="trash-outline" size={20} color="#ff6a32" />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </Pressable>
                  ))}
                </View>
              )}
            </>
          )}

          {/* Archived Itineraries */}
          {activeTab === 'archived' && (
            <>
              {archivedItineraries.length === 0 ? (
                <View className="items-center justify-center py-16">
                  <Ionicons name="archive-outline" size={64} color="#1238b440" />
                  <Text className="text-body text-primary/60 mt-4">Nenhum roteiro arquivado</Text>
                </View>
              ) : (
                <View className="gap-4">
                  {archivedItineraries.map((itinerary) => {
                    const daysSinceModified = Math.floor(
                      (new Date().getTime() - itinerary.lastModified.getTime()) / (1000 * 60 * 60 * 24)
                    );
                    const daysUntilDeletion = 60 - daysSinceModified;

                    return (
                      <Pressable 
                        key={itinerary.id}
                        onPress={() => router.push(`/itinerary/${itinerary.id}` as any)}
                        className="bg-white rounded-card shadow-card overflow-hidden opacity-75 active:opacity-60"
                      >
                        {/* Image with overlay */}
                        <View className="h-32 bg-primary/5 relative">
                          <Image 
                            source={{ uri: itinerary.image }}
                            className="w-full h-full"
                            resizeMode="cover"
                          />
                          <View className="absolute inset-0 bg-primary/20" />
                          <View className="absolute top-3 right-3 bg-orange/95 px-3 py-1.5 rounded-full">
                            <Text className="text-tiny text-white font-semibold">
                              {daysUntilDeletion}d restantes
                            </Text>
                          </View>
                        </View>

                        {/* Content */}
                        <View className="p-4">
                          <Text className="text-h3 text-primary font-bold mb-2">
                            {itinerary.name}
                          </Text>
                          <Text className="text-small text-primary/70 mb-4">
                            {itinerary.description}
                          </Text>

                          {/* Actions */}
                          <View className="flex-row gap-3">
                            <TouchableOpacity 
                              onPress={(e) => {
                                e.stopPropagation();
                                handleRecover(itinerary.id);
                              }}
                              className="flex-1 flex-row items-center justify-center bg-cyan/10 py-3 rounded-button"
                            >
                              <Ionicons name="arrow-undo-outline" size={18} color="#68c7d1" />
                              <Text className="text-small text-cyan font-semibold ml-2">
                                Recuperar
                              </Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                              onPress={(e) => {
                                e.stopPropagation();
                                handleDelete(itinerary.id, true);
                              }}
                              className="w-12 h-12 items-center justify-center bg-orange/10 rounded-button"
                            >
                              <Ionicons name="trash-outline" size={20} color="#ff6a32" />
                            </TouchableOpacity>
                          </View>
                        </View>
                      </Pressable>
                    );
                  })}
                </View>
              )}
            </>
          )}
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <View className="absolute bottom-6 right-6">
        <TouchableOpacity 
          className="w-14 h-14 rounded-full bg-primary items-center justify-center shadow-card-hover"
          style={{
            shadowColor: '#1238b4',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
          }}
        >
          <Ionicons name="add" size={28} color="white" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}