import { Dimensions, FlatList, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function FavoritesScreen() {
  const SCREEN_WIDTH = Dimensions.get('window').width;
  const ITEM_MARGIN = 12;
  const ITEM_WIDTH = SCREEN_WIDTH - 32;

  const destinationList = [
    {
      id: 1,
      name: 'Praia do Cumbuco',
      description: 'Um dos destinos mais procurados do Ceará, ideal para esportes aquáticos.',
      image: '🏖️',
      status: 'Funcionando',
      payment: 'Pago',
    },
    {
      id: 2,
      name: 'Autódromo do Eusébio',
      description: 'Local de corridas e eventos automotivos com ótima estrutura.',
      image: '🏎️',
      status: 'Funcionando',
      payment: 'Pago',
    },
    {
      id: 3,
      name: 'Vasto Restaurante',
      description: 'Restaurante sofisticado com pratos contemporâneos e ambiente agradável.',
      image: '🍽️',
      status: 'Funcionando',
      payment: 'Pago',
    },
    {
      id: 4,
      name: 'Praia do Cumbuco',
      description: 'Um dos destinos mais procurados do Ceará, ideal para esportes aquáticos.',
      image: '🏖️',
      status: 'Funcionando',
      payment: 'Pago',
    },
    {
      id: 5,
      name: 'Autódromo do Eusébio',
      description: 'Local de corridas e eventos automotivos com ótima estrutura.',
      image: '🏎️',
      status: 'Funcionando',
      payment: 'Pago',
    },
    {
      id: 6,
      name: 'Vasto Restaurante',
      description: 'Restaurante sofisticado com pratos contemporâneos e ambiente agradável.',
      image: '🍽️',
      status: 'Funcionando',
      payment: 'Pago',
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-secondary pt-8">
      <View className="flex-row justify-center mb-6">
        <Text className="text-h2 color-primary">Favoritos</Text>
      </View>

      <View className="flex-1 px-4">
        <FlatList
          data={destinationList}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: ITEM_MARGIN }} />}
          contentContainerStyle={{ paddingBottom: 100 }}
          renderItem={({ item }) => (
            <View
              className="bg-white rounded-xl shadow-md p-3"
              style={{ width: ITEM_WIDTH, alignSelf: 'center' }}
            >
              <View className="flex-row justify-between">
                <View
                  className="bg-gray-200 rounded-lg items-center justify-center"
                  style={{ width: '49%' }}
                >
                  <Text className="text-7xl">{item.image}</Text>
                </View>

                <View
                  className="justify-between"
                  style={{ width: '49%' }}
                >
                  <View>
                    <Text className="text-lg font-bold text-black mb-1">
                      {item.name}
                    </Text>
                    <Text className="text-gray-500 text-sm" numberOfLines={3}>
                      {item.description}
                    </Text>
                  </View>

                  <View className="flex-row justify-between mt-2">
                    <Text className="text-green-600 font-semibold text-sm">
                      {item.status}
                    </Text>
                    <Text className="text-gray-700 font-semibold text-sm">
                      {item.payment}
                    </Text>
                  </View>
                </View>
              </View>

              <View className="flex-row justify-between mt-3">
                <TouchableOpacity
                  className="bg-primary py-3 items-center justify-center rounded-md"
                  style={{ width: '49%' }}
                >
                  <Text className="text-white font-semibold text-sm">
                    Desfavoritar
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="bg-primary py-3 items-center justify-center rounded-md"
                  style={{ width: '49%' }}
                >
                  <Text className="text-white font-semibold text-sm">
                    Compartilhar
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}