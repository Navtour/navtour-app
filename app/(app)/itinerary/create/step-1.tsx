import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Text } from '@/components/ui/text';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/checkbox';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useItineraryForm } from '@/app/(app)/itinerary/create/FormContext';

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
  const [arrivalDate, setArrivalDate] = useState(new Date());
  const [departureDate, setDepartureDate] = useState(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);

  useEffect(() => {
    if (formData.step1) {
      const { step1 } = formData;
      
      setState(step1.state);
      setCity(step1.city);
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

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  const addAccommodation = () => {
    const newAccommodation: Accommodation = {
      id: Date.now().toString(),
      isRelativeHouse: false,
      name: '',
      address: '',
      instagram: '',
      facebook: '',
      checkInDate: new Date(),
      checkInTime: new Date(new Date().setHours(14, 0, 0, 0)),
      checkOutDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      checkOutTime: new Date(new Date().setHours(12, 0, 0, 0)),
    };
    setAccommodations([...accommodations, newAccommodation]);
  };

  const removeAccommodation = (id: string) => {
    setAccommodations(accommodations.filter(acc => acc.id !== id));
  };

  const updateAccommodation = (id: string, field: keyof Accommodation, value: any) => {
    setAccommodations(accommodations.map(acc => {
      if (acc.id === id) {
        const updated = { ...acc, [field]: value };
        
        if (field === 'isRelativeHouse' && value === true) {
          updated.name = '';
          updated.instagram = '';
          updated.facebook = '';
        }
        
        return updated;
      }
      return acc;
    }));
  };

  const openPicker = (accommodationId: string, pickerType: 'checkInDate' | 'checkInTime' | 'checkOutDate' | 'checkOutTime') => {
    setActiveAccommodationId(accommodationId);
    setActivePickerType(pickerType);
  };

  const closePicker = () => {
    setActiveAccommodationId(null);
    setActivePickerType(null);
  };

  const handleNext = () => {
    if (!state.trim() || !city.trim() || arrivalDate >= departureDate) {
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
              <Input
                value={state}
                onChangeText={setState}
                placeholder="Ex: Ceará"
                className="bg-white border-2 border-primary"
              />
            </View>

            <View className="gap-2">
              <Text className="text-primary/70 text-xs">Cidade</Text>
              <Input
                value={city}
                onChangeText={setCity}
                placeholder="Ex: Fortaleza"
                className="bg-white border-2 border-primary"
              />
            </View>
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
              onChange={(event: DateTimePickerEvent, date?: Date) => {
                if (Platform.OS === 'android') {
                  setShowArrivalPicker(false);
                }
                if (event.type === 'set' && date) {
                  setArrivalDate(date);
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

            return (
              <DateTimePicker
                value={config.value}
                mode={config.mode}
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
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
          disabled={!state.trim() || !city.trim() || arrivalDate >= departureDate}
          className="bg-primary h-12"
        >
          <Text className="text-secondary font-semibold text-base">Continuar</Text>
        </Button>
      </View>
    </>
  );
}