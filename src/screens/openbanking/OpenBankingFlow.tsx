import React from 'react';
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  Linking,
  Pressable,
  ScrollView,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import {
  fetchBankBalance,
  registerBankAccount,
  type BankAccountSummary,
} from '../../api/bank';

const TPP_INFO = {
  name: 'FinHub MX',
  legalName: 'FinHub Servicios Open Finance, SAPI de CV',
  privacyUrl: 'https://finhub.mx/privacy',
  accessDuration: '90 días',
};

type Bank = {
  id: string;
  name: string;
  initials: string;
  accentColor: string;
  popular?: boolean;
  status?: 'stable' | 'degraded';
};

type Permission = {
  id: string;
  label: string;
  reason: string;
  helper?: string;
};

type ConnectedAccount = {
  id: string;
  label: string;
  type: string;
  shared: boolean;
  balance: string;
};

type BankConnection = {
  id: string;
  bankId: string;
  bankName: string;
  status: 'active' | 'reauth' | 'error';
  accounts: ConnectedAccount[];
  lastSync: string;
  consentExpiration: string;
  renewInDays?: number;
  errorCode?: string;
};

type RegisteredAspspApp = {
  id: string;
  provider: 'bank';
  label: string;
  email: string;
  token: string;
  accountSummary: BankAccountSummary;
  lastSyncedAt: string;
};

type FlowView =
  | 'dashboard'
  | 'selectBank'
  | 'preConsent'
  | 'redirect'
  | 'success'
  | 'error'
  | 'renewal'
  | 'managePermissions';

type ErrorContext = {
  bank: Bank;
  type: 'canceled' | 'technical';
  code?: string;
};

type OpenBankingFlowProps = {
  onClose: () => void;
};

const availableBanks: Bank[] = [
  { id: 'bbva', name: 'BBVA México', initials: 'BB', accentColor: '#004481', popular: true },
  { id: 'santander', name: 'Santander', initials: 'ST', accentColor: '#c8102e', popular: true },
  { id: 'banorte', name: 'Banorte', initials: 'BN', accentColor: '#e10600', popular: true, status: 'degraded' },
  { id: 'citibanamex', name: 'Citibanamex', initials: 'CN', accentColor: '#004b8d', popular: true },
  { id: 'azteca', name: 'Banco Azteca', initials: 'AZ', accentColor: '#006341' },
  { id: 'hsbc', name: 'HSBC México', initials: 'HB', accentColor: '#db0011' },
  { id: 'scotiabank', name: 'Scotiabank', initials: 'SC', accentColor: '#d6001c' },
  { id: 'hey', name: 'hey banco', initials: 'HY', accentColor: '#4c1d95' },
  { id: 'stori', name: 'Stori', initials: 'ST', accentColor: '#0f766e' },
];

const permissionCatalog: Permission[] = [
  {
    id: 'accounts',
    label: 'Saldos y cuentas',
    reason: 'Para mostrar tus cuentas conectadas y su saldo disponible.',
    helper: 'Incluye cuentas de depósito, nómina y crédito.',
  },
  {
    id: 'transactions',
    label: 'Movimientos de los últimos 12 meses',
    reason: 'Detectamos gastos y creamos recomendaciones personalizadas.',
  },
  {
    id: 'identity',
    label: 'Datos de titularidad',
    reason: 'Verificamos que eres quien autoriza la conexión.',
  },
];

const defaultAccountsByBank: Record<string, ConnectedAccount[]> = {
  bbva: [
    {
      id: 'bbva-checking',
      label: 'Cuenta Nómina terminación 7621',
      type: 'Cuenta de cheques',
      shared: true,
      balance: '$24,210.00',
    },
    {
      id: 'bbva-credit',
      label: 'Tarjeta Azul 4552',
      type: 'Crédito',
      shared: true,
      balance: '$8,120.00',
    },
    {
      id: 'bbva-savings',
      label: 'Meta de ahorro digital',
      type: 'Ahorro',
      shared: false,
      balance: '$3,450.00',
    },
  ],
  santander: [
    {
      id: 'st-checking',
      label: 'Cuenta Free 9210',
      type: 'Cuenta de débito',
      shared: true,
      balance: '$12,501.40',
    },
    {
      id: 'st-credit',
      label: 'LikeU 8891',
      type: 'Crédito',
      shared: true,
      balance: '$2,330.00',
    },
  ],
  default: [
    {
      id: 'generic-1',
      label: 'Cuenta principal',
      type: 'Cheques',
      shared: true,
      balance: '$9,870.00',
    },
    {
      id: 'generic-2',
      label: 'Tarjeta digital',
      type: 'Crédito',
      shared: true,
      balance: '$1,120.00',
    },
  ],
};

const initialConnections: BankConnection[] = [
  {
    id: 'conn-bbva',
    bankId: 'bbva',
    bankName: 'BBVA México',
    status: 'active',
    accounts: defaultAccountsByBank.bbva,
    lastSync: '15 de marzo · 09:41 h',
    consentExpiration: '15 de agosto 2024',
    renewInDays: 120,
  },
  {
    id: 'conn-santander',
    bankId: 'santander',
    bankName: 'Santander',
    status: 'reauth',
    accounts: defaultAccountsByBank.santander,
    lastSync: 'Ayer · 20:11 h',
    consentExpiration: '2 de junio 2024',
    renewInDays: 5,
  },
  {
    id: 'conn-banorte',
    bankId: 'banorte',
    bankName: 'Banorte',
    status: 'error',
    accounts: defaultAccountsByBank.default,
    lastSync: 'Sin sincronizar',
    consentExpiration: '—',
    errorCode: 'OB-102',
  },
];

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const normalizeText = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

export default function OpenBankingFlow({ onClose }: OpenBankingFlowProps) {
  const [view, setView] = React.useState<FlowView>('dashboard');
  const [selectedBankId, setSelectedBankId] = React.useState<string | null>(null);
  const [connections, setConnections] = React.useState<BankConnection[]>(initialConnections);
  const [errorContext, setErrorContext] = React.useState<ErrorContext | null>(null);
  const [managingConnectionId, setManagingConnectionId] = React.useState<string | null>(null);
  const [renewingConnectionId, setRenewingConnectionId] = React.useState<string | null>(null);
  const [lastSummary, setLastSummary] = React.useState<{ accounts: number; lastSync: string } | null>(
    null
  );
  const [simulateTechnicalError, setSimulateTechnicalError] = React.useState(false);
  const [registryEntries, setRegistryEntries] = React.useState<RegisteredAspspApp[]>([]);
  const [registryAlias, setRegistryAlias] = React.useState('');
  const [registryEmail, setRegistryEmail] = React.useState('');
  const [registryLoading, setRegistryLoading] = React.useState(false);
  const [registryError, setRegistryError] = React.useState<string | null>(null);
  const [registryBusyToken, setRegistryBusyToken] = React.useState<string | null>(null);

  const selectedBank = React.useMemo(
    () => availableBanks.find((bank) => bank.id === selectedBankId) ?? null,
    [selectedBankId]
  );

  const managingConnection = React.useMemo(
    () => connections.find((connection) => connection.id === managingConnectionId) ?? null,
    [connections, managingConnectionId]
  );

  const renewingConnection = React.useMemo(
    () => connections.find((connection) => connection.id === renewingConnectionId) ?? null,
    [connections, renewingConnectionId]
  );

  const handleConnectionSuccess = React.useCallback(() => {
    if (!selectedBank) {
      return;
    }
    const templateAccounts =
      defaultAccountsByBank[selectedBank.id] ?? defaultAccountsByBank.default;
    const accounts = templateAccounts.map((account) => ({ ...account }));
    const sharedAccounts = accounts.filter((account) => account.shared).length;
    const nowSummary = {
      accounts: sharedAccounts,
      lastSync: 'Hace unos segundos',
    };
    setConnections((prev) => {
      const exists = prev.some((connection) => connection.bankId === selectedBank.id);
      const payload: BankConnection = {
        id: exists ? prev.find((c) => c.bankId === selectedBank.id)!.id : `conn-${selectedBank.id}`,
        bankId: selectedBank.id,
        bankName: selectedBank.name,
        status: 'active',
        accounts,
        lastSync: 'Hace unos segundos',
        consentExpiration: '15 de noviembre 2024',
        renewInDays: 180,
      };
      if (exists) {
        return prev.map((connection) => (connection.bankId === selectedBank.id ? payload : connection));
      }
      return [payload, ...prev];
    });
    setLastSummary(nowSummary);
    setView('success');
  }, [selectedBank]);

  React.useEffect(() => {
    if (view !== 'redirect') {
      return;
    }
    const timeout = setTimeout(() => {
      if (!selectedBank) {
        return;
      }
      if (simulateTechnicalError) {
        setErrorContext({ bank: selectedBank, type: 'technical', code: 'OB-504' });
        setView('error');
        return;
      }
      handleConnectionSuccess();
    }, 2000);
    return () => clearTimeout(timeout);
  }, [handleConnectionSuccess, selectedBank, simulateTechnicalError, view]);

  const resetFlowState = React.useCallback(() => {
    setView('dashboard');
    setSelectedBankId(null);
    setManagingConnectionId(null);
    setRenewingConnectionId(null);
    setErrorContext(null);
  }, []);

  const handleGoBackToDashboard = React.useCallback(() => {
    resetFlowState();
  }, [resetFlowState]);

  const handleRetryFlow = () => {
    setView('selectBank');
  };

  const handleSelectBank = (bankId: string) => {
    setSelectedBankId(bankId);
    const bank = availableBanks.find((candidate) => candidate.id === bankId);
    setSimulateTechnicalError(bank?.status === 'degraded');
  };

  const handleCloseSelection = React.useCallback(() => {
    handleGoBackToDashboard();
  }, [handleGoBackToDashboard]);

  const handleRegisterAspspApp = React.useCallback(async () => {
    const normalizedEmail = registryEmail.trim().toLowerCase();
    if (!normalizedEmail) {
      setRegistryError('Ingresa el correo del titular en el ASPSP.');
      return;
    }
    try {
      setRegistryLoading(true);
      setRegistryError(null);
      const summary = await registerBankAccount({
        email: normalizedEmail,
        firstName: registryAlias.trim() || undefined,
      });
      const token = `tok-${summary.account_id}-${Date.now().toString(36)}`;
      const entry: RegisteredAspspApp = {
        id: token,
        provider: 'bank',
        label: registryAlias.trim() || summary.email || `Cuenta ${summary.account_id}`,
        email: summary.email,
        token,
        accountSummary: summary,
        lastSyncedAt: new Date().toISOString(),
      };
      setRegistryEntries((prev) => [entry, ...prev]);
      setRegistryAlias('');
      setRegistryEmail('');
    } catch (err) {
      setRegistryError(
        err instanceof Error
          ? err.message
          : 'No fue posible registrar la aplicación del ASPSP.'
      );
    } finally {
      setRegistryLoading(false);
    }
  }, [registryAlias, registryEmail]);

  const handleRefreshAspspBalance = React.useCallback(
    async (token: string) => {
      const entry = registryEntries.find((candidate) => candidate.token === token);
      if (!entry) {
        setRegistryError('No encontramos la aplicación asociada a ese token.');
        return;
      }
      try {
        setRegistryBusyToken(token);
        setRegistryError(null);
        const summary = await fetchBankBalance({ accountId: entry.accountSummary.account_id });
        setRegistryEntries((prev) =>
          prev.map((candidate) =>
            candidate.token === token
              ? { ...candidate, accountSummary: summary, lastSyncedAt: new Date().toISOString() }
              : candidate
          )
        );
      } catch (err) {
        setRegistryError(
          err instanceof Error
            ? err.message
            : 'No fue posible obtener el saldo con el token registrado.'
        );
      } finally {
        setRegistryBusyToken(null);
      }
    },
    [registryEntries]
  );

  if (view === 'selectBank') {
    return (
      <BankSelectionScreen
        banks={availableBanks}
        selectedBankId={selectedBankId}
        onSelect={handleSelectBank}
        onContinue={() => {
          if (!selectedBankId) {
            return;
          }
          const bank = availableBanks.find((candidate) => candidate.id === selectedBankId);
          if (!bank) {
            return;
          }
          setView('preConsent');
        }}
        onClose={handleCloseSelection}
      />
    );
  }

  if (view === 'preConsent' && selectedBank) {
    return (
      <PreConsentScreen
        bank={selectedBank}
        permissions={permissionCatalog}
        tppName={TPP_INFO.name}
        duration={TPP_INFO.accessDuration}
        privacyUrl={TPP_INFO.privacyUrl}
        onConnect={() => setView('redirect')}
        onCancel={() => {
          setErrorContext({ bank: selectedBank, type: 'canceled' });
          setView('error');
        }}
        onBack={() => setView('selectBank')}
      />
    );
  }

  if (view === 'redirect' && selectedBank) {
    return (
      <BankRedirectScreen
        bank={selectedBank}
        onCancel={() => {
          setErrorContext({ bank: selectedBank, type: 'canceled' });
          setView('error');
        }}
      />
    );
  }

  if (view === 'success' && selectedBank && lastSummary) {
    return (
      <ConsentSuccessScreen
        bank={selectedBank}
        summary={lastSummary}
        onPrimary={() => handleGoBackToDashboard()}
        onSecondary={() => {
          setSelectedBankId(null);
          setView('selectBank');
        }}
      />
    );
  }

  if (view === 'error' && errorContext) {
    return (
      <ConsentErrorScreen
        context={errorContext}
        onRetry={() => {
          if (errorContext.type === 'technical' && selectedBank) {
            setSimulateTechnicalError(false);
          }
          handleRetryFlow();
        }}
        onSupport={() => {
          Alert.alert('Soporte', 'Hemos registrado tu incidencia. Te contactaremos en breve.');
        }}
        onClose={handleGoBackToDashboard}
      />
    );
  }

  if (view === 'renewal' && renewingConnection) {
    return (
      <ConsentRenewalScreen
        bankName={renewingConnection.bankName}
        daysRemaining={renewingConnection.renewInDays ?? 0}
        onRenewNow={() => {
          setSelectedBankId(renewingConnection.bankId);
          const bank = availableBanks.find((candidate) => candidate.id === renewingConnection.bankId);
          setSimulateTechnicalError(bank?.status === 'degraded');
          setView('preConsent');
        }}
        onRemindLater={() => handleGoBackToDashboard()}
        onMoreInfo={() =>
          Alert.alert('Renovación de consentimiento', 'Renovamos la conexión por seguridad cada 90 días.')
        }
        onBack={() => handleGoBackToDashboard()}
      />
    );
  }

  if (view === 'managePermissions' && managingConnection) {
    return (
      <ManagePermissionsScreen
        bankName={managingConnection.bankName}
        accounts={managingConnection.accounts}
        onSave={(nextAccounts) => {
          setConnections((prev) =>
            prev.map((connection) =>
              connection.id === managingConnection.id
                ? { ...connection, accounts: nextAccounts, status: 'active' }
                : connection
            )
          );
          handleGoBackToDashboard();
        }}
        onCancel={() => handleGoBackToDashboard()}
      />
    );
  }

  return (
    <ConnectionsDashboardScreen
      connections={connections}
      registryControls={{
        entries: registryEntries,
        alias: registryAlias,
        email: registryEmail,
        loading: registryLoading,
        error: registryError,
        busyToken: registryBusyToken,
        onAliasChange: setRegistryAlias,
        onEmailChange: setRegistryEmail,
        onSubmit: handleRegisterAspspApp,
        onRefresh: handleRefreshAspspBalance,
      }}
      onConnectNewBank={() => {
        setView('selectBank');
        setSelectedBankId(null);
      }}
      onSyncNow={(connectionId) =>
        setConnections((prev) =>
          prev.map((connection) =>
            connection.id === connectionId
              ? { ...connection, lastSync: 'Hace un momento', status: 'active' }
              : connection
          )
        )
      }
      onViewDetails={(connectionId) => {
        setManagingConnectionId(connectionId);
        setView('managePermissions');
      }}
      onDisconnect={(connectionId) =>
        setConnections((prev) => prev.filter((connection) => connection.id !== connectionId))
      }
      onRequestRenewal={(connectionId) => {
        setRenewingConnectionId(connectionId);
        setView('renewal');
      }}
      onClose={onClose}
    />
  );
}

type LogoProps = {
  label: string;
  color: string;
  size?: number;
};

function BankBadge({ label, color, size = 50 }: LogoProps) {
  return (
    <View
      className="items-center justify-center rounded-2xl"
      style={{ backgroundColor: color, width: size, height: size }}>
      <Text className="text-base font-semibold text-white">{label}</Text>
    </View>
  );
}

type BankSelectionScreenProps = {
  banks: Bank[];
  selectedBankId: string | null;
  onSelect: (bankId: string) => void;
  onContinue: () => void;
  onClose: () => void;
};

function BankSelectionScreen({
  banks,
  selectedBankId,
  onSelect,
  onContinue,
  onClose,
}: BankSelectionScreenProps) {
  const [query, setQuery] = React.useState('');
  const [isSearchFocused, setIsSearchFocused] = React.useState(false);
  const filteredBanks = React.useMemo(() => {
    const normalized = normalizeText(query);
    if (!normalized) {
      return banks;
    }
    return banks.filter((bank) => {
      const normalizedName = normalizeText(bank.name);
      const normalizedInitials = normalizeText(bank.initials);
      return (
        normalizedName.includes(normalized) ||
        normalizedInitials.includes(normalized) ||
        bank.id.toLowerCase().includes(normalized)
      );
    });
  }, [banks, query]);
  const popularBanks = banks.filter((bank) => bank.popular);
  const hasSelection = Boolean(selectedBankId);
  const suggestions = query.trim().length > 0 ? filteredBanks.slice(0, 5) : [];
  const showSuggestions = isSearchFocused && suggestions.length > 0;
  const handleSuggestionSelect = (bank: Bank) => {
    onSelect(bank.id);
    setQuery(bank.name);
    setIsSearchFocused(false);
    Keyboard.dismiss();
  };
  const handleBackToDashboard = () => {
    Keyboard.dismiss();
    onClose();
  };
  const highlightQuery = (text: string) => {
    if (!query.trim()) {
      return <Text className="text-sm font-semibold text-gray-900">{text}</Text>;
    }
    const safe = escapeRegExp(query.trim());
    const regex = new RegExp(`(${safe})`, 'ig');
    const parts = text.split(regex);
    const normalizedQuery = normalizeText(query);
    return (
      <Text className="text-sm font-semibold text-gray-900">
        {parts.map((part, index) => {
          if (normalizeText(part) === normalizedQuery && part.trim()) {
            return (
              <Text key={`${part}-${index}`} className="text-indigo-600">
                {part}
              </Text>
            );
          }
          return <Text key={`${part}-${index}`}>{part}</Text>;
        })}
      </Text>
    );
  };

  return (
    <View className="flex-1 bg-[#f5f7fb]">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 140 }}
        keyboardShouldPersistTaps="handled">
        <View className="px-6 pt-16">
          <View className="mb-8 flex-row items-start justify-between">
            <View className="flex-1 pr-4">
              <Text className="text-xs uppercase tracking-[0.35em] text-indigo-500">
                Finanzas abiertas
              </Text>
              <Text className="mt-2 text-3xl font-bold text-gray-900">Selecciona tu banco</Text>
              <Text className="mt-3 text-sm text-gray-500">
                Identifica tu banco antes de autorizar el consentimiento.
              </Text>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Volver a las conexiones"
              accessibilityHint="Regresa a la pantalla anterior sin salir del flujo"
              hitSlop={8}
              onPress={handleBackToDashboard}
              className="h-11 w-11 items-center justify-center rounded-2xl bg-white shadow">
              <Ionicons name="close" size={20} color="#111827" />
            </Pressable>
          </View>

          <View className="mb-6 rounded-3xl border border-gray-100 bg-white p-5 shadow-sm shadow-indigo-50">
            <View className="mb-4 flex-row items-center rounded-2xl bg-gray-50 px-4">
              <Ionicons name="search" size={18} color="#6b7280" />
              <TextInput
                placeholder="Busca por nombre o institución"
                className="ml-3 flex-1 py-3 text-base text-gray-900"
                value={query}
                onChangeText={setQuery}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                placeholderTextColor="#9ca3af"
              />
            </View>
            {showSuggestions && (
              <View className="mb-4 rounded-2xl border border-gray-100 bg-white">
                {suggestions.map((bank, index) => (
                  <Pressable
                    key={bank.id}
                    onPress={() => handleSuggestionSelect(bank)}
                    className={`flex-row items-center justify-between px-4 py-3 ${
                      index < suggestions.length - 1 ? 'border-b border-gray-100' : ''
                    }`}>
                    <View className="flex-row items-center gap-3">
                      <BankBadge label={bank.initials} color={bank.accentColor} size={38} />
                      {highlightQuery(bank.name)}
                    </View>
                    {selectedBankId === bank.id ? (
                      <Ionicons name="checkmark-circle" size={18} color="#6366f1" />
                    ) : (
                      <Ionicons name="chevron-forward" size={16} color="#4b5563" />
                    )}
                  </Pressable>
                ))}
              </View>
            )}

            <Text className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
              Bancos populares
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {popularBanks.map((bank) => {
                const isSelected = selectedBankId === bank.id;
                return (
                  <Pressable
                    key={bank.id}
                    onPress={() => {
                      setIsSearchFocused(false);
                      Keyboard.dismiss();
                      onSelect(bank.id);
                    }}
                    className={`mr-3 rounded-2xl border px-4 py-3 ${
                      isSelected ? 'border-indigo-500 bg-indigo-50' : 'border-gray-100 bg-white'
                    }`}>
                    <View className="mb-2">
                      <BankBadge label={bank.initials} color={bank.accentColor} size={44} />
                    </View>
                    <Text className="text-sm font-semibold text-gray-900">{bank.name}</Text>
                    {bank.status === 'degraded' && (
                      <Text className="text-xs text-amber-500">Disponibilidad limitada</Text>
                    )}
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>

          <View>
            <Text className="mb-4 text-sm font-semibold text-gray-500">Todos los bancos</Text>
            <View className="flex-row flex-wrap gap-3">
              {filteredBanks.map((bank) => {
                const isSelected = bank.id === selectedBankId;
                return (
                  <Pressable
                    key={bank.id}
                    accessibilityRole="button"
                    accessibilityState={{ selected: isSelected }}
                    onPress={() => {
                      setIsSearchFocused(false);
                      Keyboard.dismiss();
                      onSelect(bank.id);
                    }}
                    className={`w-[48%] rounded-3xl border px-4 py-5 ${
                      isSelected
                        ? 'border-2 border-indigo-500 bg-white shadow-lg shadow-indigo-100'
                        : 'border border-gray-100 bg-white'
                    }`}>
                    <BankBadge label={bank.initials} color={bank.accentColor} />
                    <Text className="mt-4 text-base font-semibold text-gray-900">{bank.name}</Text>
                    <Text className="text-xs text-gray-500">Institución participante</Text>
                    {bank.status === 'degraded' && (
                      <Text className="mt-1 text-xs font-semibold text-amber-500">
                        Posibles retrasos de conexión
                      </Text>
                    )}
                  </Pressable>
                );
              })}
              {filteredBanks.length === 0 && (
                <Text className="text-sm text-gray-500">
                  No encontramos bancos con ese nombre. Intenta con otra búsqueda.
                </Text>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
      <View className="absolute bottom-0 left-0 right-0 bg-white px-6 pb-10 pt-4 shadow-2xl shadow-indigo-100">
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ disabled: !hasSelection }}
          onPress={onContinue}
          disabled={!hasSelection}
          className={`rounded-2xl px-4 py-4 text-center ${
            hasSelection ? 'bg-indigo-600' : 'bg-gray-300'
          }`}>
          <Text className="text-center text-base font-semibold text-white">Continuar</Text>
        </Pressable>
      </View>
    </View>
  );
}

type PreConsentScreenProps = {
  bank: Bank;
  permissions: Permission[];
  tppName: string;
  duration: string;
  privacyUrl: string;
  onConnect: () => void;
  onCancel: () => void;
  onBack: () => void;
};

function PreConsentScreen({
  bank,
  permissions,
  tppName,
  duration,
  privacyUrl,
  onConnect,
  onCancel,
  onBack,
}: PreConsentScreenProps) {
  return (
    <View className="flex-1 bg-[#050505]">
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 32 }}>
        <View className="px-6 pt-16">
          <Pressable
            accessibilityRole="button"
            onPress={onBack}
            className="mb-6 flex-row items-center gap-2 rounded-full bg-white/10 px-4 py-2">
            <Ionicons name="chevron-back" size={18} color="#fff" />
            <Text className="text-sm font-semibold text-white">Cambiar banco</Text>
          </Pressable>

          <View className="mb-6 rounded-[32px] bg-white/5 p-6">
            <Text className="text-sm uppercase tracking-[0.35em] text-indigo-200">
              Paso previo
            </Text>
            <Text className="mt-3 text-3xl font-bold text-white">
              Necesitamos conectar con {bank.name}
            </Text>
            <Text className="mt-2 text-base text-gray-200">
              {tppName} solicitará tu permiso antes de redirigirte al banco.
            </Text>
          </View>

          <View className="space-y-5">
            <View className="rounded-[32px] border border-white/10 bg-white/5 p-6">
              <Text className="text-lg font-semibold text-white">Solicitaremos acceso a:</Text>
              {permissions.map((permission) => (
                <View key={permission.id} className="mt-4 rounded-2xl bg-white/5 p-4">
                  <Text className="text-base font-semibold text-white">{permission.label}</Text>
                  <Text className="mt-1 text-sm text-gray-200">{permission.reason}</Text>
                  {permission.helper && (
                    <Text className="mt-1 text-xs text-gray-400">{permission.helper}</Text>
                  )}
                </View>
              ))}
            </View>

            <View className="rounded-[32px] border border-white/10 bg-white/5 p-6">
              <Text className="text-lg font-semibold text-white">Duración del acceso</Text>
              <Text className="mt-2 text-base text-gray-200">{duration} o hasta que revokes.</Text>
            </View>

            <View className="rounded-[32px] border border-white/10 bg-white/5 p-6">
              <Text className="text-lg font-semibold text-white">Qué hacemos con tus datos</Text>
              <Text className="mt-2 text-base text-gray-200">
                Usamos tu información solo para proveer el servicio y mejorar tus recomendaciones.
              </Text>
              <Pressable onPress={() => Linking.openURL(privacyUrl)} className="mt-4">
                <Text className="text-sm font-semibold text-indigo-200 underline">
                  Ver política de privacidad
                </Text>
              </Pressable>
            </View>

            <View className="rounded-[32px] border border-white/10 bg-white/5 p-6">
              <Text className="text-lg font-semibold text-white">En el siguiente paso</Text>
              <View className="mt-3 space-y-3">
                <StepRow text={`Serás redirigido a ${bank.name} de forma segura`} />
                <StepRow text="Deberás iniciar sesión" />
                <StepRow text="Podrás autorizar o rechazar el acceso" />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
      <View className="bg-white px-6 pb-10 pt-4">
        <Pressable
          onPress={onConnect}
          className="mb-3 rounded-3xl bg-indigo-500 py-4"
          accessibilityRole="button">
          <Text className="text-center text-base font-semibold text-white">
            Conectar con {bank.name}
          </Text>
        </Pressable>
        <Pressable
          onPress={onCancel}
          className="rounded-3xl border border-gray-200 py-4"
          accessibilityRole="button">
          <Text className="text-center text-base font-semibold text-gray-900">Cancelar</Text>
        </Pressable>
      </View>
    </View>
  );
}

type StepRowProps = {
  text: string;
};

function StepRow({ text }: StepRowProps) {
  return (
    <View className="flex-row items-center gap-3">
      <View className="h-3 w-3 rounded-full bg-indigo-300" />
      <Text className="flex-1 text-base text-gray-100">{text}</Text>
    </View>
  );
}

type BankRedirectScreenProps = {
  bank: Bank;
  onCancel: () => void;
};

function BankRedirectScreen({ bank, onCancel }: BankRedirectScreenProps) {
  return (
    <View className="flex-1 items-center justify-center bg-[#050505] px-8">
      <BankBadge label={bank.initials} color={bank.accentColor} size={92} />
      <ActivityIndicator size="large" color="#818cf8" style={{ marginVertical: 40 }} />
      <Text className="text-2xl font-semibold text-white">
        Conectando con {bank.name}...
      </Text>
      <Text className="mt-3 text-center text-base text-gray-300">
        Serás redirigido en unos momentos.
      </Text>
      <Pressable
        onPress={onCancel}
        className="mt-10 rounded-2xl border border-white/20 px-6 py-3"
        accessibilityRole="button">
        <Text className="text-sm font-semibold text-white">Cancelar</Text>
      </Pressable>
    </View>
  );
}

type ConsentSuccessScreenProps = {
  bank: Bank;
  summary: { accounts: number; lastSync: string };
  onPrimary: () => void;
  onSecondary: () => void;
};

function ConsentSuccessScreen({ bank, summary, onPrimary, onSecondary }: ConsentSuccessScreenProps) {
  return (
    <View className="flex-1 bg-[#f5f7fb]">
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 48 }}>
        <View className="px-6 pt-20">
          <View className="mb-6 items-center">
            <View className="h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
              <Ionicons name="checkmark" size={32} color="#059669" />
            </View>
            <Text className="mt-6 text-center text-2xl font-bold text-gray-900">
              ¡Conexión exitosa con {bank.name}!
            </Text>
            <Text className="mt-2 text-center text-base text-gray-600">
              Estamos sincronizando tu información...
            </Text>
          </View>

          <View className="rounded-[32px] border border-gray-100 bg-white p-6 shadow-sm shadow-indigo-50">
            <Text className="text-lg font-semibold text-gray-900">Resumen</Text>
            <View className="mt-4 flex-row items-center justify-between">
              <View>
                <Text className="text-sm uppercase text-gray-500">Cuentas conectadas</Text>
                <Text className="mt-1 text-2xl font-bold text-gray-900">{summary.accounts}</Text>
              </View>
              <View>
                <Text className="text-sm uppercase text-gray-500">Última sincronización</Text>
                <Text className="mt-1 text-base font-semibold text-gray-900">{summary.lastSync}</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
      <View className="bg-white px-6 pb-10 pt-4">
        <Pressable
          onPress={onPrimary}
          className="mb-3 rounded-3xl bg-indigo-500 py-4"
          accessibilityRole="button">
          <Text className="text-center text-base font-semibold text-white">Ver mis cuentas</Text>
        </Pressable>
        <Pressable
          onPress={onSecondary}
          className="rounded-3xl border border-gray-200 py-4"
          accessibilityRole="button">
          <Text className="text-center text-base font-semibold text-gray-900">
            Conectar otro banco
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

type ConsentErrorScreenProps = {
  context: ErrorContext;
  onRetry: () => void;
  onSupport: () => void;
  onClose: () => void;
};

function ConsentErrorScreen({ context, onRetry, onSupport, onClose }: ConsentErrorScreenProps) {
  const isCanceled = context.type === 'canceled';
  return (
    <View className="flex-1 bg-[#fff8f0]">
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 48 }}>
        <View className="px-6 pt-20">
          <View className="mb-6 items-center">
            <View className="h-16 w-16 items-center justify-center rounded-full bg-amber-100">
              <Ionicons name="warning" size={28} color="#d97706" />
            </View>
            <Text className="mt-6 text-center text-2xl font-bold text-gray-900">
              {isCanceled ? 'Conexión cancelada' : 'No pudimos conectar con ' + context.bank.name}
            </Text>
            <Text className="mt-2 text-center text-base text-gray-600">
              {isCanceled
                ? `No se compartió información con ${context.bank.name}.`
                : 'Intenta nuevamente en unos minutos.'}
            </Text>
            {!isCanceled && context.code && (
              <Text className="mt-2 text-sm font-semibold text-gray-500">Código: {context.code}</Text>
            )}
          </View>

          {!isCanceled && (
            <View className="rounded-[32px] border border-amber-200 bg-white p-6 shadow-sm shadow-amber-100">
              <Text className="text-lg font-semibold text-gray-900">Esto puede deberse a:</Text>
              <Text className="mt-3 text-base text-gray-700">• Problema temporal del banco</Text>
              <Text className="mt-1 text-base text-gray-700">• Conexión interrumpida</Text>
            </View>
          )}
        </View>
      </ScrollView>
      <View className="bg-white px-6 pb-10 pt-4">
        <Pressable
          onPress={onRetry}
          className="mb-3 rounded-3xl bg-indigo-500 py-4"
          accessibilityRole="button">
          <Text className="text-center text-base font-semibold text-white">Intentar de nuevo</Text>
        </Pressable>
        {!isCanceled && (
          <Pressable
            onPress={onSupport}
            className="rounded-3xl border border-gray-200 py-4"
            accessibilityRole="button">
            <Text className="text-center text-base font-semibold text-gray-900">
              Contactar soporte
            </Text>
          </Pressable>
        )}
        <Pressable
          onPress={onClose}
          className="mt-4 rounded-3xl border border-transparent py-2"
          accessibilityRole="button">
          <Text className="text-center text-sm font-semibold text-gray-500">Volver al panel</Text>
        </Pressable>
      </View>
    </View>
  );
}

type ConnectionsDashboardScreenProps = {
  connections: BankConnection[];
  registryControls: RegistryControls;
  onConnectNewBank: () => void;
  onSyncNow: (connectionId: string) => void;
  onViewDetails: (connectionId: string) => void;
  onDisconnect: (connectionId: string) => void;
  onRequestRenewal: (connectionId: string) => void;
  onClose: () => void;
};

type RegistryControls = {
  entries: RegisteredAspspApp[];
  alias: string;
  email: string;
  loading: boolean;
  error: string | null;
  busyToken: string | null;
  onAliasChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onSubmit: () => void;
  onRefresh: (token: string) => void;
};

function ConnectionsDashboardScreen({
  connections,
  registryControls,
  onConnectNewBank,
  onSyncNow,
  onViewDetails,
  onDisconnect,
  onRequestRenewal,
  onClose,
}: ConnectionsDashboardScreenProps) {
  const {
    entries,
    alias,
    email,
    loading,
    error,
    busyToken,
    onAliasChange,
    onEmailChange,
    onSubmit,
    onRefresh,
  } = registryControls;
  const renderStatus = (connection: BankConnection) => {
    if (connection.status === 'active') {
      return { label: 'Activo', bg: 'bg-emerald-50', text: 'text-emerald-700' };
    }
    if (connection.status === 'reauth') {
      return { label: 'Requiere reautenticación', bg: 'bg-amber-50', text: 'text-amber-600' };
    }
    return { label: 'Error', bg: 'bg-rose-50', text: 'text-rose-600' };
  };

  return (
    <View className="flex-1 bg-[#f5f7fb]">
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 32 }}>
        <View className="px-6 pt-16">
          <View className="mb-8 flex-row items-center justify-between">
            <View>
              <Text className="text-xs uppercase tracking-[0.35em] text-indigo-500">
                Permisos activos
              </Text>
              <Text className="mt-2 text-3xl font-bold text-gray-900">
                Conexiones bancarias
              </Text>
            </View>
            <Pressable
              accessibilityRole="button"
              onPress={onClose}
              className="h-11 w-11 items-center justify-center rounded-2xl bg-white shadow">
              <Ionicons name="close" size={20} color="#111827" />
            </Pressable>
          </View>

          <SimpleAspspRegistryCard
            entries={entries}
            alias={alias}
            email={email}
            loading={loading}
            error={error}
            busyToken={busyToken}
            onAliasChange={onAliasChange}
            onEmailChange={onEmailChange}
            onSubmit={onSubmit}
            onRefresh={onRefresh}
          />

          {connections.map((connection) => {
            const bank = availableBanks.find((candidate) => candidate.id === connection.bankId);
            const statusStyles = renderStatus(connection);
            const accountsShared = connection.accounts.filter((account) => account.shared).length;
            return (
              <View
                key={connection.id}
                className="mb-5 rounded-[32px] border border-gray-100 bg-white p-6 shadow-sm shadow-indigo-50">
                <View className="mb-4 flex-row items-center justify-between">
                  <View className="flex-row items-center gap-4">
                    {bank && <BankBadge label={bank.initials} color={bank.accentColor} />}
                    <View>
                      <Text className="text-xl font-semibold text-gray-900">{connection.bankName}</Text>
                      <Text className="text-sm text-gray-500">{TPP_INFO.name}</Text>
                    </View>
                  </View>
                  <View className={`rounded-full px-4 py-2 ${statusStyles.bg}`}>
                    <Text className={`text-xs font-semibold uppercase ${statusStyles.text}`}>
                      {statusStyles.label}
                    </Text>
                  </View>
                </View>

                <View className="mb-4 flex-row flex-wrap gap-6">
                  <View>
                    <Text className="text-xs uppercase text-gray-500">Cuentas conectadas</Text>
                    <Text className="mt-1 text-2xl font-bold text-gray-900">{accountsShared}</Text>
                  </View>
                  <View>
                    <Text className="text-xs uppercase text-gray-500">Última sincronización</Text>
                    <Text className="mt-1 text-base font-semibold text-gray-900">
                      {connection.lastSync}
                    </Text>
                  </View>
                  <View>
                    <Text className="text-xs uppercase text-gray-500">Expira</Text>
                    <Text className="mt-1 text-base font-semibold text-gray-900">
                      {connection.consentExpiration}
                    </Text>
                  </View>
                </View>

                {connection.status === 'reauth' && connection.renewInDays !== undefined && (
                  <View className="mb-4 rounded-2xl bg-amber-50 p-4">
                    <Text className="text-sm font-semibold text-amber-700">
                      Requiere renovación en {connection.renewInDays} días
                    </Text>
                    <Pressable onPress={() => onRequestRenewal(connection.id)} className="mt-2">
                      <Text className="text-sm font-semibold text-amber-600 underline">
                        Renovar ahora
                      </Text>
                    </Pressable>
                  </View>
                )}

                {connection.status === 'error' && (
                  <View className="mb-4 rounded-2xl bg-rose-50 p-4">
                    <Text className="text-sm font-semibold text-rose-600">
                      Necesita atención — Código {connection.errorCode ?? 'OB-000'}
                    </Text>
                    <Text className="text-xs text-rose-500">Intenta sincronizar nuevamente.</Text>
                  </View>
                )}

                <View className="flex-row flex-wrap gap-3">
                  <ActionButton label="Sincronizar ahora" onPress={() => onSyncNow(connection.id)} />
                  <ActionButton
                    label="Ver detalles"
                    appearance="secondary"
                    onPress={() => onViewDetails(connection.id)}
                  />
                  <ActionButton
                    label="Desconectar"
                    appearance="danger"
                    onPress={() => onDisconnect(connection.id)}
                  />
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
      <View className="bg-white px-6 pb-10 pt-4">
        <Pressable
          onPress={onConnectNewBank}
          className="rounded-3xl bg-indigo-500 py-4"
          accessibilityRole="button">
          <Text className="text-center text-base font-semibold text-white">
            Conectar nuevo banco
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

type ActionButtonProps = {
  label: string;
  onPress: () => void;
  appearance?: 'primary' | 'secondary' | 'danger';
};

function ActionButton({ label, onPress, appearance = 'primary' }: ActionButtonProps) {
  const styles = {
    primary: 'bg-gray-900 text-white',
    secondary: 'bg-gray-100 text-gray-900',
    danger: 'bg-rose-50 text-rose-600',
  }[appearance];
  const [bg, text] = styles.split(' ');
  return (
    <Pressable
      onPress={onPress}
      className={`flex-1 rounded-2xl px-4 py-3 ${bg}`}
      accessibilityRole="button">
      <Text className={`text-center text-sm font-semibold ${text}`}>{label}</Text>
    </Pressable>
  );
}

type SimpleAspspRegistryCardProps = RegistryControls;

function SimpleAspspRegistryCard({
  entries,
  alias,
  email,
  loading,
  error,
  busyToken,
  onAliasChange,
  onEmailChange,
  onSubmit,
  onRefresh,
}: SimpleAspspRegistryCardProps) {
  const formatCurrency = (raw?: string) => {
    const amount = Number(raw ?? 0);
    if (Number.isNaN(amount)) {
      return '$0.00';
    }
    return amount.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
  };

  const formatTimestamp = (iso: string) => {
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) {
      return 'Hace unos segundos';
    }
    return date.toLocaleString('es-MX', { hour12: false });
  };

  return (
    <View className="mb-8 rounded-[32px] border border-dashed border-indigo-200 bg-white/70 p-5 shadow-sm shadow-indigo-50">
      <Text className="text-xs uppercase tracking-[0.35em] text-indigo-500">
        Registro rápido ASPSP
      </Text>
      <Text className="mt-2 text-xl font-semibold text-gray-900">
        Vincula el banco simplificado de pruebas
      </Text>
      <Text className="mt-1 text-sm text-gray-600">
        Creamos una credencial y te devolvemos el token para consultar saldos cuando lo necesites.
      </Text>

      <View className="mt-4 gap-3">
        <View>
          <Text className="mb-1 text-xs font-semibold uppercase text-gray-500">Alias</Text>
          <TextInput
            value={alias}
            onChangeText={onAliasChange}
            placeholder="Ej. Cuenta nómina demo"
            placeholderTextColor="#94a3b8"
            className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900"
          />
        </View>
        <View>
          <Text className="mb-1 text-xs font-semibold uppercase text-gray-500">Correo</Text>
          <TextInput
            value={email}
            onChangeText={onEmailChange}
            placeholder="demo@aspsp.mx"
            placeholderTextColor="#94a3b8"
            keyboardType="email-address"
            autoCapitalize="none"
            className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900"
          />
        </View>
      </View>

      {error ? <Text className="mt-2 text-xs text-rose-600">{error}</Text> : null}

      <Pressable
        onPress={onSubmit}
        disabled={loading}
        accessibilityRole="button"
        className={`mt-4 rounded-3xl px-4 py-3 ${
          loading ? 'bg-gray-300' : 'bg-indigo-600'
        }`}>
        <Text className="text-center text-sm font-semibold text-white">
          {loading ? 'Registrando ASPSP…' : 'Registrar aplicación'}
        </Text>
      </Pressable>

      {entries.length > 0 && (
        <View className="mt-6 rounded-2xl border border-gray-100 bg-white p-4 shadow">
          <Text className="text-sm font-semibold text-gray-900">
            Conexiones creadas (token + saldo)
          </Text>
          {entries.map((entry) => (
            <View
              key={entry.id}
              className="mt-4 rounded-xl border border-gray-100 bg-gray-50/70 p-4">
              <Text className="text-base font-semibold text-gray-900">{entry.label}</Text>
              <Text selectable className="text-xs text-gray-500">
                Token: {entry.token}
              </Text>
              <Text className="mt-2 text-sm text-gray-600">
                Saldo disponible:{' '}
                <Text className="font-semibold text-gray-900">
                  {formatCurrency(entry.accountSummary.balance_available)}
                </Text>
              </Text>
              <Text className="text-xs text-gray-500">
                Última consulta: {formatTimestamp(entry.lastSyncedAt)}
              </Text>
              <Pressable
                onPress={() => onRefresh(entry.token)}
                disabled={busyToken === entry.token}
                className={`mt-3 rounded-2xl px-3 py-2 ${
                  busyToken === entry.token ? 'bg-gray-200' : 'bg-gray-900'
                }`}>
                <Text className="text-center text-xs font-semibold text-white">
                  {busyToken === entry.token
                    ? 'Consultando saldo…'
                    : 'Consultar saldo con token'}
                </Text>
              </Pressable>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

type ConsentRenewalScreenProps = {
  bankName: string;
  daysRemaining: number;
  onRenewNow: () => void;
  onRemindLater: () => void;
  onMoreInfo: () => void;
  onBack: () => void;
};

function ConsentRenewalScreen({
  bankName,
  daysRemaining,
  onRenewNow,
  onRemindLater,
  onMoreInfo,
  onBack,
}: ConsentRenewalScreenProps) {
  return (
    <View className="flex-1 bg-[#fff8f0]">
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 32 }}>
        <View className="px-6 pt-16">
          <Pressable
            accessibilityRole="button"
            onPress={onBack}
            className="mb-4 flex-row items-center gap-2">
            <Ionicons name="chevron-back" size={18} color="#92400e" />
            <Text className="text-sm font-semibold text-amber-700">Volver</Text>
          </Pressable>
          <View className="items-center">
            <View className="h-16 w-16 items-center justify-center rounded-full bg-amber-100">
              <Ionicons name="time" size={28} color="#d97706" />
            </View>
            <Text className="mt-6 text-center text-2xl font-bold text-gray-900">
              Tu conexión con {bankName} necesita renovación
            </Text>
            <Text className="mt-2 text-center text-base text-gray-600">
              Tu consentimiento expira en {daysRemaining} días
            </Text>
          </View>

          <View className="mt-8 space-y-4">
            <View className="rounded-3xl border border-amber-100 bg-white p-5 shadow-sm shadow-amber-100">
              <Text className="text-base text-gray-700">Para continuar usando el servicio, necesitas:</Text>
              <Text className="mt-3 text-sm text-gray-700">• Renovar tu consentimiento con el banco</Text>
              <Text className="text-sm text-gray-700">• No perderás ningún dato</Text>
              <Text className="text-sm text-gray-700">• Solo tomará unos minutos</Text>
            </View>
          </View>
        </View>
      </ScrollView>
      <View className="bg-white px-6 pb-10 pt-4">
        <Pressable
          onPress={onRenewNow}
          className="mb-3 rounded-3xl bg-indigo-500 py-4"
          accessibilityRole="button">
          <Text className="text-center text-base font-semibold text-white">Renovar ahora</Text>
        </Pressable>
        <Pressable
          onPress={onRemindLater}
          className="mb-3 rounded-3xl border border-gray-200 py-4"
          accessibilityRole="button">
          <Text className="text-center text-base font-semibold text-gray-900">
            Recordarme después
          </Text>
        </Pressable>
        <Pressable onPress={onMoreInfo} accessibilityRole="button">
          <Text className="text-center text-sm font-semibold text-indigo-600">Ver más información</Text>
        </Pressable>
      </View>
    </View>
  );
}

type ManagePermissionsScreenProps = {
  bankName: string;
  accounts: ConnectedAccount[];
  onSave: (accounts: ConnectedAccount[]) => void;
  onCancel: () => void;
};

function ManagePermissionsScreen({ bankName, accounts, onSave, onCancel }: ManagePermissionsScreenProps) {
  const [localAccounts, setLocalAccounts] = React.useState(accounts);

  const toggleAccount = (accountId: string) => {
    setLocalAccounts((prev) =>
      prev.map((account) =>
        account.id === accountId ? { ...account, shared: !account.shared } : account
      )
    );
  };

  return (
    <View className="flex-1 bg-[#f5f7fb]">
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 32 }}>
        <View className="px-6 pt-16">
          <Text className="text-xs uppercase tracking-[0.35em] text-indigo-500">
            Permisos
          </Text>
          <Text className="mt-2 text-3xl font-bold text-gray-900">
            Gestiona tu conexión con {bankName}
          </Text>
          <Text className="mt-3 text-sm text-gray-600">
            Selecciona qué cuentas deseas compartir. Los cambios pueden requerir reautenticación.
          </Text>

          <View className="mt-6 space-y-4">
            {localAccounts.map((account) => (
              <View
                key={account.id}
                className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm shadow-indigo-50">
                <View className="flex-row items-center justify-between">
                  <View className="flex-1 pr-4">
                    <Text className="text-base font-semibold text-gray-900">{account.label}</Text>
                    <Text className="text-sm text-gray-500">{account.type}</Text>
                    <Text className="text-sm text-gray-900">{account.balance}</Text>
                  </View>
                  <Switch
                    value={account.shared}
                    onValueChange={() => toggleAccount(account.id)}
                    thumbColor={account.shared ? '#4338ca' : '#e5e7eb'}
                    trackColor={{ false: '#e5e7eb', true: '#c7d2fe' }}
                  />
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
      <View className="bg-white px-6 pb-10 pt-4">
        <Pressable
          onPress={() => onSave(localAccounts)}
          className="mb-3 rounded-3xl bg-indigo-500 py-4"
          accessibilityRole="button">
          <Text className="text-center text-base font-semibold text-white">Guardar cambios</Text>
        </Pressable>
        <Pressable
          onPress={onCancel}
          className="rounded-3xl border border-gray-200 py-4"
          accessibilityRole="button">
          <Text className="text-center text-base font-semibold text-gray-900">Cancelar</Text>
        </Pressable>
      </View>
    </View>
  );
}
