import React, { useState, useEffect, useRef } from 'react';
import { View, Animated, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Slot, useRouter, useSegments } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui/text';

export default function CreateItineraryLayout() {
  const router = useRouter();
  const segments = useSegments();
  const [isLoading, setIsLoading] = useState(true);
  const [fadeAnim] = useState(new Animated.Value(1));
  const [slideAnim] = useState(new Animated.Value(0));
  
  const progress1 = useRef(new Animated.Value(0)).current;
  const progress2 = useRef(new Animated.Value(0)).current;
  const progress3 = useRef(new Animated.Value(0)).current;

  const currentStep = segments[segments.length - 1] === 'step-1' ? 1
    : segments[segments.length - 1] === 'step-2' ? 2
    : segments[segments.length - 1] === 'step-3' ? 3 : 1;

  const stepTitles: { [key: number]: string } = {
    1: 'Informações da Viagem',
    2: 'Estilo da Viagem',
    3: 'Personalização',
  };

  const currentTitle = stepTitles[currentStep] || 'Novo Roteiro';

  useEffect(() => {
    setIsLoading(true);
    slideAnim.setValue(50);
    fadeAnim.setValue(0);
    
    animateProgressBars(currentStep);
    
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setIsLoading(false);
      });
    }, 100);
  }, [currentStep]);

  const animateProgressBars = (step: number) => {
    const duration = 300;
    const delay = 150;

    Animated.timing(progress1, {
      toValue: step >= 1 ? 1 : 0,
      duration: duration,
      useNativeDriver: false,
    }).start();

    setTimeout(() => {
      Animated.timing(progress2, {
        toValue: step >= 2 ? 1 : 0,
        duration: duration,
        useNativeDriver: false,
      }).start();
    }, step >= 2 ? delay : 0);

    setTimeout(() => {
      Animated.timing(progress3, {
        toValue: step >= 3 ? 1 : 0,
        duration: duration,
        useNativeDriver: false,
      }).start();
    }, step >= 3 ? delay * 2 : 0);
  };

  const handleBack = () => {
    setIsLoading(true);
    
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -50,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace('/itinerary');
      }
    });
  };

  const progress1Width = progress1.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const progress2Width = progress2.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const progress3Width = progress3.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <SafeAreaView className="flex-1 bg-secondary">
      {/* Layout do Header */}
      <View className="bg-secondary">
        {/* Header */}
        <View className="px-6 py-3 flex-row items-center justify-between">
          <TouchableOpacity 
            onPress={handleBack} 
            className="w-10 h-10 items-center justify-center -ml-2"
            disabled={isLoading}
          >
            <Ionicons name="arrow-back" size={24} color="#1238b4" />
          </TouchableOpacity>
          
          <Text className="text-base text-primary font-bold">
            {currentTitle}
          </Text>
          
          <View className="w-10" />
        </View>

        {/* Progress Bar */}
        <View className="px-6 pb-3">
          <View className="flex-row gap-2 mb-2">
            <View className="flex-1 h-1 rounded-full bg-primary/20 overflow-hidden">
              <Animated.View 
                className="h-full bg-primary rounded-full"
                style={{ width: progress1Width }}
              />
            </View>

            <View className="flex-1 h-1 rounded-full bg-primary/20 overflow-hidden">
              <Animated.View 
                className="h-full bg-primary rounded-full"
                style={{ width: progress2Width }}
              />
            </View>

            <View className="flex-1 h-1 rounded-full bg-primary/20 overflow-hidden">
              <Animated.View 
                className="h-full bg-primary rounded-full"
                style={{ width: progress3Width }}
              />
            </View>
          </View>
          
          {/* Indicador de Etapa */}
          <Text className="text-xs text-primary/60 text-center">
            Etapa {currentStep} de 3
          </Text>
        </View>
      </View>

      {/* Content Area com Loading */}
      <View className="flex-1 relative">
        <Animated.View
          style={{
            flex: 1,
            opacity: fadeAnim,
            transform: [{ translateX: slideAnim }],
          }}
        >
          <Slot />
        </Animated.View>

        {isLoading && (
          <View 
            className="absolute inset-0 bg-secondary items-center justify-center"
            style={{ zIndex: 999 }}
          >
            <View className="items-center gap-3">
              <ActivityIndicator size="large" color="#1238b4" />
              <Text className="text-primary font-semibold">Carregando...</Text>
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}