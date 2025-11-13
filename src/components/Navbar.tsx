import React from 'react';
import { View, Text, TouchableOpacity, LayoutAnimation, Platform, UIManager } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useReduceMotionPreference } from '../hooks/useReduceMotionPreference';

export type DashboardTab = 'home' | 'search' | 'investments' | 'loans' | 'settings';

type NavbarProps = {
  activeTab: DashboardTab;
  onChange: (tab: DashboardTab) => void;
  appearance?: 'dark' | 'light';
};

const tabs: {
  key: DashboardTab;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  activeIcon: keyof typeof Ionicons.glyphMap;
}[] = [
  { key: 'home', label: 'Home', icon: 'home-outline', activeIcon: 'home' },
  { key: 'search', label: 'Search', icon: 'search-outline', activeIcon: 'search' },
  {
    key: 'investments',
    label: 'Portfolio',
    icon: 'trending-up-outline',
    activeIcon: 'trending-up',
  },
  { key: 'loans', label: 'Loans', icon: 'card-outline', activeIcon: 'card' },
  { key: 'settings', label: 'Config', icon: 'settings-outline', activeIcon: 'settings' },
];

export default function Navbar({ activeTab, onChange, appearance = 'dark' }: NavbarProps) {
  const isLight = appearance === 'light';
  const reduceMotion = useReduceMotionPreference();

  React.useEffect(() => {
    if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }, []);

  React.useEffect(() => {
    if (!reduceMotion) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }
  }, [activeTab, reduceMotion]);

  return (
    <View className="bg-white px-4 pb-6 pt-4">
      <View
        className={`flex-row items-center justify-between rounded-[32px] border px-3 py-2.5 ${
          isLight ? 'border-gray-100 bg-white' : 'border-gray-100 bg-[#f7f8fc]'
        }`}
        style={{
          shadowColor: '#CBD5F5',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.2,
          shadowRadius: 12,
          elevation: 6,
        }}>
        {tabs.map((tab) => {
          const isActive = tab.key === activeTab;
          return (
            <TouchableOpacity
              key={tab.key}
              onPress={() => onChange(tab.key)}
              accessibilityRole="tab"
              accessibilityLabel={tab.label}
              accessibilityState={{ selected: isActive }}
              className={`mx-1 flex-1 flex-row items-center justify-center rounded-2xl py-2 ${
                isActive ? (isLight ? 'bg-indigo-500' : 'bg-gray-900') : ''
              }`}
              style={{ flexGrow: isActive ? 1.2 : 0.85 }}>
              <Ionicons
                name={isActive ? tab.activeIcon : tab.icon}
                size={22}
                color={isActive ? '#FFFFFF' : isLight ? '#94A3B8' : '#6B7280'}
              />
              {isActive && (
                <Text className="ml-2 text-sm font-semibold text-white">{tab.label}</Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
