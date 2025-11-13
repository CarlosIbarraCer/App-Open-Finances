import React from 'react';
import { View, Text, ScrollView, Pressable, Image } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import BranchScreen from './search/BranchScreen';
import InterestRateScreen from './search/InterestRateScreen';
import ExchangeRateScreen from './search/ExchangeRateScreen';
import ExchangeScreen from './search/ExchangeScreen';

type SearchView = 'list' | 'branch' | 'interest' | 'exchangeRate' | 'exchange';

type SearchScreenProps = {
  voiceFlightQuery?: string | null;
  onClearVoiceQuery?: () => void;
};

const options = [
  {
    view: 'branch' as const,
    title: 'Branch',
    description: 'Search for branch',
    art: 'https://illustrations.popsy.co/white/bank.png',
    icon: 'business-outline' as const,
  },
  {
    view: 'interest' as const,
    title: 'Interest rate',
    description: 'Search for interest rate',
    art: 'https://illustrations.popsy.co/white/stats.png',
    icon: 'trending-up-outline' as const,
  },
  {
    view: 'exchangeRate' as const,
    title: 'Exchange rate',
    description: 'Search for exchange rate',
    art: 'https://illustrations.popsy.co/white/trading.png',
    icon: 'swap-horizontal-outline' as const,
  },
  {
    view: 'exchange' as const,
    title: 'Exchange',
    description: 'Exchange amount of money',
    art: 'https://illustrations.popsy.co/white/team-up.png',
    icon: 'cash-outline' as const,
  },
];

const viewTitles: Record<SearchView, string> = {
  list: 'Search',
  branch: 'Branch',
  interest: 'Interest rate',
  exchangeRate: 'Exchange rate',
  exchange: 'Exchange',
};

export default function SearchScreen({ voiceFlightQuery, onClearVoiceQuery }: SearchScreenProps) {
  const [activeView, setActiveView] = React.useState<SearchView>('list');
  const [isDarkMode, setIsDarkMode] = React.useState(false);

  React.useEffect(() => {
    if (voiceFlightQuery) {
      setActiveView('list');
    }
  }, [voiceFlightQuery]);

  const backgroundClass = isDarkMode ? 'bg-zinc-900' : 'bg-white';
  const textPrimary = isDarkMode ? 'text-zinc-50' : 'text-gray-900';
  const textSecondary = isDarkMode ? 'text-zinc-400' : 'text-gray-500';
  const cardBackground = isDarkMode ? 'bg-zinc-800' : 'bg-white';
  const iconBg = isDarkMode ? 'bg-zinc-700' : 'bg-gray-100';

  const renderDetail = () => {
    switch (activeView) {
      case 'branch':
        return <BranchScreen />;
      case 'interest':
        return <InterestRateScreen />;
      case 'exchangeRate':
        return <ExchangeRateScreen />;
      case 'exchange':
        return <ExchangeScreen />;
      default:
        return null;
    }
  };

  const renderList = () => (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ paddingBottom: 32, paddingHorizontal: 24 }}>
      {voiceFlightQuery ? (
        <View className="mb-4 rounded-2xl border border-indigo-100 bg-indigo-50 px-4 py-3">
          <Text className="text-sm font-semibold text-indigo-900">
            {`Vuelo dictado: ${voiceFlightQuery}`}
          </Text>
          <Text className="text-xs text-indigo-900/80">
            Actualizamos tu búsqueda con el número recibido por voz.
          </Text>
          <Pressable
            onPress={() => onClearVoiceQuery?.()}
            accessibilityRole="button"
            accessibilityLabel="Borrar número dictado"
            className="mt-3 self-start rounded-full bg-white px-3 py-1.5">
            <Text className="text-xs font-semibold text-indigo-700">Borrar</Text>
          </Pressable>
        </View>
      ) : null}
      <View className={`rounded-3xl ${cardBackground} p-4`}>
        {options.map((option, idx) => (
          <Pressable
            key={option.title}
            onPress={() => setActiveView(option.view)}
            className={`flex-row items-center justify-between rounded-2xl ${cardBackground} px-4 py-5 ${
              idx < options.length - 1 ? 'mb-3' : ''
            }`}
            style={{
              shadowColor: '#A5B4FC',
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: 0.35,
              shadowRadius: 14,
              elevation: 8,
            }}>
            <View className="flex-1 flex-row items-center pr-4">
              <View className={`mr-4 h-12 w-12 items-center justify-center rounded-2xl ${iconBg}`}>
                <Ionicons name={option.icon} size={22} color={isDarkMode ? '#E0E7FF' : '#0F172A'} />
              </View>
              <View className="flex-1">
                <Text className={`text-lg font-semibold ${textPrimary}`}>{option.title}</Text>
                <Text className={`mt-1 text-sm ${textSecondary}`}>{option.description}</Text>
              </View>
            </View>
            <Image source={{ uri: option.art }} resizeMode="contain" className="h-20 w-20" />
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );

  const showBack = activeView !== 'list';

  return (
    <View className={`flex-1 ${backgroundClass}`}>
      <View className="px-6 pb-4 pt-14">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            {showBack ? (
              <Pressable
                className={`mr-3 h-10 w-10 items-center justify-center rounded-full ${
                  isDarkMode ? 'bg-zinc-800' : 'bg-gray-100'
                }`}
                onPress={() => setActiveView('list')}>
                <Ionicons
                  name="chevron-back"
                  size={20}
                  color={isDarkMode ? '#F3F4F6' : '#111827'}
                />
              </Pressable>
            ) : (
              <View className="mr-3 h-10 w-10" />
            )}
            <Text className={`text-3xl font-semibold ${textPrimary}`}>
              {viewTitles[activeView]}
            </Text>
          </View>
          <Pressable
            onPress={() => setIsDarkMode((prev) => !prev)}
            className={`h-10 w-10 items-center justify-center rounded-full ${
              isDarkMode ? 'bg-zinc-800' : 'bg-gray-100'
            }`}>
            <Ionicons
              name={isDarkMode ? 'sunny-outline' : 'moon-outline'}
              size={20}
              color={isDarkMode ? '#FCD34D' : '#0F172A'}
            />
          </Pressable>
        </View>
      </View>

      {activeView === 'list' ? renderList() : renderDetail()}
    </View>
  );
}
