import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/Button';

const SCREEN_WIDTH = Dimensions.get('window').width;

type TravelMood = {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
};

type ItineraryTemplate = {
  id: string;
  name: string;
  description: string;
  duration: string;
  highlights: string[];
  icon: string;
  isFeatured?: boolean;
};

const TRAVEL_MOODS: TravelMood[] = [
  { id: 'relaxing', name: 'Relaxante', icon: '🏖️', description: 'Descanso e tranquilidade', color: '#68c7d1' },
  { id: 'adventure', name: 'Aventura', icon: '🏔️', description: 'Adrenalina e emoção', color: '#ff6a32' },
  { id: 'cultural', name: 'Cultural', icon: '🏛️', description: 'História e conhecimento', color: '#1238b4' },
  { id: 'gastronomic', name: 'Gastronômico', icon: '🍽️', description: 'Sabores locais', color: '#ff6a32' },
  { id: 'romantic', name: 'Romântico', icon: '💑', description: 'Momentos a dois', color: '#1238b4' },
  { id: 'family', name: 'Família', icon: '👨‍👩‍👧‍👦', description: 'Para toda família', color: '#68c7d1' },
];

const ITINERARY_TEMPLATES: ItineraryTemplate[] = [
  {
    id: 'custom',
    name: 'Roteiro Personalizado',
    description: 'Crie seu próprio roteiro do zero com base em suas preferências',
    duration: 'Flexível',
    highlights: ['Total controle', 'IA assistente', 'Sugestões personalizadas'],
    icon: '✨',
    isFeatured: true,
  },
  {
    id: 'beach-lover',
    name: 'Praias Paradisíacas',
    description: 'Tour pelas melhores praias da região',
    duration: '5-7 dias',
    highlights: ['Praias selvagens', 'Águas cristalinas', 'Pôr do sol'],
    icon: '🌊',
  },
  {
    id: 'culture-immersion',
    name: 'Imersão Cultural',
    description: 'Conheça a história e tradições locais',
    duration: '3-5 dias',
    highlights: ['Museus', 'Centros históricos', 'Artesanato'],
    icon: '🎭',
  },
  {
    id: 'gastro-tour',
    name: 'Tour Gastronômico',
    description: 'Saboreie a culinária típica da região',
    duration: '4-6 dias',
    highlights: ['Restaurantes locais', 'Feiras', 'Aulas de culinária'],
    icon: '🍴',
  },
  {
    id: 'adventure-pack',
    name: 'Pacote Aventura',
    description: 'Experiências radicais e natureza',
    duration: '5-7 dias',
    highlights: ['Trilhas', 'Esportes', 'Ecoturismo'],
    icon: '🎢',
  },
  {
    id: 'weekend-express',
    name: 'Final de Semana Express',
    description: 'Roteiro compacto para 2-3 dias',
    duration: '2-3 dias',
    highlights: ['Principais pontos', 'Otimizado', 'Rápido'],
    icon: '⚡',
  },
];

export default function CreateItineraryStep2() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [selectedMoods, setSelectedMoods] = useState<string[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('custom');

  const toggleMood = (moodId: string) => {
    setSelectedMoods(prev =>
      prev.includes(moodId)
        ? prev.filter(id => id !== moodId)
        : [...prev, moodId]
    );
  };

  const handleNext = () => {
    if (selectedMoods.length === 0) return;

    router.push({
      pathname: '/itinerary/create/step-3',
      params: {
        step1Data: params.step1Data,
        step2Data: JSON.stringify({
          moods: selectedMoods,
          template: selectedTemplate,
        })
      }
    });
  };

  return (
    <>
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        <View className="px-6 py-6 gap-6">
          <View>
            <Text className="text-h2 text-primary font-bold">Estilo da viagem</Text>
            <Text className="text-primary/70 mt-1">Escolha o mood e o tipo de roteiro ideal</Text>
          </View>

          <View className="gap-3">
            <Text className="text-primary font-bold">Como você quer que seja sua viagem? *</Text>
            <Text className="text-primary/70 text-sm">Selecione um ou mais estilos</Text>
            
            <View className="flex-row flex-wrap gap-3">
              {TRAVEL_MOODS.map((mood) => (
                <TouchableOpacity
                  key={mood.id}
                  onPress={() => toggleMood(mood.id)}
                  className={`flex-row items-center gap-2 px-4 py-3 rounded-xl border-2 ${
                    selectedMoods.includes(mood.id)
                      ? 'bg-primary border-primary'
                      : 'bg-white border-primary/20'
                  }`}
                  style={{ width: (SCREEN_WIDTH - 60) / 2 }}
                >
                  <Text className="text-2xl">{mood.icon}</Text>
                  <View className="flex-1">
                    <Text className={`font-bold text-sm ${
                      selectedMoods.includes(mood.id) ? 'text-secondary' : 'text-primary'
                    }`}>
                      {mood.name}
                    </Text>
                    <Text className={`text-xs ${
                      selectedMoods.includes(mood.id) ? 'text-secondary/80' : 'text-primary/60'
                    }`}>
                      {mood.description}
                    </Text>
                  </View>
                  {selectedMoods.includes(mood.id) && (
                    <Ionicons name="checkmark-circle" size={20} color="#fff5dc" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View className="gap-3">
            <Text className="text-primary font-bold">Escolha um modelo de roteiro</Text>
            
            {ITINERARY_TEMPLATES.filter(t => t.isFeatured).map((template) => (
              <TouchableOpacity
                key={template.id}
                onPress={() => setSelectedTemplate(template.id)}
                className={`p-5 rounded-xl border-2 ${
                  selectedTemplate === template.id
                    ? 'bg-gradient-to-r from-primary/10 to-primary/5 border-primary'
                    : 'bg-white border-primary/20'
                }`}
              >
                <View className="flex-row items-start gap-3 mb-3">
                  <View className="w-14 h-14 rounded-full bg-primary/10 items-center justify-center">
                    <Text className="text-3xl">{template.icon}</Text>
                  </View>
                  <View className="flex-1">
                    <View className="flex-row items-center gap-2">
                      <Text className="text-primary font-bold text-base">{template.name}</Text>
                      <View className="bg-primary px-2 py-0.5 rounded-full">
                        <Text className="text-secondary text-xs font-semibold">Destaque</Text>
                      </View>
                    </View>
                    <Text className="text-primary/70 text-sm mt-1">{template.description}</Text>
                  </View>
                  {selectedTemplate === template.id && (
                    <Ionicons name="checkmark-circle" size={24} color="#1238b4" />
                  )}
                </View>
                <View className="flex-row items-center gap-2 flex-wrap">
                  <View className="bg-primary/10 px-3 py-1 rounded-full">
                    <Text className="text-primary text-xs font-medium">{template.duration}</Text>
                  </View>
                  {template.highlights.map((highlight, idx) => (
                    <View key={idx} className="bg-primary/5 px-3 py-1 rounded-full">
                      <Text className="text-primary/70 text-xs">{highlight}</Text>
                    </View>
                  ))}
                </View>
              </TouchableOpacity>
            ))}

            <View className="gap-3">
              {ITINERARY_TEMPLATES.filter(t => !t.isFeatured).map((template) => (
                <TouchableOpacity
                  key={template.id}
                  onPress={() => setSelectedTemplate(template.id)}
                  className={`p-4 rounded-xl border-2 flex-row items-center gap-3 ${
                    selectedTemplate === template.id
                      ? 'bg-primary/5 border-primary'
                      : 'bg-white border-primary/20'
                  }`}
                >
                  <View className="w-12 h-12 rounded-full bg-primary/10 items-center justify-center">
                    <Text className="text-2xl">{template.icon}</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-primary font-bold">{template.name}</Text>
                    <Text className="text-primary/70 text-xs mt-0.5">{template.description}</Text>
                    <View className="flex-row gap-2 mt-2">
                      <View className="bg-primary/10 px-2 py-0.5 rounded-full">
                        <Text className="text-primary text-xs">{template.duration}</Text>
                      </View>
                    </View>
                  </View>
                  {selectedTemplate === template.id && (
                    <Ionicons name="checkmark-circle" size={24} color="#1238b4" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      <View className="px-6 pb-6 pt-3 bg-secondary border-t border-primary/10">
        <Button
          onPress={handleNext}
          disabled={selectedMoods.length === 0}
          className="bg-primary h-12"
        >
          <Text className="text-secondary font-semibold text-base">Continuar</Text>
        </Button>
      </View>
    </>
  );
}