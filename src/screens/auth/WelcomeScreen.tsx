import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';

type WelcomeScreenProps = {
  onGetStarted: () => void;
  onShowInfo: () => void;
};

const HIT_SLOP = { top: 12, right: 12, bottom: 12, left: 12 };

const cards = [
  {
    id: 'nu',
    gradient: ['#B077FF', '#F58FFF'],
    label: 'nu',
    labelClass: 'text-5xl',
    rotate: '-8deg',
    offset: 0,
  },
  {
    id: 'banorte',
    gradient: ['#F87171', '#C81E1E'],
    label: 'BANORTE',
    labelClass: 'text-3xl tracking-wide',
    rotate: '-4deg',
    offset: 32,
  },
  {
    id: 'banamex',
    gradient: ['#2DD4BF', '#0EA5E9'],
    label: 'Banamex',
    labelClass: 'text-2xl font-semibold',
    rotate: '0deg',
    offset: 64,
  },
  {
    id: 'santander',
    gradient: ['#FE4A49', '#B91C1C'],
    label: 'Santander',
    labelClass: 'text-2xl font-semibold',
    rotate: '4deg',
    offset: 96,
  },
  {
    id: 'bbva',
    gradient: ['#38BDF8', '#0EA5E9'],
    label: 'BBVA',
    labelClass: 'text-3xl font-semibold',
    rotate: '8deg',
    offset: 128,
  },
];

export default function WelcomeScreen({ onGetStarted, onShowInfo }: WelcomeScreenProps) {
  return (
    <View className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ paddingBottom: 48 }} className="flex-1 px-6 pt-16">
        <View className="mb-6">
          <Text className="text-sm uppercase tracking-[0.35em] text-gray-400">Home</Text>
          <Text className="text-3xl font-bold text-gray-900">FinHub México</Text>
          <Text className="mt-2 text-lg text-gray-600">
            Tu centro de Finanzas Abiertas e Inclusivas
          </Text>
        </View>

        <View className="mb-8" accessible={false} importantForAccessibility="no">
          <View className="relative h-[360px] w-full">
            {cards.map((card, index) => (
              <LinearGradient
                key={card.id}
                colors={card.gradient as [string, string]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="absolute left-4 right-4 rounded-[32px] p-6"
                style={{
                  top: card.offset,
                  transform: [{ rotate: card.rotate }],
                  zIndex: index,
                  shadowColor: card.gradient[0],
                  shadowOpacity: 0.25,
                  shadowRadius: 18,
                  shadowOffset: { width: 0, height: 12 },
                  elevation: 6,
                }}>
                <View className="flex-row items-center justify-between">
                  <Text className={`font-bold text-white ${card.labelClass}`}>{card.label}</Text>
                  {card.id === 'bbva' ? (
                    <Text className="text-sm font-semibold uppercase tracking-[0.4em] text-white/80">
                      VISA
                    </Text>
                  ) : card.id === 'nu' ? (
                    <View className="h-8 w-12 rounded-xl bg-white/20" />
                  ) : (
                    <Ionicons name="card-outline" size={20} color="#fff" />
                  )}
                </View>
                <View className="mt-4 flex-row items-center justify-between">
                  <View className="flex-row gap-2">
                    <View className="h-3 w-8 rounded-full bg-white/40" />
                    <View className="h-3 w-12 rounded-full bg-white/30" />
                  </View>
                  <View className="h-2 w-16 rounded-full bg-white/30" />
                </View>
                {card.id === 'santander' && (
                  <View className="mt-4 self-start rounded-full bg-white px-3 py-1">
                    <Text className="text-xs font-semibold uppercase text-rose-600">
                      Soy Santander
                    </Text>
                  </View>
                )}
                {card.id === 'banamex' && (
                  <View className="mt-4 flex-row items-center gap-2">
                    <View className="h-3 w-3 rounded-full bg-white/80" />
                    <View className="h-3 w-3 rounded-full bg-white/60" />
                    <View className="h-3 w-3 rounded-full bg-white/40" />
                  </View>
                )}
                {card.id === 'nu' && (
                  <View className="mt-4 flex-row gap-3">
                    {[1, 2, 3].map((bubble) => (
                      <View
                        key={bubble}
                        className="h-4 w-4 rounded-full bg-white/25"
                        style={{ opacity: 0.9 - bubble * 0.2 }}
                      />
                    ))}
                  </View>
                )}
                {card.id === 'bbva' && (
                  <View className="mt-6">
                    <Text className="text-xs uppercase tracking-[0.35em] text-white/70">
                      DÉBITO
                    </Text>
                    <Text className="mt-2 text-white/90">•••• 3456</Text>
                  </View>
                )}
              </LinearGradient>
            ))}
          </View>
        </View>

        <Text className="mb-12 text-base leading-7 text-gray-600">
          Donde todas tus finanzas se encuentran, sin importar tu edad o habilidad. Gestiona
          cuentas, tarjetas, inversiones y beneficios en un mismo lugar con una experiencia
          accesible para todos.
        </Text>
      </ScrollView>

      <View className="px-6 pb-10">
        <Pressable
          onPress={onGetStarted}
          accessibilityRole="button"
          accessibilityLabel="Empezar"
          accessibilityHint="Abre el formulario para iniciar sesión"
          hitSlop={HIT_SLOP}
          className="mb-3 flex-row items-center justify-between rounded-2xl bg-emerald-100 px-6 py-4">
          <Text className="text-base font-semibold text-gray-900">Empezar</Text>
          <Ionicons name="arrow-forward" size={20} color="#111827" />
        </Pressable>
        <Pressable
          onPress={onShowInfo}
          accessibilityRole="button"
          accessibilityLabel="¿Qué somos?"
          accessibilityHint="Muestra información detallada del ecosistema"
          hitSlop={HIT_SLOP}
          className="flex-row items-center justify-between rounded-2xl border border-gray-200 px-6 py-4">
          <Text className="text-base font-semibold text-gray-900">¿Qué somos?</Text>
          <Ionicons name="help-circle" size={20} color="#111827" />
        </Pressable>
      </View>
    </View>
  );
}
