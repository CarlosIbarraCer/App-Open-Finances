import React from 'react';
import { View, Text, FlatList } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

const branches = [
  { name: 'Bank 1656 Union Street', distance: '50 m' },
  { name: 'Bank Secaucus', distance: '1.2 km' },
  { name: 'Bank 1657 Riverside Drive', distance: '5.3 km' },
  { name: 'Bank Rutherford', distance: '700 m' },
];

export default function BranchScreen() {
  return (
    <View className="flex-1 bg-white px-6 py-8">
      <Text className="mb-4 text-center text-lg font-semibold text-gray-900">
        Mapas no disponibles en web
      </Text>
      <Text className="mb-6 text-center text-sm text-gray-500">
        Puedes seguir viendo nuestras sucursales y detalles de distancia.
      </Text>
      <FlatList
        data={branches}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <View className="mb-4 flex-row items-center justify-between rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4">
            <View className="flex-row items-center">
              <Ionicons name="location-outline" size={18} color="#2563EB" />
              <Text className="ml-3 text-base font-semibold text-gray-900">{item.name}</Text>
            </View>
            <Text className="text-sm text-gray-500">{item.distance}</Text>
          </View>
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
