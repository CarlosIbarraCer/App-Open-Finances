import React from 'react';
import { View, Text, TextInput, FlatList, Pressable } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Location from 'expo-location';

const initialRegion: Region = {
  latitude: 40.789623,
  longitude: -74.0565,
  latitudeDelta: 0.08,
  longitudeDelta: 0.08,
};

const markers = [
  {
    id: 1,
    title: 'Bank 1656 Union Street',
    coordinate: { latitude: 40.789623, longitude: -74.0565 },
  },
  { id: 2, title: 'Bank Secaucus', coordinate: { latitude: 40.7891, longitude: -74.0402 } },
  {
    id: 3,
    title: 'Bank 1657 Riverside Drive',
    coordinate: { latitude: 40.802, longitude: -74.0501 },
  },
  { id: 4, title: 'Bank Rutherford', coordinate: { latitude: 40.827, longitude: -74.1 } },
];

const branches = [
  { name: 'Bank 1656 Union Street', distance: '50 m' },
  { name: 'Bank Secaucus', distance: '1.2 km' },
  { name: 'Bank 1657 Riverside Drive', distance: '5.3 km' },
  { name: 'Bank Rutherford', distance: '700 m' },
  { name: 'Bank 1656 Union Street', distance: '300 m' },
];

export default function BranchScreen() {
  const [region, setRegion] = React.useState<Region>(initialRegion);
  const [userLocation, setUserLocation] = React.useState<Location.LocationObjectCoords | null>(
    null
  );
  const mapRef = React.useRef<MapView>(null);

  React.useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== Location.PermissionStatus.GRANTED) return;
      const current = await Location.getCurrentPositionAsync({});
      setUserLocation(current.coords);
      const updatedRegion = {
        latitude: current.coords.latitude,
        longitude: current.coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      };
      setRegion(updatedRegion);
      mapRef.current?.animateToRegion(updatedRegion, 800);
    })();
  }, []);

  return (
    <View className="flex-1">
      <MapView ref={mapRef} style={{ height: 260, width: '100%' }} region={region}>
        {markers.map((marker) => (
          <Marker key={marker.id} coordinate={marker.coordinate} title={marker.title} />
        ))}
        {userLocation && (
          <Marker
            coordinate={{ latitude: userLocation.latitude, longitude: userLocation.longitude }}
            title="Tu ubicación"
            pinColor="#3B82F6"
          />
        )}
      </MapView>
      {userLocation && (
        <Pressable
          onPress={() =>
            mapRef.current?.animateToRegion(
              {
                latitude: userLocation.latitude,
                longitude: userLocation.longitude,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
              },
              800
            )
          }
          className="absolute right-4 top-4 rounded-full bg-white p-3"
          style={{
            shadowColor: '#00000020',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 6,
            elevation: 5,
          }}>
          <Ionicons name="locate" size={18} color="#2563EB" />
        </Pressable>
      )}

      <View className="-mt-6 flex-1 rounded-t-[30px] bg-white px-6 pt-4">
        <View className="mb-4 flex-row items-center rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3">
          <Ionicons name="search-outline" size={18} color="#6B7280" />
          <TextInput
            placeholder="Bank"
            placeholderTextColor="#9CA3AF"
            className="ml-3 flex-1 text-base text-gray-900"
          />
        </View>

        <FlatList
          data={branches}
          keyExtractor={(item, index) => `${item.name}-${index}`}
          renderItem={({ item }) => (
            <View className="flex-row items-center justify-between border-b border-gray-100 py-4">
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
    </View>
  );
}
