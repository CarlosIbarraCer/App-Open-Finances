import React from 'react';
import { View, Text, TextInput, Image, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function ExchangeScreen() {
  const [fromAmount, setFromAmount] = React.useState('1000');
  const [toAmount, setToAmount] = React.useState('1122000');
  const fromCurrency = 'USD';
  const toCurrency = 'KRW';

  return (
    <View className="flex-1 rounded-t-[30px] bg-white px-6 pt-4">
      <Image
        source={{ uri: 'https://illustrations.popsy.co/white/money-exchange.png' }}
        className="mb-6 h-48 w-full"
        resizeMode="contain"
      />
      <View className="mb-4 flex-row items-center justify-center gap-3">
        <View className="rounded-full bg-indigo-100 p-3">
          <Ionicons name="wallet-outline" size={22} color="#4338CA" />
        </View>
        <View className="rounded-full bg-blue-100 p-3">
          <Ionicons name="swap-horizontal-outline" size={22} color="#1D4ED8" />
        </View>
        <View className="rounded-full bg-emerald-100 p-3">
          <Ionicons name="cash-outline" size={22} color="#0F766E" />
        </View>
      </View>
      <View
        className="rounded-3xl bg-white p-5"
        style={{
          shadowColor: '#E5E7EB',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.25,
          shadowRadius: 10,
          elevation: 4,
        }}>
        <View className="flex-row items-center justify-between rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3">
          <TextInput
            value={fromAmount}
            onChangeText={setFromAmount}
            keyboardType="numeric"
            className="flex-1 text-base font-semibold text-gray-900"
          />
          <View className="ml-3 flex-row items-center">
            <Text className="text-base font-semibold text-gray-900">{fromCurrency}</Text>
            <Ionicons name="chevron-down" size={16} color="#9CA3AF" className="ml-1" />
          </View>
        </View>

        <View className="my-4 items-center">
          <Ionicons name="swap-vertical" size={24} color="#111827" />
        </View>

        <View className="flex-row items-center justify-between rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3">
          <TextInput
            value={toAmount}
            onChangeText={setToAmount}
            keyboardType="numeric"
            className="flex-1 text-base font-semibold text-gray-900"
          />
          <View className="ml-3 flex-row items-center">
            <Text className="text-base font-semibold text-gray-900">{toCurrency}</Text>
            <Ionicons name="chevron-down" size={16} color="#9CA3AF" className="ml-1" />
          </View>
        </View>

        <Text className="mt-4 text-sm text-gray-500">Currency rate 1 USD = 1122 KRW</Text>

        <TouchableOpacity className="mt-6 rounded-2xl bg-gray-900 py-4">
          <Text className="text-center text-base font-semibold text-white">Exchange</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
