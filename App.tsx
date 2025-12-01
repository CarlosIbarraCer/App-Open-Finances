import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { AccessibilityInfo, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Navbar, { DashboardTab } from './src/components/Navbar';
import HomeScreen from './src/screens/HomeScreen';
import InvestmentsScreen from './src/screens/investments';
import LoansScreen from './src/screens/LoansScreen';
import SearchScreen from './src/screens/SearchScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import TransferFlow from './src/screens/transfer/TransferFlow';
import WelcomeScreen from './src/screens/auth/WelcomeScreen';
import InfoScreen from './src/screens/auth/InfoScreen';
import LoginScreen from './src/screens/auth/LoginScreen';
import RegisterScreen from './src/screens/auth/RegisterScreen';
import RegisterSuccessScreen from './src/screens/auth/RegisterSuccessScreen';
import SimplifiedDashboard from './src/screens/simplified/SimplifiedDashboard';
import OpenBankingFlow from './src/screens/openbanking/OpenBankingFlow';
import OpenFinanceModulesScreen, {
  OpenFinanceModuleKey,
} from './src/screens/openbanking/OpenFinanceModulesScreen';
import { useVoiceCommands, VoiceIntentHandler } from './src/voice/useVoiceCommands';
import { resolveLocale } from './src/voice';
import type { VoiceIntentId } from './src/voice/intents';

import './global.css';

import {
  loginUser as loginWithBackend,
  registerUser as registerWithBackend,
} from './src/api/backend';
import {
  fetchBankBalance,
  registerBankAccount,
  type BankAccountSummary,
} from './src/api/bank';

type RootScreen =
  | 'welcome'
  | 'about'
  | 'login'
  | 'register'
  | 'registerSuccess'
  | 'dashboard'
  | 'transfer'
  | 'openBanking'
  | 'openFinanceModules';

type StoredUser = {
  name: string;
  email: string;
  password: string;
  phoneNumber?: string;
  age?: number;
  prefersSimplified?: boolean;
};

type LoginPayload = {
  email: string;
  password: string;
};

type RegisterPayload = {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  age: number;
};

type RegisterSuccessContext = {
  userEmail: string;
  userName: string;
  age?: number;
};

type AuthSession = {
  accessToken: string;
  refreshToken: string;
  expiresIn?: number;
  tokenType?: string;
};

const buildNameFromEmail = (email: string) => {
  const localPart = email.split('@')[0] ?? '';
  const cleaned = localPart.replace(/[\W_]+/g, ' ').trim();
  if (!cleaned) {
    return 'Cliente Open Finances';
  }
  return cleaned
    .split(' ')
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ');
};

const VOICE_PREF_KEY = 'app.voiceCommandsEnabled';
const SESSION_STORAGE_KEY = 'app.authSession';
const LAST_LOGIN_EMAIL_KEY = 'app.lastLoginEmail';

export default function App() {
  const [rootScreen, setRootScreen] = React.useState<RootScreen>('welcome');
  const [activeTab, setActiveTab] = React.useState<DashboardTab>('home');
  const [users, setUsers] = React.useState<StoredUser[]>([
    {
      name: 'Danna Cervantes',
      email: 'danna@openfin.mx',
      password: 'demo1234',
      phoneNumber: '6121561313',
      age: 45,
      prefersSimplified: false,
    },
  ]);
  const [activeUser, setActiveUser] = React.useState<StoredUser | null>(null);
  const [loginError, setLoginError] = React.useState<string | null>(null);
  const [loginMessage, setLoginMessage] = React.useState<string | null>(null);
  const [registerError, setRegisterError] = React.useState<string | null>(null);
  const [registerSuccessContext, setRegisterSuccessContext] =
    React.useState<RegisterSuccessContext | null>(null);
  const [simplifiedMode, setSimplifiedMode] = React.useState(false);
  const [voiceCommandsEnabled, setVoiceCommandsEnabled] = React.useState(false);
  const [voicePrefLoaded, setVoicePrefLoaded] = React.useState(false);
  const [voiceFlightQuery, setVoiceFlightQuery] = React.useState<string | null>(null);
  const [voiceLocale] = React.useState(() => resolveLocale());
  const [activeOpenFinanceModule, setActiveOpenFinanceModule] =
    React.useState<OpenFinanceModuleKey | null>(null);
  const [session, setSession] = React.useState<AuthSession | null>(null);
  const [bankAccount, setBankAccount] = React.useState<BankAccountSummary | null>(null);
  const [isBankSyncing, setIsBankSyncing] = React.useState(false);
  const [bankSyncError, setBankSyncError] = React.useState<string | null>(null);
  const [lastLoginEmail, setLastLoginEmail] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (activeUser) {
      setSimplifiedMode(Boolean(activeUser.prefersSimplified));
    } else {
      setSimplifiedMode(false);
    }
  }, [activeUser]);

  React.useEffect(() => {
    AsyncStorage.getItem(VOICE_PREF_KEY)
      .then((value) => {
        if (value === 'true') {
          setVoiceCommandsEnabled(true);
        }
      })
      .finally(() => setVoicePrefLoaded(true));
  }, []);

  React.useEffect(() => {
    AsyncStorage.getItem(SESSION_STORAGE_KEY)
      .then((value) => {
        if (value) {
          setSession(JSON.parse(value) as AuthSession);
        }
      })
      .catch(() => undefined);
  }, []);

  React.useEffect(() => {
    AsyncStorage.getItem(LAST_LOGIN_EMAIL_KEY)
      .then((value) => {
        if (value) {
          setLastLoginEmail(value);
        }
      })
      .catch(() => undefined);
  }, []);

  const syncBankData = React.useCallback(async (email: string, name?: string) => {
    try {
      setIsBankSyncing(true);
      await registerBankAccount({ email, firstName: name });
      const summary = await fetchBankBalance({ email });
      setBankAccount(summary);
      setBankSyncError(null);
    } catch (err) {
      console.error('Error syncing bank account', err);
      setBankSyncError(
        err instanceof Error ? err.message : 'No fue posible sincronizar la cuenta bancaria.',
      );
    } finally {
      setIsBankSyncing(false);
    }
  }, []);

  const persistSession = async (payload: AuthSession) => {
    setSession(payload);
    await AsyncStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(payload));
  };

  const clearSession = async () => {
    setSession(null);
    await AsyncStorage.removeItem(SESSION_STORAGE_KEY);
  };

  React.useEffect(() => {
    const announcements: Record<RootScreen, string> = {
      welcome: 'Pantalla de bienvenida abierta',
      about: 'Información de FinHub México',
      login: 'Formulario para iniciar sesión',
      register: 'Formulario para crear cuenta',
      registerSuccess: 'Cuenta creada exitosamente',
      dashboard: 'Tablero principal',
      transfer: 'Flujo de transferencia',
      openBanking: 'Gestión de permisos bancarios',
      openFinanceModules: 'Módulo especializado de finanzas abiertas',
    };
    const message = announcements[rootScreen];
    if (message) {
      AccessibilityInfo.announceForAccessibility(message);
    }
  }, [rootScreen]);

  React.useEffect(() => {
    if (activeTab !== 'search' && voiceFlightQuery) {
      setVoiceFlightQuery(null);
    }
  }, [activeTab, voiceFlightQuery]);

  const resetFeedback = () => {
    setLoginError(null);
    setRegisterError(null);
    setLoginMessage(null);
  };

  const openLogin = (options?: { keepMessage?: boolean }) => {
    setRootScreen('login');
    setLoginError(null);
    setRegisterError(null);
    setRegisterSuccessContext(null);
    if (!options?.keepMessage) {
      setLoginMessage(null);
    }
  };

  const goToRegister = () => {
    setRootScreen('register');
    setLoginError(null);
    setRegisterError(null);
    setLoginMessage(null);
    setRegisterSuccessContext(null);
  };

  const handleLogin = async ({ email, password }: LoginPayload) => {
    const normalizedEmail = email.trim().toLowerCase();
    setLoginError(null);
    try {
      const tokens = await loginWithBackend({ email: normalizedEmail, password });
      await persistSession({
        accessToken: tokens.access,
        refreshToken: tokens.refresh,
        expiresIn: tokens.expires_in,
        tokenType: tokens.token_type,
      });
      setLastLoginEmail(normalizedEmail);
      AsyncStorage.setItem(LAST_LOGIN_EMAIL_KEY, normalizedEmail).catch(() => undefined);
      setLoginMessage('Sesión iniciada correctamente.');
      const existingUser = users.find((candidate) => candidate.email === normalizedEmail);
      let resolvedUser: StoredUser;
      if (existingUser) {
        resolvedUser = existingUser;
      } else {
        resolvedUser = {
          name: buildNameFromEmail(normalizedEmail),
          email: normalizedEmail,
          password,
          phoneNumber: '',
          age: undefined,
          prefersSimplified: false,
        };
        setUsers((prev) => [...prev, resolvedUser]);
      }
      setActiveUser(resolvedUser);
      syncBankData(normalizedEmail, resolvedUser.name);
      setActiveTab('home');
      setRootScreen('dashboard');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No fue posible iniciar sesión.';
      setLoginError(message);
    }
  };

  const handleRegister = async ({ name, email, password, phoneNumber, age }: RegisterPayload) => {
    const normalizedEmail = email.trim().toLowerCase();
    setRegisterError(null);
    if (users.some((candidate) => candidate.email === normalizedEmail)) {
      setRegisterError('Ya existe una cuenta registrada con este correo.');
      return;
    }
    try {
      await registerWithBackend({
        name: sanitizedName,
        email: normalizedEmail,
        password,
        phone_number: sanitizedPhone,
        age: sanitizedAge ?? 18,
      });
      const sanitizedName = name.trim() || 'Cliente Open Finances';
      const sanitizedPhone = phoneNumber.trim();
      const sanitizedAge = Number.isFinite(age) ? age : undefined;
      const newUser: StoredUser = {
        name: sanitizedName,
        email: normalizedEmail,
        password,
        phoneNumber: sanitizedPhone,
        age: sanitizedAge,
        prefersSimplified: false,
      };
      setUsers((prev) => [...prev, newUser]);
      setRegisterSuccessContext({
        userEmail: normalizedEmail,
        userName: sanitizedName,
        age: sanitizedAge,
      });
      setRootScreen('registerSuccess');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No fue posible crear la cuenta.';
      setRegisterError(message);
    }
  };

  const handleRegisterSuccessChoice = (preference: 'simplified' | 'normal') => {
    if (!registerSuccessContext) {
      openLogin();
      return;
    }
    const { userEmail } = registerSuccessContext;
    const prefersSimplified = preference === 'simplified';
    setUsers((prev) =>
      prev.map((user) => (user.email === userEmail ? { ...user, prefersSimplified } : user))
    );
    if (activeUser && activeUser.email === userEmail) {
      const updatedUser = { ...activeUser, prefersSimplified };
      setActiveUser(updatedUser);
      setSimplifiedMode(prefersSimplified);
    }
    setRegisterSuccessContext(null);
    setLoginMessage('Cuenta creada correctamente. Inicia sesión para continuar.');
    openLogin({ keepMessage: true });
  };

  const handleToggleSimplified = () => {
    const next = !simplifiedMode;
    setSimplifiedMode(next);
    if (activeUser) {
      const updatedUser = { ...activeUser, prefersSimplified: next };
      setActiveUser(updatedUser);
      setUsers((prev) =>
        prev.map((user) => (user.email === activeUser.email ? updatedUser : user))
      );
    }
  };

  const handleToggleVoiceCommands = () => {
    setVoiceCommandsEnabled((prev) => {
      const next = !prev;
      AsyncStorage.setItem(VOICE_PREF_KEY, next ? 'true' : 'false');
      return next;
    });
  };

  const handleLogout = () => {
    setActiveUser(null);
    setActiveTab('home');
    resetFeedback();
    setRootScreen('welcome');
    clearSession();
    setBankAccount(null);
    setBankSyncError(null);
    AccessibilityInfo.announceForAccessibility('Sesión cerrada');
  };

  const handleVoiceGoBack = () => {
    if (rootScreen === 'transfer') {
      setRootScreen('dashboard');
      return;
    }
    if (rootScreen === 'openBanking') {
      setRootScreen('dashboard');
      return;
    }
    if (rootScreen === 'openFinanceModules') {
      setActiveOpenFinanceModule(null);
      setRootScreen('dashboard');
      return;
    }
    if (rootScreen === 'register') {
      openLogin();
      return;
    }
    if (rootScreen === 'registerSuccess') {
      goToRegister();
      return;
    }
    if (rootScreen === 'about') {
      setRootScreen('welcome');
      return;
    }
    if (rootScreen === 'login') {
      setRootScreen('welcome');
      return;
    }
    if (rootScreen === 'dashboard' && activeTab !== 'home') {
      setActiveTab('home');
    }
  };

  const openTransfer = React.useCallback(() => {
    setRootScreen('transfer');
  }, []);

  const openOpenBankingFlow = React.useCallback(() => {
    setRootScreen('openBanking');
  }, []);

  const openOpenFinanceModule = React.useCallback((module: OpenFinanceModuleKey) => {
    setActiveOpenFinanceModule(module);
    setRootScreen('openFinanceModules');
  }, []);

  const voiceActionHandlers = React.useMemo<
    Partial<Record<VoiceIntentId, VoiceIntentHandler>>
  >(
    () => ({
      openCart: () => {
        setRootScreen('dashboard');
        setActiveTab('home');
      },
      searchFlight: (match) => {
        const flightNumber = match.slots.flightNumber ?? '';
        setRootScreen('dashboard');
        setActiveTab('search');
        setVoiceFlightQuery(flightNumber || null);
      },
      goBack: () => {
        handleVoiceGoBack();
      },
      createOrder: () => {
        if (rootScreen !== 'transfer') {
          openTransfer();
        }
      },
      openSettings: () => {
        setRootScreen('dashboard');
        setActiveTab('settings');
      },
    }),
    [
      handleVoiceGoBack,
      openTransfer,
      rootScreen,
      setActiveTab,
      setRootScreen,
      setVoiceFlightQuery,
    ]
  );

  const voice = useVoiceCommands({
    enabled: voiceCommandsEnabled,
    handlers: voiceActionHandlers,
    locale: voiceLocale,
  });

  const renderDashboardContent = () => {
    if (simplifiedMode) {
      const resolvedEmail = bankAccount?.email ?? activeUser?.email ?? lastLoginEmail ?? undefined;
      return (
        <SimplifiedDashboard
          userName={activeUser?.name ?? 'Juan Pérez'}
          userEmail={resolvedEmail}
          bankAccount={bankAccount}
          bankSyncing={isBankSyncing}
          bankError={bankSyncError}
          onRefreshBank={() => {
            const targetEmail = bankAccount?.email ?? activeUser?.email ?? lastLoginEmail;
            if (!targetEmail) {
              setBankSyncError('Necesitas iniciar sesión para sincronizar tu cuenta bancaria.');
              return;
            }
            const targetName = activeUser?.name ?? buildNameFromEmail(targetEmail);
            setBankSyncError(null);
            syncBankData(targetEmail, targetName);
          }}
          onExitSimplified={() => {
            setSimplifiedMode(false);
            setActiveTab('home');
          }}
        />
      );
    }
    if (activeTab === 'search') {
      return (
        <SearchScreen
          voiceFlightQuery={voiceFlightQuery ?? undefined}
          onClearVoiceQuery={() => setVoiceFlightQuery(null)}
        />
      );
    }
    if (activeTab === 'investments') {
      return <InvestmentsScreen />;
    }
    if (activeTab === 'loans') {
      return <LoansScreen />;
    }
    if (activeTab === 'settings') {
      return (
        <SettingsScreen
          user={activeUser ?? undefined}
          simplifiedMode={simplifiedMode}
          onToggleSimplified={handleToggleSimplified}
          voiceCommandsEnabled={voiceCommandsEnabled}
          onToggleVoiceCommands={handleToggleVoiceCommands}
          voiceController={{
            listening: voice.listening,
            status: voice.status,
            onStart: () => voice.startListening(),
            onStop: () => voice.stopListening(),
            error: voice.error,
            transcript: voice.transcript,
            locale: voice.locale,
          }}
          onLogout={handleLogout}
        />
      );
    }
    return (
      <HomeScreen
        userName={activeUser?.name ?? 'Juan Pérez'}
        onTransfer={openTransfer}
        simplifiedMode={simplifiedMode}
        onOpenBankConnections={openOpenBankingFlow}
        onOpenFinanceModule={openOpenFinanceModule}
      />
    );
  };

  const renderCurrentScreen = () => {
    switch (rootScreen) {
      case 'welcome':
        return (
          <WelcomeScreen
            onGetStarted={() => openLogin()}
            onShowInfo={() => setRootScreen('about')}
          />
        );
      case 'about':
        return (
          <InfoScreen onBack={() => setRootScreen('welcome')} onStart={() => goToRegister()} />
        );
      case 'login':
        return (
          <LoginScreen
            onSubmit={handleLogin}
            error={loginError}
            info={loginMessage}
            onNavigateToRegister={goToRegister}
            onBack={() => {
              resetFeedback();
              setRootScreen('welcome');
            }}
          />
        );
      case 'register':
        return (
          <RegisterScreen
            onSubmit={handleRegister}
            error={registerError}
            onBack={() => openLogin()}
          />
        );
      case 'registerSuccess':
        if (!registerSuccessContext) {
          return null;
        }
        return (
          <RegisterSuccessScreen
            userName={registerSuccessContext.userName}
            age={registerSuccessContext.age}
            onBack={() => goToRegister()}
            onChooseSimplified={() => handleRegisterSuccessChoice('simplified')}
            onKeepDefault={() => handleRegisterSuccessChoice('normal')}
          />
        );
      case 'transfer':
        return <TransferFlow onClose={() => setRootScreen('dashboard')} />;
      case 'openBanking':
        return <OpenBankingFlow onClose={() => setRootScreen('dashboard')} />;
      case 'openFinanceModules':
        return (
          <OpenFinanceModulesScreen
            module={activeOpenFinanceModule ?? undefined}
            onBack={() => {
              setActiveOpenFinanceModule(null);
              setRootScreen('dashboard');
            }}
          />
        );
      case 'dashboard':
      default:
        return (
          <View className={`flex-1 ${simplifiedMode ? 'bg-gray-50' : 'bg-[#050505]'}`}>
            <View className="flex-1">{renderDashboardContent()}</View>
            {!simplifiedMode && (
              <Navbar activeTab={activeTab} onChange={setActiveTab} appearance="dark" />
            )}
          </View>
        );
    }
  };

  return (
    <View className={`flex-1 ${simplifiedMode ? 'bg-gray-50' : 'bg-[#050505]'}`}>
      <StatusBar
        style={simplifiedMode ? 'dark' : 'light'}
        backgroundColor={simplifiedMode ? '#f5f7fb' : '#030712'}
      />
      {renderCurrentScreen()}
    </View>
  );
}
