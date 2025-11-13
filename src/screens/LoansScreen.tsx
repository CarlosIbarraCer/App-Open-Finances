import React from 'react';
import { ScrollView, View, Text, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

type LoanSummary = {
  name: string;
  nextPayment: string;
  amount: string;
  rate: string;
  progress: number;
  color: string;
};

type Reminder = {
  title: string;
  detail: string;
  icon: keyof typeof Ionicons.glyphMap;
};

type Action = {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  description: string;
};

const loans: LoanSummary[] = [
  {
    name: 'Crédito hipotecario',
    nextPayment: '15 Mar 2024',
    amount: '$12,400',
    rate: '6.9% fija',
    progress: 72,
    color: '#93c5fd',
  },
  {
    name: 'Línea empresarial',
    nextPayment: '03 Mar 2024',
    amount: '$28,900',
    rate: '8.4% variable',
    progress: 48,
    color: '#c4b5fd',
  },
];

const reminders: Reminder[] = [
  {
    title: 'Pagos programados',
    detail: 'Dos transferencias esta semana',
    icon: 'calendar-outline',
  },
  {
    title: 'Documentos pendientes',
    detail: 'Actualiza estados financieros',
    icon: 'document-text-outline',
  },
];

const actions: Action[] = [
  {
    title: 'Solicitar liquidez',
    icon: 'cash-outline',
    description: 'Resolvemos en menos de 5 minutos',
  },
  {
    title: 'Refinanciar saldo',
    icon: 'swap-horizontal-outline',
    description: 'Disminuye tu mensualidad',
  },
];

export default function LoansScreen() {
  return (
    <View className="flex-1 bg-[#f5f7fb]">
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 48 }}>
        <View className="px-6 pb-12 pt-16">
          <View className="mb-8 flex-row items-center justify-between">
            <View>
              <Text className="text-xs uppercase tracking-[0.25em] text-gray-400">
                Soluciones de liquidez
              </Text>
              <Text className="text-2xl font-bold text-gray-900">Préstamos y líneas activas</Text>
            </View>
            <Pressable className="h-11 w-11 items-center justify-center rounded-2xl border border-gray-200 bg-white">
              <Ionicons name="chatbubbles-outline" size={20} color="#0f172a" />
            </Pressable>
          </View>

          <LinearGradient
            colors={['#e0f2fe', '#e9d5ff']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              borderRadius: 32,
              padding: 24,
              marginBottom: 20,
              borderWidth: 1,
              borderColor: 'rgba(148,163,184,0.25)',
            }}>
            <View className="mb-6 flex-row items-start justify-between">
              <View>
                <Text className="text-sm text-gray-600">Deuda consolidada</Text>
                <Text className="text-4xl font-semibold text-gray-900">$41,300</Text>
              </View>
              <View className="items-end">
                <Text className="text-xs uppercase tracking-wide text-gray-500">
                  Capacidad libre
                </Text>
                <Text className="text-lg font-semibold text-emerald-600">$18,700</Text>
              </View>
            </View>
            <View className="flex-row gap-3">
              <View className="flex-1 rounded-2xl border border-white/70 bg-white/90 p-4">
                <Text className="mb-1 text-xs text-gray-500">Promedio tasa</Text>
                <Text className="text-xl font-semibold text-gray-900">7.4%</Text>
              </View>
              <View className="flex-1 rounded-2xl border border-white/70 bg-white/90 p-4">
                <Text className="mb-1 text-xs text-gray-500">Próximo pago</Text>
                <Text className="text-xl font-semibold text-gray-900">$5,320</Text>
              </View>
            </View>
            <Pressable className="mt-5 flex-row items-center justify-between rounded-2xl bg-gray-900 px-5 py-4">
              <View>
                <Text className="text-xs uppercase tracking-wide text-gray-300">Simulador</Text>
                <Text className="text-lg font-semibold text-white">Explorar nuevas líneas</Text>
              </View>
              <Ionicons name="arrow-forward" size={20} color="#fff" />
            </Pressable>
          </LinearGradient>

          {loans.map((loan) => (
            <View
              key={loan.name}
              className="mb-4 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm shadow-indigo-50">
              <View className="mb-4 flex-row items-center gap-3">
                <View
                  className="h-12 w-12 items-center justify-center rounded-2xl"
                  style={{ backgroundColor: loan.color }}>
                  <MaterialCommunityIcons name="bank" size={22} color="#0f172a" />
                </View>
                <View className="flex-1">
                  <Text className="font-semibold text-gray-900">{loan.name}</Text>
                  <Text className="text-xs text-gray-500">Próximo pago {loan.nextPayment}</Text>
                </View>
                <Pressable className="h-10 w-10 items-center justify-center rounded-2xl border border-gray-200 bg-white">
                  <Ionicons name="chevron-forward" size={18} color="#111827" />
                </Pressable>
              </View>
              <View className="mb-2 flex-row justify-between">
                <Text className="text-xs text-gray-500">Saldo</Text>
                <Text className="font-semibold text-gray-900">{loan.amount}</Text>
              </View>
              <View className="mb-2 flex-row justify-between">
                <Text className="text-xs text-gray-500">Tasa</Text>
                <Text className="text-gray-800">{loan.rate}</Text>
              </View>
              <View className="h-2 overflow-hidden rounded-full bg-gray-100">
                <View
                  className="h-full rounded-full"
                  style={{ width: `${loan.progress}%`, backgroundColor: loan.color }}
                />
              </View>
              <Text className="mt-2 text-xs text-gray-500">{loan.progress}% amortizado</Text>
            </View>
          ))}

          <View className="mb-6 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm shadow-indigo-50">
            <View className="mb-4 flex-row items-center justify-between">
              <Text className="text-lg font-semibold text-gray-900">Recordatorios</Text>
              <Pressable className="flex-row items-center gap-1">
                <Ionicons name="refresh" size={16} color="#2563eb" />
                <Text className="text-sm font-semibold text-indigo-500">Sincronizar</Text>
              </Pressable>
            </View>
            {reminders.map((reminder, index) => (
              <View
                key={reminder.title}
                className={`flex-row items-center justify-between py-4 ${
                  index < reminders.length - 1 ? 'border-b border-gray-100' : ''
                }`}>
                <View className="flex-1 flex-row items-center gap-3">
                  <View className="h-11 w-11 items-center justify-center rounded-2xl border border-gray-100 bg-gray-50">
                    <Ionicons name={reminder.icon} size={20} color="#0f172a" />
                  </View>
                  <View className="flex-1">
                    <Text className="font-semibold text-gray-900">{reminder.title}</Text>
                    <Text className="text-xs text-gray-500">{reminder.detail}</Text>
                  </View>
                </View>
                <Ionicons name="arrow-forward-circle" size={26} color="#6366f1" />
              </View>
            ))}
          </View>

          <View className="flex-row gap-4">
            {actions.map((action) => (
              <Pressable
                key={action.title}
                className="flex-1 rounded-3xl border border-gray-100 bg-white p-4 shadow-sm shadow-indigo-50">
                <View className="mb-3 flex-row items-center gap-2">
                  <View className="h-10 w-10 items-center justify-center rounded-2xl bg-indigo-50">
                    <Ionicons name={action.icon} size={20} color="#4338ca" />
                  </View>
                  <Text className="font-semibold text-gray-900">{action.title}</Text>
                </View>
                <Text className="text-sm text-gray-500">{action.description}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
