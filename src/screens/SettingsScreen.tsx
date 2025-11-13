import React from 'react';
import { ScrollView, View, Text, Pressable, Switch } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import VoiceButton from '../components/VoiceButton';
import type { VoiceCommandState } from '../voice/state';
import type { SupportedLocale } from '../voice/intents';

type SettingsScreenProps = {
  user?: {
    name?: string;
    email?: string;
    phoneNumber?: string;
    age?: number;
  };
  simplifiedMode: boolean;
  onToggleSimplified: () => void;
  voiceCommandsEnabled: boolean;
  onToggleVoiceCommands: () => void;
  voiceController?: {
    listening: boolean;
    status: VoiceCommandState['status'];
    onStart: () => void;
    onStop: () => void;
    error?: string | null;
    transcript?: string | null;
    locale: SupportedLocale;
  };
  onLogout: () => void;
};

export default function SettingsScreen({
  user,
  simplifiedMode,
  onToggleSimplified,
  voiceCommandsEnabled,
  onToggleVoiceCommands,
  voiceController,
  onLogout,
}: SettingsScreenProps) {
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [biometricEnabled, setBiometricEnabled] = React.useState(true);
  const [autoSavings, setAutoSavings] = React.useState(false);

  return (
    <View className="flex-1 bg-[#f5f7fb]">
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 48 }}>
        <View className="px-6 pb-12 pt-16">
          <View className="mb-8">
            <Text className="text-xs uppercase tracking-[0.25em] text-gray-400">
              Preferencias personales
            </Text>
            <Text className="text-2xl font-bold text-gray-900">Configuración</Text>
          </View>

          <View className="mb-5 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm shadow-indigo-50">
            <View className="mb-4 flex-row items-center gap-3">
              <View className="h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50">
                <Ionicons name="person-circle-outline" size={26} color="#4338ca" />
              </View>
              <View>
                <Text className="text-lg font-semibold text-gray-900">
                  {user?.name ?? 'Cliente Open Finances'}
                </Text>
                <Text className="text-sm text-gray-500">{user?.email ?? 'demo@openfin.mx'}</Text>
              </View>
            </View>
            <View className="flex-row justify-between border-t border-gray-100 pt-4">
              <View>
                <Text className="text-xs uppercase tracking-wide text-gray-500">Teléfono</Text>
                <Text className="text-sm font-semibold text-gray-900">
                  {user?.phoneNumber ?? '55 5123 4567'}
                </Text>
              </View>
              <View>
                <Text className="text-xs uppercase tracking-wide text-gray-500">Edad</Text>
                <Text className="text-sm font-semibold text-gray-900">{user?.age ?? '—'}</Text>
              </View>
            </View>
          </View>

          <View className="mb-5 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm shadow-indigo-50">
            <Text className="mb-4 text-lg font-semibold text-gray-900">Preferencias</Text>

            <View className="mb-4 flex-row items-center justify-between">
              <View>
                <Text className="font-semibold text-gray-900">Modo oscuro (vista completa)</Text>
                <Text className="text-xs text-gray-500">
                  Desactívalo para volver a la vista simplificada accesible
                </Text>
              </View>
              <Switch
                value={!simplifiedMode}
                onValueChange={onToggleSimplified}
                thumbColor="#4338ca"
              />
            </View>

            <View className="mb-3 flex-row items-start justify-between border-t border-gray-100 pt-4">
              <View className="flex-1 pr-4">
                <Text className="font-semibold text-gray-900">Comandos de voz</Text>
                <Text className="text-xs text-gray-500">
                  Push-to-talk compatible con TalkBack y VoiceOver (es-MX, es-ES, en-US)
                </Text>
                <Text className="mt-1 text-[11px] leading-4 text-gray-400">
                  Grabamos audio solo mientras mantienes presionado el botón. Nada se guarda
                  después de procesar el comando.
                </Text>
              </View>
              <Switch
                value={voiceCommandsEnabled}
                onValueChange={onToggleVoiceCommands}
                thumbColor="#4338ca"
              />
            </View>
            {voiceCommandsEnabled && voiceController ? (
              <View className="mt-3">
                <VoiceButton
                  variant="inline"
                  enabled={voiceCommandsEnabled}
                  listening={voiceController.listening}
                  status={voiceController.status}
                  onStart={voiceController.onStart}
                  onStop={voiceController.onStop}
                  error={voiceController.error}
                  transcript={voiceController.transcript ?? undefined}
                  locale={voiceController.locale}
                />
              </View>
            ) : null}

            <View className="mb-4 flex-row items-center justify-between border-t border-gray-100 pt-4">
              <View>
                <Text className="font-semibold text-gray-900">Notificaciones</Text>
                <Text className="text-xs text-gray-500">Alertas de pago y movimientos</Text>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                thumbColor="#4338ca"
              />
            </View>

            <View className="flex-row items-center justify-between border-t border-gray-100 pt-4">
              <View>
                <Text className="font-semibold text-gray-900">Ahorro automático</Text>
                <Text className="text-xs text-gray-500">Transfiere excedentes a tu meta</Text>
              </View>
              <Switch value={autoSavings} onValueChange={setAutoSavings} thumbColor="#4338ca" />
            </View>
          </View>

          <View className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm shadow-indigo-50">
            <Text className="mb-4 text-lg font-semibold text-gray-900">Seguridad</Text>

            <View className="mb-4 flex-row items-center justify-between">
              <View>
                <Text className="font-semibold text-gray-900">Ingreso biométrico</Text>
                <Text className="text-xs text-gray-500">FaceID o huella activada</Text>
              </View>
              <Switch
                value={biometricEnabled}
                onValueChange={setBiometricEnabled}
                thumbColor="#4338ca"
              />
            </View>

            <Pressable className="mb-4 flex-row items-center justify-between border-t border-gray-100 pt-4">
              <View>
                <Text className="font-semibold text-gray-900">Cambiar contraseña</Text>
                <Text className="text-xs text-gray-500">Última actualización hace 92 días</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#111827" />
            </Pressable>

            <Pressable className="flex-row items-center justify-between border-t border-gray-100 pt-4">
              <View>
                <Text className="font-semibold text-rose-600">Cerrar todas las sesiones</Text>
                <Text className="text-xs text-gray-500">Saldrá de todos los dispositivos</Text>
              </View>
              <Ionicons name="log-out-outline" size={18} color="#dc2626" />
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Cerrar sesión"
              accessibilityHint="Termina tu sesión actual en este dispositivo"
              onPress={onLogout}
              className="mt-4 flex-row items-center justify-between rounded-2xl border border-gray-100 px-4 py-3">
              <View>
                <Text className="font-semibold text-gray-900">Cerrar sesión</Text>
                <Text className="text-xs text-gray-500">Te llevará a la pantalla de inicio</Text>
              </View>
              <Ionicons name="exit-outline" size={18} color="#111827" />
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
