import React, { useState, useEffect, useMemo } from 'react';
import { View, ScrollView, TouchableOpacity, Platform, Alert, Modal, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Text } from '@/components/ui/text';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/checkbox';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useItineraryForm } from '@/app/(app)/itinerary/create/FormContext';
import { getStates, getCitiesByState, searchStates, searchCities,getStateByName,State, City } from '@/lib/locations';

type PickerType = 'state' | 'city';
type Accommodation = {
  id: string;
  isRelativeHouse: boolean;
  name: string;
  address: string;
  instagram: string;
  facebook: string;
  checkInDate: Date;
  checkInTime: Date;
  checkOutDate: Date;
  checkOutTime: Date;
};

export default function CreateItineraryStep1() {
  const router = useRouter();
  const { formData, updateStep1 } = useItineraryForm();
  const [showArrivalPicker, setShowArrivalPicker] = useState(false);
  const [showDeparturePicker, setShowDeparturePicker] = useState(false);
  const [activeAccommodationId, setActiveAccommodationId] = useState<string | null>(null);
  const [activePickerType, setActivePickerType] = useState<'checkInDate' | 'checkInTime' | 'checkOutDate' | 'checkOutTime' | null>(null);
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [selectedStateId, setSelectedStateId] = useState<string | null>(null);
  const [showLocationPicker, setShowLocationPicker] = useState<PickerType | null>(null);
  const [locationSearch, setLocationSearch] = useState('');
  const [locationError, setLocationError] = useState<string | null>(null);
  const [arrivalDate, setArrivalDate] = useState(new Date());
  const [departureDate, setDepartureDate] = useState(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const availableStates = useMemo(() => getStates(), []);
  const availableCities = useMemo(() => {
    if (!selectedStateId) return [];
    return getCitiesByState(selectedStateId);
  }, [selectedStateId]);

  const filteredStates = useMemo(() => {
    if (!locationSearch.trim()) return availableStates;
    return searchStates(locationSearch);
  }, [locationSearch, availableStates]);

  const filteredCities = useMemo(() => {
    if (!locationSearch.trim()) return availableCities;
    return searchCities(locationSearch, selectedStateId || undefined);
  }, [locationSearch, availableCities, selectedStateId]);

  useEffect(() => {
    if (formData.step1) {
      const { step1 } = formData;
      
      setState(step1.state);
      setCity(step1.city);
      
      const foundState = getStateByName(step1.state);
      if (foundState) {
        setSelectedStateId(foundState.id);
      }
      
      setArrivalDate(new Date(step1.arrivalDate + 'T00:00:00'));
      setDepartureDate(new Date(step1.departureDate + 'T00:00:00'));
      
      setAccommodations(step1.accommodations.map(acc => {
        const parseTime = (timeStr?: string) => {
          if (!timeStr) return new Date(new Date().setHours(14, 0, 0, 0));
          const [h, m] = timeStr.split(':');
          const date = new Date();
          date.setHours(parseInt(h), parseInt(m), 0, 0);
          return date;
        };

        return {
          id: acc.id,
          isRelativeHouse: acc.isRelativeHouse,
          name: acc.name || '',
          address: acc.address,
          instagram: acc.instagram || '',
          facebook: acc.facebook || '',
          checkInDate: new Date(acc.checkInDate + 'T00:00:00'),
          checkInTime: parseTime(acc.checkInTime),
          checkOutDate: new Date(acc.checkOutDate + 'T00:00:00'),
          checkOutTime: parseTime(acc.checkOutTime),
        };
      }));
    }
  }, []);

  // Sincroniza datas das hospedagens quando período da viagem muda
  useEffect(() => {
    if (accommodations.length === 0) return;

    setAccommodations(prev => {
      return prev.map((acc, index) => {
        const updated = { ...acc };
        
        if (index === 0) {
          const currentCheckIn = getStartOfDay(acc.checkInDate);
          const newArrival = getStartOfDay(arrivalDate);
          if (currentCheckIn.getTime() !== newArrival.getTime()) {
            updated.checkInDate = new Date(arrivalDate);
          }
        }
        
        if (index === prev.length - 1) {
          const currentCheckOut = getStartOfDay(acc.checkOutDate);
          const newDeparture = getStartOfDay(departureDate);
          if (currentCheckOut.getTime() !== newDeparture.getTime()) {
            updated.checkOutDate = new Date(departureDate);
          }
        }
        
        return updated;
      });
    });
  }, [arrivalDate, departureDate]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  const getStartOfDay = (date: Date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  const addAccommodation = () => {
    const isFirstAccommodation = accommodations.length === 0;
    const lastAccommodation = accommodations[accommodations.length - 1];
    const checkInDate = isFirstAccommodation 
      ? new Date(arrivalDate) 
      : new Date(lastAccommodation.checkOutDate);
    
    const checkOutDate = new Date(departureDate);
    
    const newAccommodation: Accommodation = {
      id: Date.now().toString(),
      isRelativeHouse: false,
      name: '',
      address: '',
      instagram: '',
      facebook: '',
      checkInDate,
      checkInTime: new Date(new Date().setHours(14, 0, 0, 0)),
      checkOutDate,
      checkOutTime: new Date(new Date().setHours(12, 0, 0, 0)),
    };

    if (!isFirstAccommodation) {
      setAccommodations(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          ...updated[updated.length - 1],
          checkOutDate: checkInDate,
        };
        return [...updated, newAccommodation];
      });
    } else {
      setAccommodations([...accommodations, newAccommodation]);
    }
  };

  const removeAccommodation = (id: string) => {
    const index = accommodations.findIndex(acc => acc.id === id);
    const newAccommodations = accommodations.filter(acc => acc.id !== id);
    
    if (newAccommodations.length > 0 && index > 0 && index < accommodations.length) {
      const nextAcc = newAccommodations[index];
      if (nextAcc && index > 0) {
        newAccommodations[index - 1] = {
          ...newAccommodations[index - 1],
          checkOutDate: nextAcc.checkInDate,
        };
      }
    }
    
    setAccommodations(newAccommodations);
  };

  const updateAccommodation = (id: string, field: keyof Accommodation, value: any) => {
    setAccommodations(prev => {
      const index = prev.findIndex(acc => acc.id === id);
      
      return prev.map((acc, i) => {
        if (acc.id === id) {
          const updated = { ...acc, [field]: value };
          
          if (field === 'isRelativeHouse' && value === true) {
            updated.name = '';
            updated.instagram = '';
            updated.facebook = '';
          }
          
          return updated;
        }

        if (field === 'checkOutDate' && i === index + 1) {
          return { ...acc, checkInDate: value };
        }
        
        return acc;
      });
    });
  };

  const openPicker = (accommodationId: string, pickerType: 'checkInDate' | 'checkInTime' | 'checkOutDate' | 'checkOutTime') => {
    setActiveAccommodationId(accommodationId);
    setActivePickerType(pickerType);
  };

  const closePicker = () => {
    setActiveAccommodationId(null);
    setActivePickerType(null);
  };

  const handleStateSelect = (selectedState: State) => {
    setState(selectedState.name);
    setSelectedStateId(selectedState.id);
    setCity('');
    setShowLocationPicker(null);
    setLocationSearch('');
    setLocationError(null);
  };

  const handleCitySelect = (selectedCity: City) => {
    setCity(selectedCity.name);
    setShowLocationPicker(null);
    setLocationSearch('');
    setLocationError(null);
  };

  const validateLocation = (): boolean => {
    if (!state.trim()) {
      setLocationError('Selecione um estado');
      return false;
    }
    
    const foundState = getStateByName(state);
    if (!foundState) {
      setLocationError('Este estado não está disponível. Selecione um estado da lista.');
      return false;
    }
    
    if (!city.trim()) {
      setLocationError('Selecione uma cidade');
      return false;
    }
    
    const citiesInState = getCitiesByState(foundState.id);
    const cityExists = citiesInState.some(c => c.name.toLowerCase() === city.toLowerCase().trim());
    
    if (!cityExists) {
      setLocationError(`${city} não está disponível em ${state}. Selecione uma cidade da lista.`);
      return false;
    }
    
    setLocationError(null);
    return true;
  };

  const validateAccommodationDates = (): boolean => {
    if (accommodations.length === 0) return true;
    
    const tripStart = getStartOfDay(arrivalDate);
    const tripEnd = getStartOfDay(departureDate);

    const firstAcc = accommodations[0];
    const firstCheckIn = getStartOfDay(firstAcc.checkInDate);
    if (firstCheckIn < tripStart) {
      Alert.alert('Erro', 'O check-in da primeira hospedagem deve ser igual ou após a data de chegada da viagem.');
      return false;
    }

    const lastAcc = accommodations[accommodations.length - 1];
    const lastCheckOut = getStartOfDay(lastAcc.checkOutDate);
    if (lastCheckOut > tripEnd) {
      Alert.alert('Erro', 'O check-out da última hospedagem deve ser igual ou antes da data de saída da viagem.');
      return false;
    }

    for (let i = 0; i < accommodations.length; i++) {
      const acc = accommodations[i];
      const checkIn = getStartOfDay(acc.checkInDate);
      const checkOut = getStartOfDay(acc.checkOutDate);
      
      if (checkIn >= checkOut) {
        Alert.alert('Erro', `Hospedagem ${i + 1}: Check-out deve ser após o check-in.`);
        return false;
      }

      if (i > 0) {
        const prevCheckOut = getStartOfDay(accommodations[i - 1].checkOutDate);
        if (checkIn < prevCheckOut) {
          Alert.alert('Erro', `Hospedagem ${i + 1}: Check-in deve ser igual ou após o check-out da hospedagem anterior.`);
          return false;
        }
      }
    }
    
    return true;
  };

  const handleNext = () => {
    const today = getStartOfDay(new Date());
    const arrival = getStartOfDay(arrivalDate);
    
    if (arrival < today) {
      Alert.alert('Erro', 'A data de chegada não pode ser anterior à data atual.');
      return;
    }

    if (!validateLocation()) {
      return;
    }
    
    if (arrivalDate >= departureDate) {
      Alert.alert('Erro', 'A data de saída deve ser posterior à data de chegada.');
      return;
    }

    if (!validateAccommodationDates()) {
      return;
    }
    
    const formatDateOnly = (date: Date) => date.toISOString().split('T')[0];
    const formatTimeOnly = (date: Date) => date.toTimeString().split(' ')[0].substring(0, 5);
    
    const cleanedAccommodations = accommodations.map(acc => {
      if (acc.isRelativeHouse) {
        return {
          id: acc.id,
          isRelativeHouse: true,
          address: acc.address,
          checkInDate: formatDateOnly(acc.checkInDate),
          checkOutDate: formatDateOnly(acc.checkOutDate),
        };
      }
      
      return {
        id: acc.id,
        isRelativeHouse: false,
        name: acc.name,
        address: acc.address,
        instagram: acc.instagram,
        facebook: acc.facebook,
        checkInDate: formatDateOnly(acc.checkInDate),
        checkInTime: formatTimeOnly(acc.checkInTime),
        checkOutDate: formatDateOnly(acc.checkOutDate),
        checkOutTime: formatTimeOnly(acc.checkOutTime),
      };
    });
    
    updateStep1({
      state,
      city,
      arrivalDate: formatDateOnly(arrivalDate),
      departureDate: formatDateOnly(departureDate),
      accommodations: cleanedAccommodations,
    });
    
    router.push('/itinerary/create/step-2');
  };

  const renderLocationPicker = () => {
    if (!showLocationPicker) return null;
    
    const isStatePicker = showLocationPicker === 'state';
    
    return (
      <Modal
        visible={true}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          setShowLocationPicker(null);
          setLocationSearch('');
        }}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-3xl max-h-[70%]">
            <View className="p-4 border-b border-primary/10">
              <View className="flex-row items-center justify-between mb-3">
                <Text className="text-primary font-bold text-lg">
                  {isStatePicker ? 'Selecione o Estado' : 'Selecione a Cidade'}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setShowLocationPicker(null);
                    setLocationSearch('');
                  }}
                >
                  <Ionicons name="close" size={24} color="#1238b4" />
                </TouchableOpacity>
              </View>
              
              <Input
                value={locationSearch}
                onChangeText={setLocationSearch}
                placeholder={isStatePicker ? 'Buscar estado...' : 'Buscar cidade...'}
                className="bg-secondary border-2 border-primary"
              />
            </View>
            
            {(isStatePicker ? filteredStates : filteredCities).length === 0 ? (
              <View className="p-6 items-center">
                <Ionicons name="alert-circle-outline" size={48} color="#1238b4" opacity={0.3} />
                <Text className="text-primary/50 text-sm mt-2 text-center">
                  {isStatePicker 
                    ? 'Nenhum estado encontrado' 
                    : selectedStateId 
                      ? 'Nenhuma cidade disponível neste estado'
                      : 'Selecione um estado primeiro'
                  }
                </Text>
              </View>
            ) : isStatePicker ? (
              <FlatList<State>
                data={filteredStates}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => handleStateSelect(item)}
                    className="p-4 border-b border-primary/10 flex-row items-center justify-between"
                  >
                    <Text className="text-primary text-base">
                      {item.name}
                      <Text className="text-primary/50"> ({item.uf})</Text>
                    </Text>
                    <Ionicons name="chevron-forward" size={20} color="#1238b4" opacity={0.5} />
                  </TouchableOpacity>
                )}
              />
            ) : (
              <FlatList<City>
                data={filteredCities}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => handleCitySelect(item)}
                    className="p-4 border-b border-primary/10 flex-row items-center justify-between"
                  >
                    <Text className="text-primary text-base">{item.name}</Text>
                    <Ionicons name="chevron-forward" size={20} color="#1238b4" opacity={0.5} />
                  </TouchableOpacity>
                )}
              />
            )}
          </View>
        </View>
      </Modal>
    );
  };

  const getAccommodationMinDate = (accId: string, field: 'checkInDate' | 'checkOutDate') => {
    const index = accommodations.findIndex(acc => acc.id === accId);
    const acc = accommodations[index];
    
    if (field === 'checkInDate') {
      if (index === 0) return arrivalDate;
      return accommodations[index - 1].checkOutDate;
    }

    return new Date(acc.checkInDate.getTime() + 24 * 60 * 60 * 1000);
  };

  const getAccommodationMaxDate = (accId: string, field: 'checkInDate' | 'checkOutDate') => {
    const index = accommodations.findIndex(acc => acc.id === accId);
    
    if (field === 'checkOutDate') {
      if (index === accommodations.length - 1) return departureDate;
      return accommodations[index + 1].checkInDate;
    }

    const acc = accommodations[index];
    return new Date(acc.checkOutDate.getTime() - 24 * 60 * 60 * 1000);
  };

  return (
    <>
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        <View className="px-6 py-6 gap-6">
          <View>
            <Text className="text-h2 text-primary font-bold">Informações da viagem</Text>
            <Text className="text-primary/70 mt-1">Conte-nos sobre seu destino e período</Text>
          </View>

          {/* Destination */}
          <View className="gap-4">
            <Text className="text-primary font-bold text-sm">Destino *</Text>
            
            <View className="gap-2">
              <Text className="text-primary/70 text-xs">Estado</Text>
              <TouchableOpacity
                onPress={() => setShowLocationPicker('state')}
                className="bg-white border-2 border-primary rounded-md px-3 py-2.5 flex-row items-center justify-between"
              >
                <Text className={state ? 'text-primary' : 'text-primary/40'}>
                  {state || 'Selecione o estado'}
                </Text>
                <Ionicons name="chevron-down" size={20} color="#1238b4" />
              </TouchableOpacity>
            </View>

            <View className="gap-2">
              <Text className="text-primary/70 text-xs">Cidade</Text>
              <TouchableOpacity
                onPress={() => {
                  if (!selectedStateId) {
                    Alert.alert('Atenção', 'Selecione um estado primeiro.');
                    return;
                  }
                  setShowLocationPicker('city');
                }}
                className={`bg-white border-2 rounded-md px-3 py-2.5 flex-row items-center justify-between ${
                  selectedStateId ? 'border-primary' : 'border-primary/30'
                }`}
              >
                <Text className={city ? 'text-primary' : 'text-primary/40'}>
                  {city || (selectedStateId ? 'Selecione a cidade' : 'Selecione um estado primeiro')}
                </Text>
                <Ionicons name="chevron-down" size={20} color={selectedStateId ? '#1238b4' : '#1238b450'} />
              </TouchableOpacity>
            </View>
            
            {/* Error Message */}
            {locationError && (
              <View className="bg-red-50 border border-red-200 rounded-lg p-3 flex-row items-start gap-2">
                <Ionicons name="alert-circle" size={20} color="#dc2626" />
                <Text className="text-red-600 text-sm flex-1">{locationError}</Text>
              </View>
            )}
          </View>

          {/* Travel Period */}
          <View className="gap-4">
            <Text className="text-primary font-bold text-sm">Período da viagem *</Text>
            
            <View className="flex-row gap-3">
              <View className="flex-1 gap-2">
                <Text className="text-primary/70 text-xs">Chegada</Text>
                <TouchableOpacity
                  onPress={() => setShowArrivalPicker(true)}
                  className="bg-white border-2 border-primary rounded-md px-3 py-2.5 flex-row items-center justify-between"
                >
                  <Text className="text-primary">{formatDate(arrivalDate)}</Text>
                  <Ionicons name="calendar-outline" size={20} color="#1238b4" />
                </TouchableOpacity>
              </View>

              <View className="flex-1 gap-2">
                <Text className="text-primary/70 text-xs">Saída</Text>
                <TouchableOpacity
                  onPress={() => setShowDeparturePicker(true)}
                  className="bg-white border-2 border-primary rounded-md px-3 py-2.5 flex-row items-center justify-between"
                >
                  <Text className="text-primary">{formatDate(departureDate)}</Text>
                  <Ionicons name="calendar-outline" size={20} color="#1238b4" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Accommodations Section */}
          <View className="gap-3">
            <View className="flex-row items-center justify-between">
              <Text className="text-primary font-bold">Hospedagens</Text>
              <TouchableOpacity
                onPress={addAccommodation}
                className="flex-row items-center gap-2 bg-primary px-4 py-2 rounded-lg"
              >
                <Ionicons name="add" size={20} color="#fff5dc" />
                <Text className="text-secondary font-semibold text-sm">Adicionar</Text>
              </TouchableOpacity>
            </View>

            {accommodations.length === 0 && (
              <View className="bg-primary/5 border-2 border-dashed border-primary/20 rounded-xl p-6 items-center">
                <Ionicons name="bed-outline" size={48} color="#1238b4" opacity={0.3} />
                <Text className="text-primary/50 text-sm mt-2 text-center">
                  Nenhuma hospedagem adicionada
                </Text>
                <Text className="text-primary/40 text-xs mt-1 text-center">
                  Clique em "Adicionar" para incluir suas hospedagens
                </Text>
              </View>
            )}

            {accommodations.map((accommodation, index) => (
              <View key={accommodation.id} className="bg-white rounded-xl p-4 gap-4 border-2 border-primary/10">
                <View className="flex-row items-center justify-between pb-3 border-b border-primary/10">
                  <View className="flex-row items-center gap-3">
                    <View className="w-8 h-8 rounded-full bg-primary items-center justify-center">
                      <Text className="text-secondary font-bold text-sm">{index + 1}</Text>
                    </View>
                    <Text className="text-primary font-bold text-base">
                      {accommodation.name || (accommodation.isRelativeHouse ? `Casa ${index + 1}` : `Hospedagem ${index + 1}`)}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => removeAccommodation(accommodation.id)}
                    className="w-8 h-8 items-center justify-center"
                  >
                    <Ionicons name="trash-outline" size={20} color="#ff6a32" />
                  </TouchableOpacity>
                </View>

                {/* Checkbox */}
                <TouchableOpacity
                  onPress={() => updateAccommodation(accommodation.id, 'isRelativeHouse', !accommodation.isRelativeHouse)}
                  className="flex-row items-center gap-3 py-2 px-3 bg-primary/5 rounded-lg"
                >
                  <Checkbox
                    checked={accommodation.isRelativeHouse}
                    onCheckedChange={(checked) => updateAccommodation(accommodation.id, 'isRelativeHouse', checked)}
                  />
                  <View className="flex-1">
                    <Text className="text-primary font-semibold">Casa de parente/amigo</Text>
                    <Text className="text-primary/60 text-xs">Hospedagem informal sem horários fixos</Text>
                  </View>
                </TouchableOpacity>

                {/* Nome */}
                {!accommodation.isRelativeHouse && (
                  <View className="gap-2">
                    <Text className="text-primary font-bold text-sm">Nome do local</Text>
                    <Input
                      value={accommodation.name}
                      onChangeText={(val) => updateAccommodation(accommodation.id, 'name', val)}
                      placeholder="Ex: Hotel Praia Mar"
                      className="bg-secondary border-2 border-primary"
                    />
                  </View>
                )}

                {/* Endereço */}
                <View className="gap-2">
                  <Text className="text-primary font-bold text-sm">Endereço</Text>
                  <Input
                    value={accommodation.address}
                    onChangeText={(val) => updateAccommodation(accommodation.id, 'address', val)}
                    placeholder={accommodation.isRelativeHouse ? "Ex: Rua das Flores, 123" : "Rua, número"}
                    className="bg-secondary border-2 border-primary"
                  />
                </View>

                {/* Redes sociais */}
                {!accommodation.isRelativeHouse && (
                  <View className="gap-2">
                    <Text className="text-primary font-bold text-sm">Redes sociais (opcional)</Text>
                    <View className="gap-3">
                      <View className="flex-row items-center gap-2">
                        <Ionicons name="logo-instagram" size={20} color="#E4405F" />
                        <Input
                          value={accommodation.instagram}
                          onChangeText={(val) => updateAccommodation(accommodation.id, 'instagram', val)}
                          placeholder="@usuario"
                          className="flex-1 bg-secondary border-2 border-primary"
                        />
                      </View>
                      <View className="flex-row items-center gap-2">
                        <Ionicons name="logo-facebook" size={20} color="#1877F2" />
                        <Input
                          value={accommodation.facebook}
                          onChangeText={(val) => updateAccommodation(accommodation.id, 'facebook', val)}
                          placeholder="@usuario"
                          className="flex-1 bg-secondary border-2 border-primary"
                        />
                      </View>
                    </View>
                  </View>
                )}

                {/* Check-in e Check-out */}
                <View className="flex-row gap-3">
                  <View className="flex-1 gap-2">
                    <Text className="text-primary font-bold text-sm">Check-in</Text>
                    <View className="gap-2">
                      <TouchableOpacity
                        onPress={() => openPicker(accommodation.id, 'checkInDate')}
                        className="bg-secondary border-2 border-primary rounded-md px-3 py-2.5 flex-row items-center justify-between"
                      >
                        <Text className="text-primary text-sm">{formatDate(accommodation.checkInDate)}</Text>
                        <Ionicons name="calendar-outline" size={18} color="#1238b4" />
                      </TouchableOpacity>
                      
                      {!accommodation.isRelativeHouse && (
                        <TouchableOpacity
                          onPress={() => openPicker(accommodation.id, 'checkInTime')}
                          className="bg-secondary border-2 border-primary rounded-md px-3 py-2.5 flex-row items-center justify-between"
                        >
                          <Text className="text-primary text-sm">{formatTime(accommodation.checkInTime)}</Text>
                          <Ionicons name="time-outline" size={18} color="#1238b4" />
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>

                  <View className="flex-1 gap-2">
                    <Text className="text-primary font-bold text-sm">Check-out</Text>
                    <View className="gap-2">
                      <TouchableOpacity
                        onPress={() => openPicker(accommodation.id, 'checkOutDate')}
                        className="bg-secondary border-2 border-primary rounded-md px-3 py-2.5 flex-row items-center justify-between"
                      >
                        <Text className="text-primary text-sm">{formatDate(accommodation.checkOutDate)}</Text>
                        <Ionicons name="calendar-outline" size={18} color="#1238b4" />
                      </TouchableOpacity>
                      
                      {!accommodation.isRelativeHouse && (
                        <TouchableOpacity
                          onPress={() => openPicker(accommodation.id, 'checkOutTime')}
                          className="bg-secondary border-2 border-primary rounded-md px-3 py-2.5 flex-row items-center justify-between"
                        >
                          <Text className="text-primary text-sm">{formatTime(accommodation.checkOutTime)}</Text>
                          <Ionicons name="time-outline" size={18} color="#1238b4" />
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>

          {/* Date Pickers */}
          {showArrivalPicker && (
            <DateTimePicker
              value={arrivalDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              minimumDate={new Date()}
              onChange={(event: DateTimePickerEvent, date?: Date) => {
                if (Platform.OS === 'android') {
                  setShowArrivalPicker(false);
                }
                if (event.type === 'set' && date) {
                  setArrivalDate(date);
                  if (date >= departureDate) {
                    setDepartureDate(new Date(date.getTime() + 24 * 60 * 60 * 1000));
                  }
                  if (Platform.OS === 'ios') {
                    setShowArrivalPicker(false);
                  }
                } else if (event.type === 'dismissed') {
                  setShowArrivalPicker(false);
                }
              }}
            />
          )}
          {showDeparturePicker && (
            <DateTimePicker
              value={departureDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              minimumDate={new Date(arrivalDate.getTime() + 24 * 60 * 60 * 1000)}
              onChange={(event: DateTimePickerEvent, date?: Date) => {
                if (Platform.OS === 'android') {
                  setShowDeparturePicker(false);
                }
                if (event.type === 'set' && date) {
                  setDepartureDate(date);
                  if (Platform.OS === 'ios') {
                    setShowDeparturePicker(false);
                  }
                } else if (event.type === 'dismissed') {
                  setShowDeparturePicker(false);
                }
              }}
            />
          )}
          
          {/* Accommodation Pickers */}
          {activeAccommodationId && activePickerType && (() => {
            const accommodation = accommodations.find(acc => acc.id === activeAccommodationId);
            if (!accommodation) return null;

            const pickerConfig = {
              checkInDate: { value: accommodation.checkInDate, mode: 'date' as const },
              checkInTime: { value: accommodation.checkInTime, mode: 'time' as const },
              checkOutDate: { value: accommodation.checkOutDate, mode: 'date' as const },
              checkOutTime: { value: accommodation.checkOutTime, mode: 'time' as const },
            };

            const config = pickerConfig[activePickerType];
            const minDate = activePickerType === 'checkInDate' || activePickerType === 'checkOutDate'
              ? getAccommodationMinDate(activeAccommodationId, activePickerType as 'checkInDate' | 'checkOutDate')
              : undefined;
            const maxDate = activePickerType === 'checkInDate' || activePickerType === 'checkOutDate'
              ? getAccommodationMaxDate(activeAccommodationId, activePickerType as 'checkInDate' | 'checkOutDate')
              : undefined;

            return (
              <DateTimePicker
                value={config.value}
                mode={config.mode}
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                minimumDate={minDate}
                maximumDate={maxDate}
                onChange={(event: DateTimePickerEvent, date?: Date) => {
                  if (Platform.OS === 'android') {
                    closePicker();
                  }
                  if (event.type === 'set' && date) {
                    if (activePickerType === 'checkInDate') {
                      const updated = new Date(accommodation.checkInDate);
                      updated.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
                      updateAccommodation(activeAccommodationId, 'checkInDate', updated);
                    } else if (activePickerType === 'checkInTime') {
                      const updated = new Date(accommodation.checkInTime);
                      updated.setHours(date.getHours(), date.getMinutes());
                      updateAccommodation(activeAccommodationId, 'checkInTime', updated);
                    } else if (activePickerType === 'checkOutDate') {
                      const updated = new Date(accommodation.checkOutDate);
                      updated.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
                      updateAccommodation(activeAccommodationId, 'checkOutDate', updated);
                    } else if (activePickerType === 'checkOutTime') {
                      const updated = new Date(accommodation.checkOutTime);
                      updated.setHours(date.getHours(), date.getMinutes());
                      updateAccommodation(activeAccommodationId, 'checkOutTime', updated);
                    }
                    if (Platform.OS === 'ios') {
                      closePicker();
                    }
                  } else if (event.type === 'dismissed') {
                    closePicker();
                  }
                }}
              />
            );
          })()}
        </View>
      </ScrollView>

      <View className="px-6 pb-6 pt-3 bg-secondary border-t border-primary/10">
        <Button
          onPress={handleNext}
          disabled={!state.trim() || !city.trim()}
          className="bg-primary h-12"
        >
          <Text className="text-secondary font-semibold text-base">Continuar</Text>
        </Button>
      </View>
      
      {/* Location Picker Modal */}
      {renderLocationPicker()}
    </>
  );
}