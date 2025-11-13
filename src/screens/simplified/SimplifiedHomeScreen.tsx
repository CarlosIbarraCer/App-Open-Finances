import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

type SimplifiedHomeScreenProps = {
  userName: string;
  onTransfer: () => void;
  onPayServices: () => void;
};

const cards = [
  {
    id: 'debit',
    number: '*** 3276',
    label: 'De Débito',
    date: '07/28',
    colors: ['#6D4CFF', '#4B57F5'],
  },
  {
    id: 'credit',
    number: '*** 4167',
    label: 'De Crédito',
    date: '07/32',
    colors: ['#0F1A4F', '#07122F'],
  },
];

const actions = [
  {
    key: 'services',
    label: 'Pagar Servicios',
    icon: 'card-outline' as const,
    background: 'bg-[#E6EEFF]',
    color: '#2563EB',
  },
  {
    key: 'transfer',
    label: 'Transferir a otra persona',
    icon: 'swap-horizontal-outline' as const,
    background: 'bg-[#F4E9FF]',
    color: '#C026D3',
  },
];

const buildCardAccessibilityLabel = (card: (typeof cards)[number], holderName: string) => {
  const digits = card.number.replace(/[^\d]/g, '').slice(-4);
  const readableDigits = digits ? `terminación ${digits}` : `número ${card.number}`;
  return `Mostrar tarjeta ${card.label.toLowerCase()} de ${holderName}, ${readableDigits}, vence ${card.date}`;
};

export default function SimplifiedHomeScreen({
  userName,
  onTransfer,
  onPayServices,
}: SimplifiedHomeScreenProps) {
  return (
    <View className="flex-1">
      <View className="rounded-b-[32px] bg-[#070b15] px-6 pb-12 pt-14">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-sm text-white/70">Hola,</Text>
            <Text accessibilityRole="header" className="text-2xl font-semibold text-white">
              {userName}!
            </Text>
          </View>
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=facearea&w=120&h=120',
            }}
            className="h-12 w-12 rounded-full border-2 border-white/20"
            accessibilityRole="image"
            accessibilityLabel={`Foto de perfil de ${userName}`}
          />
        </View>
      </View>

      <View className="-mt-10 flex-1 rounded-t-[32px] bg-white px-6 pb-10 pt-8">
        <Text accessibilityRole="header" className="mb-4 text-2xl font-semibold text-gray-900">
          Tus Tarjetas <Text className="text-lg text-gray-500">(2)</Text>
        </Text>
        <View className="mb-8 flex-row gap-3">
          {cards.map((card) => (
            <View
              key={card.id}
              className="flex-1 rounded-3xl p-5"
              accessible
              accessibilityRole="text"
              accessibilityLabel={buildCardAccessibilityLabel(card, userName)}
              accessibilityHint="Información de referencia"
              importantForAccessibility="yes"
              style={{
                backgroundColor: card.colors[0],
                shadowColor: card.colors[0],
                shadowOpacity: 0.25,
                shadowRadius: 12,
                shadowOffset: { width: 0, height: 6 },
                elevation: 4,
              }}>
              <View className="mb-2 flex-row items-center justify-between">
                <Text className="text-sm font-semibold text-white">{card.number}</Text>
                <View className="h-5 w-5 rounded-full border-2 border-white/70" />
              </View>
              <Text className="text-xs text-white/80">{card.label}</Text>
              <Text className="text-xs text-white/70">{card.date}</Text>
              <Text className="mt-8 text-2xl font-semibold text-white">{userName}</Text>
            </View>
          ))}
        </View>

        <View className="mb-8 flex-row gap-4">
          {actions.map((action) => (
            <TouchableOpacity
              key={action.key}
              onPress={() => {
                if (action.key === 'transfer') {
                  onTransfer();
                }
                if (action.key === 'services') {
                  onPayServices();
                }
              }}
              accessibilityRole="button"
              accessibilityLabel={action.label}
              accessibilityHint={
                action.key === 'transfer'
                  ? 'Abre el flujo simplificado de transferencias'
                  : `Permite ${action.label.toLowerCase()}`
              }
              className={`flex-1 rounded-3xl ${action.background} px-4 py-6`}
              style={{ minHeight: 150 }}>
              <View className="mb-3 h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm">
                <Ionicons name={action.icon} size={22} color={action.color} />
              </View>
              <Text className="text-base font-semibold leading-6 text-gray-800">
                {action.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Consultar saldos y movimientos"
          accessibilityHint="Revisa los últimos cargos y depósitos"
          className="rounded-3xl bg-gray-100 px-4 py-6"
          style={{ minHeight: 150 }}>
          <View className="mb-3 h-12 w-12 items-center justify-center rounded-2xl bg-black/80">
            <Ionicons name="wallet-outline" size={22} color="#fff" />
          </View>
          <Text className="text-base font-semibold text-gray-900">
            Consultar Saldos y Movimientos
          </Text>
          <Text className="mt-1 text-sm text-gray-500">Últimos cargos y depósitos</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
