import React from 'react';
import { View, Text, ScrollView } from 'react-native';

const interests = [
  { type: 'Individual customers', deposit: '1m', rate: '4.50%' },
  { type: 'Corporate customers', deposit: '2m', rate: '5.50%' },
  { type: 'Individual customers', deposit: '6m', rate: '2.50%' },
  { type: 'Corporate customers', deposit: '8m', rate: '6.50%' },
  { type: 'Individual customers', deposit: '12m', rate: '5.90%' },
  { type: 'Corporate customers', deposit: '3m', rate: '4.60%' },
  { type: 'Individual customers', deposit: '9m', rate: '5.10%' },
  { type: 'Corporate customers', deposit: '7m', rate: '6.80%' },
];

export default function InterestRateScreen() {
  return (
    <View className="flex-1 rounded-t-[30px] bg-white px-6 pt-4">
      <View className="mb-3 flex-row justify-between">
        <Text className="w-1/2 text-sm font-semibold uppercase tracking-wide text-gray-400">
          Interest kind
        </Text>
        <Text className="w-1/4 text-sm font-semibold uppercase tracking-wide text-gray-400">
          Deposit
        </Text>
        <Text className="w-1/4 text-right text-sm font-semibold uppercase tracking-wide text-gray-400">
          Rate
        </Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        {interests.map((item, index) => (
          <View
            key={`${item.type}-${index}`}
            className="flex-row items-center justify-between border-b border-gray-100 py-4">
            <Text className="w-1/2 text-base text-gray-900">{item.type}</Text>
            <Text className="w-1/4 text-base text-gray-500">{item.deposit}</Text>
            <Text className="w-1/4 text-right text-base font-semibold text-gray-900">
              {item.rate}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
