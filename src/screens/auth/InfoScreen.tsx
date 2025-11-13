import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

type InfoScreenProps = {
  onBack: () => void;
  onStart: () => void;
};

const bulletPoints = [
  {
    icon: 'layers-outline',
    title: 'Cuentas unificadas',
    description:
      'Integra bancos, inversiones y seguros con tu consentimiento en una vista 360 accesible.',
  },
  {
    icon: 'sparkles-outline',
    title: 'Automatización inteligente',
    description:
      'Ahorro automático, detección de suscripciones, predicción de gastos y protección contra fraudes.',
  },
  {
    icon: 'shield-checkmark-outline',
    title: 'Seguridad avanzada',
    description: 'Conecta servicios sólo cuando lo decidas, con cifrado bancario y biometría.',
  },
  {
    icon: 'accessibility-outline',
    title: 'Diseño inclusivo',
    description:
      'Interfaz adaptable para todas las edades. Reduce la complejidad sin perder potencia.',
  },
];

const HIT_SLOP = { top: 12, left: 12, right: 12, bottom: 12 };

export default function InfoScreen({ onBack, onStart }: InfoScreenProps) {
  return (
    <View className="flex-1 bg-white">
      <View className="rounded-b-[32px]" style={{ backgroundColor: '#50c9c3' }}>
        <View className="flex-row items-center justify-between px-6 pb-6 pt-14">
          <Pressable
            onPress={onBack}
            accessibilityRole="button"
            accessibilityLabel="Regresar"
            accessibilityHint="Vuelve a la pantalla anterior"
            hitSlop={HIT_SLOP}
            className="flex-row items-center gap-2 rounded-full bg-white/20 px-4 py-2">
            <Ionicons name="arrow-back" size={18} color="#fff" />
            <Text className="text-sm font-semibold text-white">Retroceder</Text>
          </Pressable>
          <Ionicons name="information-circle-outline" size={22} color="#fff" />
        </View>
      </View>

      <ScrollView
        className="-mt-10 flex-1 rounded-t-[32px] bg-white px-6 pt-8"
        contentContainerStyle={{ paddingBottom: 32 }}>
        <Text className="mb-6 text-2xl font-bold text-gray-900">¿Qué somos?</Text>
        <Text className="mb-4 text-base text-gray-600">
          <Text className="font-semibold text-gray-900">FinHub México</Text> es el primer ecosistema
          que unifica todos tus servicios financieros en un solo lugar, con herramientas
          inteligentes y una accesibilidad sin precedentes.
        </Text>
        {bulletPoints.map((point) => (
          <View key={point.title} className="mb-6 flex-row items-start gap-3">
            <Ionicons name={point.icon as any} size={22} color="#111827" />
            <View className="flex-1">
              <Text className="font-semibold text-gray-900">{point.title}</Text>
              <Text className="text-sm text-gray-600">{point.description}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <View className="px-6 pb-10">
        <Pressable
          onPress={onStart}
          accessibilityRole="button"
          accessibilityLabel="Continuar con registro"
          accessibilityHint="Abre el formulario para crear una cuenta"
          hitSlop={HIT_SLOP}
          className="flex-row items-center justify-between rounded-2xl bg-emerald-100 px-6 py-4">
          <Text className="text-base font-semibold text-gray-900">Empezar</Text>
          <Ionicons name="arrow-forward" size={20} color="#111827" />
        </Pressable>
      </View>
    </View>
  );
}
