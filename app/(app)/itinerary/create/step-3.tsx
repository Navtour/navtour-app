import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Text } from '@/components/ui/text';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useItineraryForm } from '@/app/(app)/itinerary/create/FormContext';

type StyleData = {
  name: string;
  description: string;
  backgroundImage: string | null;
};

const DEFAULT_BACKGROUNDS = [
  { id: 'beach', uri: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400', name: 'Praia' },
  { id: 'mountain', uri: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400', name: 'Montanha' },
  { id: 'city', uri: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=400', name: 'Cidade' },
  { id: 'nature', uri: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400', name: 'Natureza' },
  { id: 'sunset', uri: 'https://images.unsplash.com/photo-1495567720989-cebdbdd97913?w=400', name: 'Pôr do sol' },
  { id: 'tropical', uri: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400', name: 'Tropical' },
];

export default function CreateItineraryStep3() {
  const router = useRouter();
  const { formData, updateStep3, getCompleteData, clearForm } = useItineraryForm();
  
  const [styleData, setStyleData] = useState<StyleData>({
    name: '',
    description: '',
    backgroundImage: DEFAULT_BACKGROUNDS[0].uri,
  });

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled) {
      setStyleData({ ...styleData, backgroundImage: result.assets[0].uri });
    }
  };

  const handleFinish = async () => {
    if (!styleData.name.trim()) return;

    updateStep3({
      name: styleData.name,
      description: styleData.description,
      backgroundImage: styleData.backgroundImage,
    });

    const completeData = getCompleteData();
    console.log('Itinerary Data:', {
      ...completeData,
      step3: {
        name: styleData.name,
        description: styleData.description,
        backgroundImage: styleData.backgroundImage,
      },
      createdAt: new Date().toISOString(),
    });
    
    clearForm();
    router.replace('/itinerary');
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <>
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        <View className="px-6 py-6 gap-6">
          <View>
            <Text className="text-h2 text-primary font-bold">Personalização</Text>
            <Text className="text-primary/70 mt-1">Dê identidade ao seu roteiro</Text>
          </View>

          {/* Background Preview */}
          <View className="gap-3">
            <Text className="text-primary font-bold">Imagem de capa</Text>
            <View className="relative">
              <View className="w-full h-48 rounded-xl overflow-hidden bg-primary/10 border-2 border-primary/20">
                {styleData.backgroundImage ? (
                  <Image
                    source={{ uri: styleData.backgroundImage }}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                ) : (
                  <View className="flex-1 items-center justify-center">
                    <Ionicons name="image-outline" size={48} color="#1238b4" />
                    <Text className="text-primary/50 mt-2">Selecione uma imagem</Text>
                  </View>
                )}
              </View>
              
              {styleData.name && (
                <View className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <Text className="text-white font-bold text-xl">{styleData.name}</Text>
                  {styleData.description && (
                    <Text className="text-white/90 text-sm mt-1" numberOfLines={2}>
                      {styleData.description}
                    </Text>
                  )}
                </View>
              )}
            </View>

            <View className="gap-2">
              <Text className="text-primary/70 text-sm">Escolha um plano de fundo</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} className="gap-2">
                <View className="flex-row gap-2">
                  {DEFAULT_BACKGROUNDS.map((bg) => (
                    <TouchableOpacity
                      key={bg.id}
                      onPress={() => setStyleData({ ...styleData, backgroundImage: bg.uri })}
                      className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                        styleData.backgroundImage === bg.uri ? 'border-primary' : 'border-primary/20'
                      }`}
                    >
                      <Image source={{ uri: bg.uri }} className="w-full h-full" resizeMode="cover" />
                    </TouchableOpacity>
                  ))}
                  
                  <TouchableOpacity
                    onPress={pickImage}
                    className="w-20 h-20 rounded-lg bg-white border-2 border-dashed border-primary items-center justify-center"
                  >
                    <Ionicons name="add" size={28} color="#1238b4" />
                    <Text className="text-primary text-xs mt-1">Sua foto</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </View>

          <View className="gap-2">
            <Text className="text-primary font-bold text-sm">Nome do roteiro *</Text>
            <Input
              value={styleData.name}
              onChangeText={(val) => setStyleData({ ...styleData, name: val })}
              placeholder="Ex: Férias de Verão 2025"
              maxLength={50}
              className="bg-white border-2 border-primary"
            />
            <Text className="text-primary/50 text-xs text-right">
              {styleData.name.length}/50
            </Text>
          </View>

          <View className="gap-2">
            <Text className="text-primary font-bold text-sm">Descrição (opcional)</Text>
            <View className="bg-white border-2 border-primary rounded-md">
              <Input
                value={styleData.description}
                onChangeText={(val) => setStyleData({ ...styleData, description: val })}
                placeholder="Conte um pouco sobre essa viagem..."
                multiline
                numberOfLines={4}
                maxLength={200}
                className="min-h-24 bg-transparent border-0"
                style={{ textAlignVertical: 'top' }}
              />
            </View>
            <Text className="text-primary/50 text-xs text-right">
              {styleData.description.length}/200
            </Text>
          </View>

          <View className="bg-blue-50 border-l-4 border-primary rounded-lg p-4 gap-2">
            <View className="flex-row items-center gap-2">
              <Ionicons name="bulb" size={20} color="#1238b4" />
              <Text className="text-primary font-bold">Dicas</Text>
            </View>
            <View className="gap-1">
              <Text className="text-primary/70 text-sm">• Use nomes descritivos e memoráveis</Text>
              <Text className="text-primary/70 text-sm">• A descrição ajuda a lembrar detalhes da viagem</Text>
              <Text className="text-primary/70 text-sm">• Você pode editar tudo depois</Text>
            </View>
          </View>

          {/* Summary Card */}
          <View className="bg-white rounded-xl p-4 border-2 border-primary/10 gap-3">
            <View className="flex-row items-center gap-2 pb-3 border-b border-primary/10">
              <Ionicons name="information-circle" size={24} color="#1238b4" />
              <Text className="text-primary font-bold">Resumo do Roteiro</Text>
            </View>
            
            {formData.step1 && (
              <View className="gap-3">
                <View className="gap-2">
                  <View className="flex-row items-center gap-2">
                    <Ionicons name="location" size={16} color="#1238b4" />
                    <Text className="text-primary/70 text-sm">
                      {formData.step1.city}, {formData.step1.state}
                    </Text>
                  </View>
                  <View className="flex-row items-center gap-2">
                    <Ionicons name="calendar" size={16} color="#1238b4" />
                    <Text className="text-primary/70 text-sm">
                      {formatDate(formData.step1.arrivalDate)} - {formatDate(formData.step1.departureDate)}
                    </Text>
                  </View>
                </View>

                {formData.step1.accommodations && formData.step1.accommodations.length > 0 && (
                  <View className="pt-2 border-t border-primary/10 gap-2">
                    <View className="flex-row items-center gap-2">
                      <Ionicons name="bed" size={16} color="#1238b4" />
                      <Text className="text-primary font-semibold text-sm">
                        {formData.step1.accommodations.length} {formData.step1.accommodations.length === 1 ? 'Hospedagem' : 'Hospedagens'}
                      </Text>
                    </View>
                    {formData.step1.accommodations.map((acc: any, idx: number) => (
                      <View key={acc.id} className="ml-6 pl-3 border-l-2 border-primary/20 gap-1">
                        <View className="flex-row items-center gap-2">
                          {acc.isRelativeHouse && (
                            <View className="bg-primary/10 px-2 py-0.5 rounded-full">
                              <Text className="text-primary text-xs">🏠 Casa</Text>
                            </View>
                          )}
                          <Text className="text-primary text-sm font-medium">
                            {acc.name || (acc.isRelativeHouse ? `Casa ${idx + 1}` : `Hospedagem ${idx + 1}`)}
                          </Text>
                        </View>
                        
                        {acc.address && (
                          <Text className="text-primary/60 text-xs">{acc.address}</Text>
                        )}
                        
                        <View className="flex-row items-center gap-3 mt-1 flex-wrap">
                          <View className="flex-row items-center gap-1">
                            <Ionicons name="log-in-outline" size={12} color="#68c7d1" />
                            <Text className="text-primary/60 text-xs">
                              {formatDate(acc.checkInDate)}
                              {acc.checkInTime && ` às ${acc.checkInTime}`}
                            </Text>
                          </View>
                          <View className="flex-row items-center gap-1">
                            <Ionicons name="log-out-outline" size={12} color="#ff6a32" />
                            <Text className="text-primary/60 text-xs">
                              {formatDate(acc.checkOutDate)}
                              {acc.checkOutTime && ` às ${acc.checkOutTime}`}
                            </Text>
                          </View>
                        </View>
                        
                        {(acc.instagram || acc.facebook) && (
                          <View className="flex-row items-center gap-2 mt-1">
                            {acc.instagram && (
                              <View className="flex-row items-center gap-1">
                                <Ionicons name="logo-instagram" size={10} color="#E4405F" />
                                <Text className="text-primary/60 text-xs">{acc.instagram}</Text>
                              </View>
                            )}
                            {acc.facebook && (
                              <View className="flex-row items-center gap-1">
                                <Ionicons name="logo-facebook" size={10} color="#1877F2" />
                                <Text className="text-primary/60 text-xs">{acc.facebook}</Text>
                              </View>
                            )}
                          </View>
                        )}
                      </View>
                    ))}
                  </View>
                )}
              </View>
            )}
            
            {formData.step2 && (
              <View className="gap-2 pt-2 border-t border-primary/10">
                <View className="flex-row items-center gap-2">
                  <Ionicons name="heart" size={16} color="#ff6a32" />
                  <Text className="text-primary font-semibold text-sm">Estilos selecionados</Text>
                </View>
                <View className="flex-row flex-wrap gap-2 ml-6">
                  {formData.step2.moods?.map((moodId: string) => {
                    const moodNames: { [key: string]: string } = {
                      relaxing: 'Relaxante 🏖️',
                      adventure: 'Aventura 🏔️',
                      cultural: 'Cultural 🏛️',
                      gastronomic: 'Gastronômico 🍽️',
                      romantic: 'Romântico 💑',
                      family: 'Família 👨‍👩‍👧‍👦',
                    };
                    return (
                      <View key={moodId} className="bg-primary/10 px-3 py-1 rounded-full">
                        <Text className="text-primary text-xs">{moodNames[moodId] || moodId}</Text>
                      </View>
                    );
                  })}
                </View>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      <View className="px-6 pb-6 pt-3 bg-secondary border-t border-primary/10 gap-2">
        <Button
          onPress={handleFinish}
          disabled={!styleData.name.trim()}
          className="bg-primary h-12"
        >
          <Text className="text-secondary font-semibold text-base">Criar Roteiro</Text>
        </Button>
        <Text className="text-primary/50 text-center text-xs">
          Você poderá adicionar atividades e editar tudo depois
        </Text>
      </View>
    </>
  );
}