import React from 'react';
import { AccessibilityInfo } from 'react-native';

import SimplifiedHomeScreen from './SimplifiedHomeScreen';
import SimplifiedTransferScreen from './SimplifiedTransferScreen';
import SimplifiedServicesScreen from './SimplifiedServicesScreen';

type SimplifiedDashboardProps = {
  userName: string;
};

type SimplifiedView = 'home' | 'transfer' | 'services';

export default function SimplifiedDashboard({ userName }: SimplifiedDashboardProps) {
  const [view, setView] = React.useState<SimplifiedView>('home');

  React.useEffect(() => {
    const announcements: Record<SimplifiedView, string> = {
      home: 'Modo simplificado, pantalla principal con accesos rápidos',
      transfer: 'Modo simplificado, flujo guiado de transferencias',
      services: 'Modo simplificado, flujo guiado para pago de servicios',
    };
    AccessibilityInfo.announceForAccessibility(announcements[view]);
  }, [view]);

  if (view === 'transfer') {
    return <SimplifiedTransferScreen userName={userName} onBack={() => setView('home')} />;
  }

  if (view === 'services') {
    return <SimplifiedServicesScreen userName={userName} onBack={() => setView('home')} />;
  }

  return (
    <SimplifiedHomeScreen
      userName={userName}
      onTransfer={() => setView('transfer')}
      onPayServices={() => setView('services')}
    />
  );
}
