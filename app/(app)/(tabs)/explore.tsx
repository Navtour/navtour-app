import { ModalBottomSheet } from '@/components/ui/bottomSheet';
import { Checkbox } from '@/components/ui/checkbox';
import { Icon } from '@/components/ui/icon';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ChevronDown, ChevronUp, X } from 'lucide-react-native';
import { useState } from 'react';
import { Dimensions, FlatList, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// @TODO: Por default deve ter o filtro atreladoa  localização atual
// @TODO: Implementar a lógica de filtragem e busca

export default function ExploreScreen() {
  const router = useRouter();
  const [destinosChecked, setDestinosChecked] = useState(true);
  const [atividadesChecked, setAtividadesChecked] = useState(false);
  const [isFilterModalVisible, setisFilterModalVisible] = useState(false);
  const [isSearchModalVisible, setisSearchModalVisible] = useState(false);
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [showFiltros, setShowFiltros] = useState(true);
  const SCREEN_WIDTH = Dimensions.get('window').width;
  const ITEM_MARGIN = 12;
  const ITEM_WIDTH = (SCREEN_WIDTH - 32 - ITEM_MARGIN) / 2;

  const keywordsList = [
    { id: 1, name: 'Praia', type: 1 },
    { id: 2, name: 'Lagoa', type: 1 },
    { id: 3, name: 'Rio', type: 1 },
    { id: 4, name: 'Gruta', type: 1 },
    { id: 5, name: 'Caverna', type: 1 },
    { id: 6, name: 'Reservas Ambientais', type: 1 },
    { id: 7, name: 'Montanha', type: 1 },
    { id: 8, name: 'Cachoeira', type: 1 },
    { id: 9, name: 'Duna', type: 1 },
    { id: 10, name: 'Trilhas', type: 2 },
    { id: 11, name: 'Mergulho', type: 2 },
    { id: 12, name: '4x4', type: 2 },
    { id: 13, name: 'Barco', type: 2 },
    { id: 14, name: 'Parapente', type: 2 },
    { id: 15, name: 'Surf', type: 2 },
    { id: 16, name: 'Kart', type: 2 },
    { id: 17, name: 'Kitesurf', type: 2 },
    { id: 18, name: 'stand up paddle', type: 2 },
    { id: 19, name: 'Gastronomia', type: 3 },
  ];

  const destinationList = [
    { id: 1, name: 'Praia do Cumbuco', image: '🏖️', type: 1 },
    { id: 2, name: 'Dunas da Sabiaguaba', image: '🏝️', type: 1 },
    { id: 3, name: 'Autodromo do Eusébio', image: '🏎️', type: 2 },
    { id: 4, name: 'Vasto Restaurante', image: '🍽️', type: 3 },
    { id: 5, name: 'Beach Park', image: '🏖️', type: 2 },
    { id: 6, name: 'Mezzi Restaurante', image: '🍽️', type: 1 },
    { id: 7, name: 'Praia do Cumbuco', image: '🏖️', type: 1 },
    { id: 8, name: 'Dunas da Sabiaguaba', image: '🏝️', type: 1 },
    { id: 9, name: 'Autodromo do Eusébio', image: '🏎️', type: 2 },
    { id: 10, name: 'Vasto Restaurante', image: '🍽️', type: 3 },
    { id: 11, name: 'Beach Park', image: '🏖️', type: 2 },
    { id: 12, name: 'Mezzi Restaurante', image: '🍽️', type: 1 },
  ];

  const toggleKeyword = (keyword: string) => {
    setSelectedKeywords((prev) =>
      prev.includes(keyword)
        ? prev.filter((item) => item !== keyword)
        : [...prev, keyword]
    );
  };

  const renderKeywordButton = (item: { id: number; name: string }) => {
    const selected = selectedKeywords.includes(item.name);
    return (
      <TouchableOpacity
        key={item.id}
        onPress={() => toggleKeyword(item.name)}
        className={`px-4 py-2 mb-4 mr-2 ml-2 ${selected ? 'bg-primary' : 'bg-white'
          }`}
      >
        <Text className={`text-h3 ${selected ? 'text-white font-bold' : 'text-gray-700'}`}>
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-secondary px-4 pt-8">
      <View className="flex-row items-center bg-white rounded-input px-4 shadow-card">
        <Ionicons name="search" size={20} color="#1238b4" />

        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => router.push('/explore-search')}
          className="flex-1 ml-3"
        >
          <TextInput
            placeholder="Buscar destino"
            placeholderTextColor="#1238b480"
            editable={false}
            pointerEvents="none"
            className="text-body text-primary"
          />
        </TouchableOpacity>
      </View>

      <ModalBottomSheet
        visible={isSearchModalVisible}
        onClose={() => setisSearchModalVisible(false)}
        rounded={false}
        heightRatio={1}
      >
        <View className="flex-1">
          <View className="flex-row items-center bg-white rounded-input px-4 shadow-card">
            <Ionicons
              name="search" size={20}
              color="#1238b4"
            />
            <TextInput
              placeholder="Buscar destino"
              placeholderTextColor="#1238b480"
              className="flex-1 ml-3 text-body text-primary"
            />
          </View>
        </View>
      </ModalBottomSheet>

      <TouchableOpacity
        className="bg-primary rounded-button py-2 mt-4 shadow-md active:bg-primary/90"
        onPress={() => setisFilterModalVisible(true)}
      >
        <Text className="text-secondary font-bold text-center text-body">Aplicar filtragem</Text>
      </TouchableOpacity>

      <ModalBottomSheet
        visible={isFilterModalVisible}
        onClose={() => setisFilterModalVisible(false)}
        rounded={true}
        heightRatio={0.7}
      >
        <View className="flex-1">
          <ScrollView
            contentContainerStyle={{ paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
          >
            <Text className="text-h3 font-bold mb-2">Gastronomia</Text>
            <View className="flex-row flex-wrap mb-4">
              {keywordsList
                .filter((k) => k.type === 3)
                .map((item) => renderKeywordButton(item))}
            </View>

            <Text className="text-h3 font-bold mb-2">Natureza</Text>
            <View className="flex-row flex-wrap mb-4">
              {keywordsList
                .filter((k) => k.type === 1)
                .map((item) => renderKeywordButton(item))}
            </View>

            <Text className="text-h3 font-bold mb-2">Aventura e Esportes</Text>
            <View className="flex-row flex-wrap">
              {keywordsList
                .filter((k) => k.type === 2)
                .map((item) => renderKeywordButton(item))}
            </View>
          </ScrollView>

          <View className="absolute bottom-4 w-full items-center">
            <TouchableOpacity
              className="bg-primary rounded-button py-2 px-8 shadow-md active:bg-primary/90"
              onPress={() => setisFilterModalVisible(false)}
            >
              <Text className="text-secondary font-bold text-center text-body">
                Aplicar filtros
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ModalBottomSheet>


      <View className="flex-row w-full mt-4 justify-between">
        <TouchableOpacity className="bg-primary rounded-button py-2 shadow-md w-[49%] active:bg-primary/90">
          <Text className="text-secondary font-bold text-center text-body">Aberto</Text>
        </TouchableOpacity>

        <TouchableOpacity className="bg-primary rounded-button py-2 shadow-md w-[49%] active:bg-primary/90">
          <Text className="text-secondary font-bold text-center text-body">Próximos</Text>
        </TouchableOpacity>
      </View>

      {selectedKeywords.length > 0 && (
        <View className="bg-white rounded-lg p-4 mt-4">
          <View className="flex-row justify-between items-center">
            <Text className="text-h3 font-bold">Filtros aplicados</Text>
            <TouchableOpacity onPress={() => setShowFiltros(!showFiltros)}>
              <Icon
                as={showFiltros ? ChevronUp : ChevronDown}
                size={30}
                strokeWidth={2.5}
                className="text-primary"
              />
            </TouchableOpacity>
          </View>

          {showFiltros && (
            <View className="flex-row flex-wrap mt-2">
              {selectedKeywords.map((keyword) => (
                <TouchableOpacity
                  key={keyword}
                  onPress={() => toggleKeyword(keyword)}
                  className="flex-row items-center px-3 py-1 mr-4 mb-4 bg-primary/10"
                >
                  <Text className="text-primary mr-2">{keyword}</Text>
                  <Icon as={X} size={16} strokeWidth={2.5} className="text-primary" />
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      )}


      <SafeAreaView className="flex-1">
        <View className="w-full flex-1">
          <FlatList
            data={destinationList}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            showsVerticalScrollIndicator={true}
            columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: ITEM_MARGIN }}
            contentContainerStyle={{ paddingBottom: 100 }}
            renderItem={({ item }) => (
              <TouchableOpacity
                className="bg-white rounded-card shadow-card"
                onPress={() => router.push({
                  pathname: "/details",
                  params: { id: "123" }
                })}
                style={{ width: ITEM_WIDTH, height: ITEM_WIDTH }}
              >
                <View className="flex-1 bg-primary/10 rounded-t-card items-center justify-center">
                  <Text className="text-6xl">{item.image}</Text>
                </View>
                <View className="p-2">
                  <Text className="text-body text-primary font-bold text-center">
                    {item.name}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      </SafeAreaView>
    </SafeAreaView>
  );
}