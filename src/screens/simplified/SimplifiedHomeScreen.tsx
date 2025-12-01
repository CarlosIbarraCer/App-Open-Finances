import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import type { BankAccountSummary } from '../../api/bank';

type SimplifiedHomeScreenProps = {
  userName: string;
  userEmail?: string;
  onTransfer: () => void;
  onPayServices: () => void;
  onExitSimplified?: () => void;
  onViewTransactions?: () => void;
  bankAccount?: Pick<BankAccountSummary, 'balance_available' | 'account_id'> | null;
  bankSyncing?: boolean;
  bankError?: string | null;
  onRefreshBank?: () => void;
};

type SimplifiedCard = {
  id: string;
  number: string;
  label: string;
  date: string;
  colors: [string, string];
  balance?: string;
};

const cards: SimplifiedCard[] = [
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

const buildCardAccessibilityLabel = (card: SimplifiedCard, holderName: string) => {
  const digits = card.number.replace(/[^\d]/g, '').slice(-4);
  const readableDigits = digits ? `terminación ${digits}` : `número ${card.number}`;
  return `Mostrar tarjeta ${card.label.toLowerCase()} de ${holderName}, ${readableDigits}, vence ${card.date}`;
};

const formatCurrency = (value?: string) => {
  const amount = Number(value ?? 0);
  if (Number.isNaN(amount)) {
    return '$0.00';
  }
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(amount);
};

export default function SimplifiedHomeScreen({
  userName,
  userEmail,
  onTransfer,
  onPayServices,
  onExitSimplified,
  onViewTransactions,
  bankAccount,
  bankSyncing,
  bankError,
  onRefreshBank,
}: SimplifiedHomeScreenProps) {
  const bankCard =
    bankAccount &&
    ({
      id: 'linked-bank',
      number: `Cuenta ••••${String(bankAccount.account_id).slice(-4)}`,
      label: 'Cuenta conectada',
      date: userEmail ?? 'Disponible',
      colors: ['#022c22', '#065f46'],
      balance: formatCurrency(bankAccount.balance_available),
    } as const);

  const displayedCards = bankCard ? [bankCard, cards[1]] : cards;

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
        <View className="mb-4 flex-row items-center justify-between">
          <Text accessibilityRole="header" className="text-2xl font-semibold text-gray-900">
            Tus Tarjetas <Text className="text-lg text-gray-500">(2)</Text>
          </Text>
          {onExitSimplified ? (
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="Volver a la vista completa"
              accessibilityHint="Abre la interfaz completa con todas las funciones"
              onPress={onExitSimplified}
              className="rounded-full border border-gray-200 px-4 py-2">
              <Text className="text-xs font-semibold uppercase tracking-wide text-gray-600">
                Vista completa
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>
        <View className="mb-8 flex-row gap-3">
          {displayedCards.map((card) => (
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
              {card.balance ? (
                <View className="mt-6">
                  <Text className="text-xs text-white/70">Saldo disponible</Text>
                  <Text className="text-3xl font-semibold text-white">{card.balance}</Text>
                </View>
              ) : (
                <Text className="mt-8 text-2xl font-semibold text-white">{userName}</Text>
              )}
            </View>
          ))}
        </View>
        <View className="mb-6">
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Actualizar saldo bancario"
            accessibilityHint="Sincroniza la cuenta conectada"
            disabled={bankSyncing}
            onPress={onRefreshBank}
            className={`rounded-3xl border px-4 py-3 ${
              bankSyncing ? 'bg-gray-100 border-gray-200' : 'bg-gray-50 border-gray-200'
            }`}>
            <View className="flex-row items-center justify-between">
              <Text className="text-sm font-semibold text-gray-800">
                {bankSyncing ? 'Sincronizando cuenta...' : 'Actualizar saldo bancario'}
              </Text>
              <Ionicons
                name={bankSyncing ? 'time-outline' : 'refresh-outline'}
                size={18}
                color="#0f172a"
              />
            </View>
            {bankError ? <Text className="mt-2 text-xs text-rose-500">{bankError}</Text> : null}
          </TouchableOpacity>
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
          onPress={onViewTransactions}
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
