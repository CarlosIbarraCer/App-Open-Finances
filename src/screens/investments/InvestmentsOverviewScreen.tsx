import React from 'react';
import { ScrollView, View, Text, Pressable } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';

type InvestmentsOverviewScreenProps = {
  onOpenCetes: () => void;
};

type PortfolioPosition = {
  name: string;
  type: string;
  amount: string;
  change: string;
  color: string;
};

type Insight = {
  label: string;
  value: string;
  detail: string;
};

type Goal = {
  label: string;
  progress: string;
  status: string;
};

const positions: PortfolioPosition[] = [
  {
    name: 'Fondo Tech MX',
    type: 'ETF • Innovación',
    amount: '$12,480',
    change: '+8.4%',
    color: '#bfdbfe',
  },
  {
    name: 'Bonos Verdes',
    type: 'Deuda • ESG',
    amount: '$9,210',
    change: '+3.1%',
    color: '#bbf7d0',
  },
  {
    name: 'Capital Venture',
    type: 'Privado • Serie B',
    amount: '$5,600',
    change: '+14.7%',
    color: '#e9d5ff',
  },
];

const portfolioInsights: Insight[] = [
  { label: 'Rentabilidad 12m', value: '+18.3%', detail: '4% sobre benchmark' },
  { label: 'Riesgo controlado', value: 'Beta 0.82', detail: 'Balanceado' },
  { label: 'Liquidez T+1', value: '72%', detail: 'Fondos disponibles' },
];

const goals: Goal[] = [
  { label: 'Fondo de emergencia', progress: '85% completado', status: 'Dos aportes pendientes' },
  { label: 'Meta educación', progress: '62% completado', status: 'Aumentó 3.1% este mes' },
];

const performanceData = [46, 60, 55, 72, 64, 86];

export default function InvestmentsOverviewScreen({ onOpenCetes }: InvestmentsOverviewScreenProps) {
  return (
    <View className="flex-1 bg-[#f5f7fb]">
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 48 }}>
        <View className="px-6 pb-12 pt-16">
          <View className="mb-8 flex-row items-center justify-between">
            <View>
              <Text className="text-xs uppercase tracking-[0.25em] text-gray-400">
                Open Finances
              </Text>
              <Text className="text-2xl font-bold text-gray-900">Tu portafolio inteligente</Text>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Acciones recomendadas"
              accessibilityHint="Abre accesos directos de inversiones"
              className="h-11 w-11 items-center justify-center rounded-2xl border border-gray-200 bg-white">
              <Ionicons name="sparkles-outline" size={20} color="#6366f1" />
            </Pressable>
          </View>

          <LinearGradient
            colors={['#eef2ff', '#dbeafe']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              borderRadius: 32,
              padding: 24,
              marginBottom: 20,
              borderWidth: 1,
              borderColor: 'rgba(99,102,241,0.15)',
            }}>
            <View className="mb-6 flex-row items-start justify-between">
              <View>
                <Text className="text-sm text-gray-600">Valor del portafolio</Text>
                <Text className="text-4xl font-semibold text-gray-900">$27,290.20</Text>
              </View>
              <View className="rounded-full border border-emerald-200 bg-white/70 px-3 py-1.5">
                <Text className="text-sm font-semibold text-emerald-600">+5.13% mensual</Text>
              </View>
            </View>
            <View className="flex-row gap-3">
              <View className="flex-1 rounded-2xl border border-white/70 bg-white/80 p-4">
                <Text className="mb-1 text-xs text-gray-500">Flujo disponible</Text>
                <Text className="text-lg font-semibold text-gray-900">$4,500</Text>
              </View>
              <View className="flex-1 rounded-2xl border border-white/70 bg-white/80 p-4">
                <Text className="mb-1 text-xs text-gray-500">Meta anual</Text>
                <Text className="text-lg font-semibold text-gray-900">72% completado</Text>
              </View>
            </View>
            <Pressable
              onPress={onOpenCetes}
              accessibilityRole="button"
              accessibilityLabel="Invertir en CETES"
              accessibilityHint="Abre el flujo para invertir en CETES"
              className="mt-5 flex-row items-center justify-between rounded-2xl bg-indigo-600 px-5 py-4 shadow-lg shadow-indigo-200/60">
              <View>
                <Text className="text-xs uppercase tracking-wide text-indigo-100">
                  Nueva inversión
                </Text>
                <Text className="text-lg font-semibold text-white">Invertir en CETES</Text>
              </View>
              <Ionicons name="arrow-forward" size={22} color="#fff" />
            </Pressable>
          </LinearGradient>

          <View className="mb-5 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm shadow-indigo-50">
            <View className="mb-4 flex-row items-center justify-between">
              <Text className="text-lg font-semibold text-gray-900">Performance dinámico</Text>
              <Text className="text-sm text-gray-400">Últimos 6 meses</Text>
            </View>
            <View className="h-32 flex-row items-end gap-2">
              {performanceData.map((height, index) => (
                <View
                  key={`bar-${index}`}
                  className="flex-1 rounded-2xl"
                  style={{
                    height,
                    backgroundColor: index === performanceData.length - 1 ? '#c7d2fe' : '#93c5fd',
                  }}
                />
              ))}
            </View>
          </View>

          <View className="mb-5 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm shadow-indigo-50">
            <View className="mb-4 flex-row items-center justify-between">
              <Text className="text-lg font-semibold text-gray-900">
                Distribución del portafolio
              </Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Optimizar portafolio"
                accessibilityHint="Abre opciones para redistribuir inversiones">
                <Text className="text-sm font-semibold text-indigo-500">Optimizar</Text>
              </Pressable>
            </View>
            {positions.map((position, index) => (
              <View
                key={position.name}
                className={`flex-row items-center justify-between py-4 ${
                  index < positions.length - 1 ? 'border-b border-gray-100' : ''
                }`}>
                <View className="flex-1 flex-row items-center gap-3">
                  <View
                    className="h-12 w-12 items-center justify-center rounded-2xl"
                    style={{ backgroundColor: position.color }}>
                    <MaterialCommunityIcons name="fintech" size={22} color="#1f2937" />
                  </View>
                  <View className="flex-1">
                    <Text className="font-semibold text-gray-900">{position.name}</Text>
                    <Text className="text-xs text-gray-500">{position.type}</Text>
                  </View>
                </View>
                <View className="items-end">
                  <Text className="font-semibold text-gray-800">{position.amount}</Text>
                  <Text className="text-xs text-emerald-500">{position.change}</Text>
                </View>
              </View>
            ))}
          </View>

          <View className="mb-5 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm shadow-indigo-50">
            <Text className="mb-4 text-lg font-semibold text-gray-900">Insights accionables</Text>
            <View className="-mx-2 flex-row">
              {portfolioInsights.map((insight) => (
                <View
                  key={insight.label}
                  className="mx-2 flex-1 rounded-2xl border border-gray-100 bg-[#f9fbff] p-4">
                  <Text className="mb-1 text-xs uppercase tracking-wide text-gray-400">
                    {insight.label}
                  </Text>
                  <Text className="mb-1 text-2xl font-semibold text-gray-900">{insight.value}</Text>
                  <Text className="text-xs text-gray-500">{insight.detail}</Text>
                </View>
              ))}
            </View>
          </View>

          <View className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm shadow-indigo-50">
            <View className="mb-4 flex-row items-center justify-between">
              <Text className="text-lg font-semibold text-gray-900">Objetivos</Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Crear nuevo objetivo"
                accessibilityHint="Agrega un nuevo objetivo financiero"
                className="flex-row items-center gap-1 rounded-full border border-gray-200 px-3 py-1.5">
                <Ionicons name="add-circle-outline" size={18} color="#6366f1" />
                <Text className="text-sm font-semibold text-indigo-500">Crear nuevo</Text>
              </Pressable>
            </View>
            {goals.map((goal, index) => (
              <View
                key={goal.label}
                className={`rounded-2xl border border-gray-100 bg-[#fefefe] p-4 ${
                  index > 0 ? 'mt-3' : ''
                }`}>
                <Text className="text-sm font-semibold text-gray-900">{goal.label}</Text>
                <Text className="text-xs text-gray-500">{goal.progress}</Text>
                <View className="mt-3 h-2 overflow-hidden rounded-full bg-gray-100">
                  <View
                    className="h-full rounded-full bg-gradient-to-r from-indigo-400 to-cyan-400"
                    style={{
                      width: index === 0 ? '85%' : '62%',
                    }}
                  />
                </View>
                <Text className="mt-2 text-xs text-gray-500">{goal.status}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
