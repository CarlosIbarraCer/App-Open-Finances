import React from 'react';
import { View, Text, ScrollView, Image } from 'react-native';

const rates = [
  { country: 'Vietnam', buy: '1.403', sell: '1.746', flag: 'https://flagcdn.com/w40/vn.png' },
  { country: 'Nicaragua', buy: '9.123', sell: '12.09', flag: 'https://flagcdn.com/w40/ni.png' },
  { country: 'Korea', buy: '3.704', sell: '5.151', flag: 'https://flagcdn.com/w40/kr.png' },
  { country: 'Russia', buy: '116.0', sell: '144.4', flag: 'https://flagcdn.com/w40/ru.png' },
  { country: 'China', buy: '1.725', sell: '2.234', flag: 'https://flagcdn.com/w40/cn.png' },
  { country: 'Portugal', buy: '1.403', sell: '1.746', flag: 'https://flagcdn.com/w40/pt.png' },
  { country: 'France', buy: '23.45', sell: '34.56', flag: 'https://flagcdn.com/w40/fr.png' },
];

export default function ExchangeRateScreen() {
  return (
    <View className="flex-1 rounded-t-[30px] bg-white px-6 pt-4">
      <View className="mb-3 flex-row justify-between">
        <Text className="w-1/2 text-sm font-semibold uppercase tracking-wide text-gray-400">
          Country
        </Text>
        <Text className="w-1/4 text-sm font-semibold uppercase tracking-wide text-gray-400">
          Buy
        </Text>
        <Text className="w-1/4 text-right text-sm font-semibold uppercase tracking-wide text-gray-400">
          Sell
        </Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        {rates.map((item) => (
          <View
            key={item.country}
            className="flex-row items-center justify-between border-b border-gray-100 py-4">
            <View className="w-1/2 flex-row items-center">
              <Image source={{ uri: item.flag }} className="mr-3 h-6 w-10 rounded-md" />
              <Text className="text-base text-gray-900">{item.country}</Text>
            </View>
            <Text className="w-1/4 text-base text-gray-500">{item.buy}</Text>
            <Text className="w-1/4 text-right text-base font-semibold text-gray-900">
              {item.sell}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
