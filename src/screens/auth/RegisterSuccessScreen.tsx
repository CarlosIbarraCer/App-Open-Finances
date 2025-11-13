import React from 'react';
import { AccessibilityInfo, Pressable, ScrollView, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';

type RegisterSuccessScreenProps = {
  userName: string;
  age?: number;
  onBack: () => void;
  onChooseSimplified: () => void;
  onKeepDefault: () => void;
};

const SIMPLIFIED_AGE_THRESHOLD = 60;

const HIT_SLOP = { top: 12, left: 12, right: 12, bottom: 12 };

export default function RegisterSuccessScreen({
  userName,
  age,
  onBack,
  onChooseSimplified,
  onKeepDefault,
}: RegisterSuccessScreenProps) {
  const qualifiesForSimplified = typeof age === 'number' && age >= SIMPLIFIED_AGE_THRESHOLD;

  React.useEffect(() => {
    AccessibilityInfo.announceForAccessibility('Cuenta creada exitosamente');
  }, []);

  return (
    <View className="flex-1 bg-white">
      <LinearGradient colors={['#46c3db', '#60dbb8']} className="pb-8 pt-14">
        <View className="flex-row items-center justify-between px-6">
          <Pressable
            onPress={onBack}
            accessibilityRole="button"
            accessibilityLabel="Regresar"
            accessibilityHint="Permite editar la información antes de confirmar"
            hitSlop={HIT_SLOP}
            className="flex-row items-center gap-2 rounded-full bg-white/20 px-4 py-2">
            <Ionicons name="arrow-back" size={18} color="#fff" />
            <Text className="text-sm font-semibold text-white">Retroceder</Text>
          </Pressable>
          <Ionicons name="checkmark-circle-outline" size={22} color="#fff" />
        </View>
        <View className="px-6 pt-6">
          <Text className="text-sm text-white/80">Buenos días</Text>
          <Text className="text-2xl font-semibold text-white">{userName}</Text>
        </View>
      </LinearGradient>

      <ScrollView className="flex-1 px-6 pt-8" contentContainerStyle={{ paddingBottom: 32 }}>
        <Text className="mb-3 text-2xl font-semibold text-gray-900">
          Cuenta creada exitosamente
        </Text>
        {qualifiesForSimplified ? (
          <Text className="text-base text-gray-600">
            Tu cuenta ha sido creada con éxito, sin embargo hemos notado que ingresaste una edad
            avanzada. Confírmanos si deseas cambiar a una vista más simplificada de la aplicación.{' '}
            <Text className="font-semibold text-gray-900">
              (No te preocupes, podrás cambiarla más adelante si gustas)
            </Text>
          </Text>
        ) : (
          <Text className="text-base text-gray-600">
            Tu cuenta está lista. Si buscas una experiencia más sencilla siempre podrás cambiar a la
            vista simplificada desde tu perfil.
          </Text>
        )}

        <View className="mt-8 gap-4">
          <Pressable
            onPress={onChooseSimplified}
            accessibilityRole="button"
            accessibilityLabel="Activar vista simplificada"
            accessibilityHint="Usa la interfaz simplificada recomendada"
            hitSlop={HIT_SLOP}
            className="flex-row items-center justify-between rounded-2xl bg-emerald-100 px-6 py-4">
            <Text className="text-base font-semibold text-gray-900">
              Sí, deseo una vista simplificada
            </Text>
            <Ionicons name="arrow-forward" size={20} color="#111827" />
          </Pressable>

          <Pressable
            onPress={onKeepDefault}
            accessibilityRole="button"
            accessibilityLabel="Mantener vista normal"
            accessibilityHint="Continúa con la experiencia completa"
            hitSlop={HIT_SLOP}
            className="flex-row items-center justify-between rounded-2xl border border-gray-300 px-6 py-4">
            <Text className="text-base font-semibold text-gray-900">
              No, quiero probar la vista normal
            </Text>
            <Ionicons name="remove-outline" size={20} color="#111827" />
          </Pressable>
        </View>

        {!qualifiesForSimplified && (
          <Text className="mt-6 text-xs text-gray-500">
            Continuaremos con la experiencia completa. Puedes ajustar la vista en tu perfil si lo
            deseas.
          </Text>
        )}
      </ScrollView>
    </View>
  );
}
