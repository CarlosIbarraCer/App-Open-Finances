import React from 'react';
import { AccessibilityInfo } from 'react-native';

import SimplifiedHomeScreen from './SimplifiedHomeScreen';
import SimplifiedTransferScreen from './SimplifiedTransferScreen';
import SimplifiedServicesScreen from './SimplifiedServicesScreen';
import SimplifiedTransactionsScreen from './SimplifiedTransactionsScreen';

type SimplifiedDashboardProps = {
  userName: string;
  userEmail?: string;
  bankAccount?: {
    balance_available: string;
    account_id: number;
  } | null;
  bankSyncing?: boolean;
  bankError?: string | null;
  onRefreshBank?: () => void;
  onExitSimplified?: () => void;
};

type SimplifiedView = 'home' | 'transfer' | 'services' | 'history';

export default function SimplifiedDashboard({
  userName,
  userEmail,
  bankAccount,
  bankSyncing,
  bankError,
  onRefreshBank,
  onExitSimplified,
}: SimplifiedDashboardProps) {
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
    return (
      <SimplifiedTransferScreen
        userName={userName}
        userEmail={userEmail}
        onBack={() => setView('home')}
        onRefreshBank={onRefreshBank}
      />
    );
  }

  if (view === 'services') {
    return <SimplifiedServicesScreen userName={userName} onBack={() => setView('home')} />;
  }

  if (view === 'history') {
    return <SimplifiedTransactionsScreen userEmail={userEmail} onBack={() => setView('home')} />;
  }

  return (
    <SimplifiedHomeScreen
      userName={userName}
      userEmail={userEmail}
      bankAccount={bankAccount}
      bankSyncing={bankSyncing}
      bankError={bankError}
      onRefreshBank={onRefreshBank}
      onTransfer={() => setView('transfer')}
      onPayServices={() => setView('services')}
      onViewTransactions={() => setView('history')}
      onExitSimplified={onExitSimplified}
    />
  );
}
