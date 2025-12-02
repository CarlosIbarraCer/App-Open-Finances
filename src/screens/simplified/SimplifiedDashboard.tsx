import React from 'react';
import { AccessibilityInfo, TouchableOpacity, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import SimplifiedHomeScreen from './SimplifiedHomeScreen';
import SimplifiedTransferScreen from './SimplifiedTransferScreen';
import SimplifiedServicesScreen from './SimplifiedServicesScreen';

type SimplifiedDashboardProps = {
  userName: string;
  onToggleSimplified: () => void;
};

type SimplifiedView = 'home' | 'transfer' | 'services';

export default function SimplifiedDashboard({ userName, onToggleSimplified }: SimplifiedDashboardProps) {
  const [view, setView] = React.useState<SimplifiedView>('home');

  React.useEffect(() => {
    const announcements: Record<SimplifiedView, string> = {
      home: 'Modo simplificado, pantalla principal con accesos rápidos',
      transfer: 'Modo simplificado, flujo guiado de transferencias',
      services: 'Modo simplificado, flujo guiado para pago de servicios',
    };
    AccessibilityInfo.announceForAccessibility(announcements[view]);
  }, [view]);

  let content: React.ReactNode = null;
  if (view === 'transfer') {
    content = <SimplifiedTransferScreen userName={userName} onBack={() => setView('home')} />;
  } else if (view === 'services') {
    content = <SimplifiedServicesScreen userName={userName} onBack={() => setView('home')} />;
  } else {
    content = (
      <SimplifiedHomeScreen
        userName={userName}
        onTransfer={() => setView('transfer')}
        onPayServices={() => setView('services')}
      />
    );
  }

  return (
    <View className="flex-1">
      {content}
      <ToggleOverlay isSimplified onToggleSimplified={onToggleSimplified} />
    </View>
  );
}

function ToggleOverlay({
  onToggleSimplified,
  isSimplified,
}: {
  onToggleSimplified: () => void;
  isSimplified?: boolean;
}) {
  return (
    <View pointerEvents="box-none" className="absolute right-5 top-16 z-50">
      <TouchableOpacity
        onPress={onToggleSimplified}
        accessibilityRole="button"
        accessibilityLabel={isSimplified ? 'Cambiar a vista completa' : 'Cambiar a vista simplificada'}
        accessibilityHint="Alterna entre la vista simplificada y la completa"
        className="relative h-11 w-11 items-center justify-center rounded-full bg-gray-800"
      >
        <Ionicons name={isSimplified ? 'eye-off-outline' : 'eye-outline'} size={22} color="#fff" />
        <View className="absolute -right-1 -top-1 h-4 w-4 rounded-full bg-emerald-400" />
      </TouchableOpacity>
    </View>
  );
}
