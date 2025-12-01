import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  AccessibilityInfo,
  SafeAreaView,
  useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as LocalAuthentication from 'expo-local-authentication';

type LoginScreenProps = {
  onSubmit: (payload: { email: string; password: string }) => void;
  onNavigateToRegister: () => void;
  onBack: () => void;
  error?: string | null;
  info?: string | null;
};

const highlights = [
  {
    icon: 'shield-checkmark-outline',
    title: 'Seguridad total',
    description: 'Autenticación biométrica, monitoreo y protección antifraude en tiempo real.',
  },
  {
    icon: 'pulse-outline',
    title: 'Insights proactivos',
    description: 'Detectamos variaciones de gasto y oportunidades de ahorro para ti.',
  },
];

const HIT_SLOP = { top: 12, right: 12, bottom: 12, left: 12 };

export default function LoginScreen({
  onSubmit,
  onNavigateToRegister,
  onBack,
  error,
  info,
}: LoginScreenProps) {
  const { width } = useWindowDimensions();
  const formWidth = Math.min(width - 32, 420);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [localError, setLocalError] = React.useState<string | null>(null);
  const [biometricError, setBiometricError] = React.useState<string | null>(null);
  const [canUseBiometric, setCanUseBiometric] = React.useState(false);
  const [supportsFace, setSupportsFace] = React.useState(false);
  const [supportsFingerprint, setSupportsFingerprint] = React.useState(false);

  const feedback = localError || error || biometricError || info;
  const feedbackType = biometricError || error || localError ? 'error' : info ? 'info' : null;

  React.useEffect(() => {
    const checkBiometrics = async () => {
      try {
        const hasHardware = await LocalAuthentication.hasHardwareAsync();
        const isEnrolled = await LocalAuthentication.isEnrolledAsync();
        if (!(hasHardware && isEnrolled)) {
          setCanUseBiometric(false);
          setSupportsFace(false);
          setSupportsFingerprint(false);
          return;
        }
        const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
        const face = types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION);
        const fingerprint = types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT);
        setSupportsFace(face);
        setSupportsFingerprint(fingerprint);
        setCanUseBiometric(face || fingerprint);
      } catch {
        setCanUseBiometric(false);
        setSupportsFace(false);
        setSupportsFingerprint(false);
      }
    };
    checkBiometrics();
  }, []);

  const handleSubmit = () => {
    if (!email.trim() || !password) {
      setLocalError('Completa todos los campos.');
      return;
    }
    setLocalError(null);
    setBiometricError(null);
    onSubmit({ email, password });
  };

  const runBiometricFlow = async (options?: LocalAuthentication.LocalAuthenticationOptions) => {
    if (!canUseBiometric) {
      setBiometricError('La autenticación biométrica no está disponible.');
      return;
    }
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Usa tu huella para acceder',
        fallbackLabel: 'Ingresar con contraseña',
        cancelLabel: 'Cancelar',
        ...options,
      });
      if (result.success) {
        setLocalError(null);
        setBiometricError(null);
        const fallbackEmail = email.trim() || 'demo@openfin.mx';
        const fallbackPassword = password || 'biometric-login';
        onSubmit({ email: fallbackEmail, password: fallbackPassword });
      } else if (result.error || result.warning) {
        setBiometricError('Autenticación cancelada.');
      }
    } catch {
      setBiometricError('No fue posible validar la huella.');
    }
  };

  React.useEffect(() => {
    if (feedback) {
      AccessibilityInfo.announceForAccessibility(feedback);
    }
  }, [feedback]);

  const featureCard = (
    <View className="rounded-3xl border border-gray-100 bg-white/80 p-4 shadow-sm shadow-emerald-50">
      {highlights.map((item) => (
        <View key={item.title} className="mb-4 flex-row items-start gap-3">
          <Ionicons name={item.icon as any} size={22} color="#10b981" />
          <View className="flex-1">
            <Text className="font-semibold text-gray-900">{item.title}</Text>
            <Text className="text-sm text-gray-600">{item.description}</Text>
          </View>
        </View>
      ))}
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-[#f4f6fb]">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <LinearGradient
          colors={['#2dd4bf', '#2563eb']}
          className="rounded-b-[32px] pb-8 pt-10"
          style={{ paddingTop: Platform.OS === 'ios' ? 0 : 32 }}>
          <View className="flex-row items-center justify-between px-6">
          <TouchableOpacity
            onPress={onBack}
            accessibilityRole="button"
            accessibilityLabel="Regresar"
            accessibilityHint="Vuelve a la pantalla anterior"
            hitSlop={HIT_SLOP}
            className="flex-row items-center gap-2">
            <Ionicons name="arrow-back" size={20} color="#fff" />
            <Text className="text-base font-semibold text-white">Retroceder</Text>
          </TouchableOpacity>
          <Ionicons name="lock-closed-outline" size={20} color="#fff" />
          </View>
          <View className="px-6 pt-4">
            <Text className="text-3xl font-semibold text-white">Bienvenido de nuevo</Text>
            <Text className="text-sm text-white/80">Ingresa tus datos para iniciar sesión</Text>
          </View>
        </LinearGradient>

        <ScrollView
          className="-mt-6 flex-1 rounded-t-[32px] bg-white"
          contentContainerStyle={{ paddingBottom: 48, alignItems: 'center' }}>
          <View
            className="w-full px-6 pt-8"
            style={{
              width: formWidth,
            }}>
            <View
              className="rounded-[32px] border border-gray-100 bg-white px-4 py-6 shadow-lg shadow-slate-200/60"
              style={{ elevation: 4 }}>
          <View className="mb-4">
            <TextInput
              className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4 text-gray-900"
              placeholder="Correo electrónico"
              placeholderTextColor="#9ca3af"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
            />
          </View>

          <View className="mb-2">
            <View className="relative">
              <TextInput
                className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4 pr-12 text-gray-900"
                placeholder="Contraseña"
                placeholderTextColor="#9ca3af"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                onPress={() => setShowPassword((prev) => !prev)}
                accessibilityRole="button"
                accessibilityLabel={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                accessibilityHint="Alterna la visibilidad del campo de contraseña"
                hitSlop={HIT_SLOP}
                className="absolute right-4 top-4">
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={22}
                  color="#6b7280"
                />
              </TouchableOpacity>
            </View>
          </View>

          {feedback && (
            <View
              className={`mb-4 rounded-2xl border px-4 py-3 ${
                feedbackType === 'error'
                  ? 'border-red-200 bg-red-50'
                  : 'border-emerald-200 bg-emerald-50'
              }`}>
              <Text
                className={`text-sm ${
                  feedbackType === 'error' ? 'text-red-700' : 'text-emerald-700'
                }`}>
                {feedback}
              </Text>
            </View>
          )}

          <TouchableOpacity
            onPress={handleSubmit}
            accessibilityRole="button"
            accessibilityLabel="Iniciar sesión"
            accessibilityHint="Envía el formulario con tus datos"
            className="mb-4 flex-row items-center justify-between rounded-2xl bg-emerald-100 px-6 py-4">
            <Text className="text-base font-semibold text-gray-900">Iniciar sesión</Text>
            <Ionicons name="arrow-forward" size={20} color="#111827" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onNavigateToRegister}
            accessibilityRole="button"
            accessibilityLabel="Crear cuenta"
            accessibilityHint="Abre el formulario de registro"
            className="mb-6 flex-row items-center justify-between rounded-2xl border border-gray-200 px-6 py-4">
            <Text className="text-base font-semibold text-gray-900">Crear cuenta</Text>
            <Ionicons name="person-add-outline" size={20} color="#111827" />
          </TouchableOpacity>

          {canUseBiometric && (
            <View className="mb-6 rounded-3xl border border-gray-100 bg-white p-4 shadow-sm shadow-emerald-50">
              <Text className="mb-3 text-sm font-semibold text-gray-900">
                Ingresa con biometría
              </Text>
              <View className="flex-row gap-3">
                {supportsFingerprint && (
                  <TouchableOpacity
                    onPress={() => runBiometricFlow()}
                    accessibilityRole="button"
                    accessibilityLabel="Ingresar con huella"
                    accessibilityHint="Inicia sesión utilizando tu huella digital"
                    className="flex-1 items-center rounded-2xl border border-gray-200 px-4 py-3">
                    <Ionicons name="finger-print-outline" size={22} color="#111827" />
                    <Text className="mt-2 text-sm font-semibold text-gray-800">Huella</Text>
                  </TouchableOpacity>
                )}
                {supportsFace && (
                  <TouchableOpacity
                    onPress={() =>
                      runBiometricFlow({
                        promptMessage: 'Usa FaceID para acceder',
                      })
                    }
                    accessibilityRole="button"
                    accessibilityLabel="Ingresar con Face ID"
                    accessibilityHint="Inicia sesión usando reconocimiento facial"
                    className="flex-1 items-center rounded-2xl border border-gray-200 px-4 py-3">
                    <Ionicons name="happy-outline" size={22} color="#111827" />
                    <Text className="mt-2 text-sm font-semibold text-gray-800">Face ID</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}

              {featureCard}
            </View>
          </View>
      </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
