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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';

type RegisterScreenProps = {
  onSubmit: (payload: {
    name: string;
    email: string;
    password: string;
    phoneNumber: string;
    age: number;
  }) => void;
  onBack: () => void;
  error?: string | null;
};

const HIT_SLOP = { top: 12, left: 12, right: 12, bottom: 12 };

export default function RegisterScreen({ onSubmit, onBack, error }: RegisterScreenProps) {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [phoneNumber, setPhoneNumber] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [age, setAge] = React.useState('');
  const [localError, setLocalError] = React.useState<string | null>(null);

  const feedback = localError || error;

  React.useEffect(() => {
    if (feedback) {
      AccessibilityInfo.announceForAccessibility(feedback);
    }
  }, [feedback]);

  const handleSubmit = () => {
    if (!name || !email || !phoneNumber || !password || !confirmPassword || !age) {
      setLocalError('Completa todos los campos.');
      return;
    }
    if (password.length < 6) {
      setLocalError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (password !== confirmPassword) {
      setLocalError('Las contraseñas no coinciden.');
      return;
    }
    const parsedAge = Number(age);
    if (Number.isNaN(parsedAge) || parsedAge <= 0) {
      setLocalError('Ingresa una edad válida.');
      return;
    }

    setLocalError(null);
    onSubmit({ name, email, password, phoneNumber, age: parsedAge });
  };

  const renderInput = (
    label: string,
    value: string,
    onChange: (text: string) => void,
    options?: {
      placeholder?: string;
      keyboardType?: 'default' | 'email-address' | 'phone-pad' | 'numeric';
      secureTextEntry?: boolean;
      autoCapitalize?: 'none' | 'words' | 'sentences' | 'characters';
    }
  ) => (
    <View className="mb-4">
      <Text className="mb-2 text-sm font-semibold text-gray-700">{label}</Text>
      <TextInput
        className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4 text-gray-900"
        value={value}
        onChangeText={onChange}
        placeholder={options?.placeholder ?? label}
        placeholderTextColor="#9ca3af"
        keyboardType={options?.keyboardType}
        secureTextEntry={options?.secureTextEntry}
        autoCapitalize={options?.autoCapitalize ?? 'none'}
      />
    </View>
  );

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <LinearGradient colors={['#46c3db', '#60dbb8']} className="rounded-b-[32px] pb-8 pt-14">
        <View className="flex-row items-center justify-between px-6">
          <TouchableOpacity
            onPress={onBack}
            accessibilityRole="button"
            accessibilityLabel="Regresar"
            accessibilityHint="Vuelve al inicio de sesión"
            hitSlop={HIT_SLOP}
            className="flex-row items-center gap-2">
            <Ionicons name="arrow-back" size={20} color="#fff" />
            <Text className="text-base font-semibold text-white">Retroceder</Text>
          </TouchableOpacity>
          <Ionicons name="id-card-outline" size={20} color="#fff" />
        </View>
        <View className="px-6 pt-6">
          <Text className="text-2xl font-semibold text-white">Vamos a crear tu cuenta</Text>
          <Text className="text-sm text-white/80">
            Es rápido, seguro y sólo necesitamos lo esencial.
          </Text>
        </View>
      </LinearGradient>

      <ScrollView
        className="-mt-6 flex-1 rounded-t-[32px] bg-white"
        contentContainerStyle={{ paddingBottom: 48 }}>
        <View className="px-6 pt-8">
          {renderInput('Nombre', name, setName, { autoCapitalize: 'words' })}
          {renderInput('Correo electrónico', email, setEmail, {
            keyboardType: 'email-address',
            autoCapitalize: 'none',
          })}
          {renderInput('Número de teléfono móvil', phoneNumber, setPhoneNumber, {
            keyboardType: 'phone-pad',
          })}
          {renderInput('Creación de contraseña segura', password, setPassword, {
            secureTextEntry: true,
          })}
          {renderInput('Confirmar contraseña', confirmPassword, setConfirmPassword, {
            secureTextEntry: true,
          })}
          {renderInput('Edad', age, setAge, { keyboardType: 'numeric' })}

          {feedback && (
            <View className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3">
              <Text className="text-sm text-red-700">{feedback}</Text>
            </View>
          )}

          <TouchableOpacity
            onPress={handleSubmit}
            accessibilityRole="button"
            accessibilityLabel="Crear cuenta"
            accessibilityHint="Envía el formulario con tus datos"
            className="mt-2 flex-row items-center justify-between rounded-2xl bg-emerald-100 px-6 py-4">
            <Text className="text-base font-semibold text-gray-900">Crear cuenta</Text>
            <Ionicons name="arrow-forward" size={20} color="#111827" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
