import React from 'react';
import { ScrollView, View, Text, TextInput, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';

type CetesInvestmentScreenProps = {
  onBack: () => void;
};

type CetesTerm = {
  id: string;
  label: string;
  days: number;
  rate: number;
  detail: string;
};

const CETES_TERMS: CetesTerm[] = [
  { id: '28', label: '28 días', days: 28, rate: 9.1, detail: 'Liquidez inmediata' },
  { id: '91', label: '3 meses', days: 91, rate: 10.3, detail: 'Rendimiento balanceado' },
  { id: '182', label: '6 meses', days: 182, rate: 10.9, detail: 'Ideal para metas cortas' },
  { id: '364', label: '12 meses', days: 364, rate: 11.4, detail: 'Maximiza tu tasa' },
];

const protectionPoints = [
  'Instrumento emitido por el Gobierno Federal',
  'Operaciones liquidadas en Banco de México',
  'Sin comisiones de apertura o custodia',
];

const formatCurrency = (value: number) =>
  `$${value.toLocaleString('es-MX', { maximumFractionDigits: 2, minimumFractionDigits: 2 })}`;

export default function CetesInvestmentScreen({ onBack }: CetesInvestmentScreenProps) {
  const [amount, setAmount] = React.useState('10000');
  const [selectedTermId, setSelectedTermId] = React.useState<string>(CETES_TERMS[1].id);

  const selectedTerm = React.useMemo(
    () => CETES_TERMS.find((term) => term.id === selectedTermId) ?? CETES_TERMS[0],
    [selectedTermId]
  );

  const numericAmount = React.useMemo(() => Number(amount.replace(/[^0-9]/g, '')) || 0, [amount]);
  const estimatedYield = React.useMemo(() => {
    if (!numericAmount) {
      return 0;
    }
    const dailyRate = selectedTerm.rate / 100 / 360;
    return numericAmount * dailyRate * selectedTerm.days;
  }, [numericAmount, selectedTerm]);

  const totalAtMaturity = numericAmount + estimatedYield;

  return (
    <View className="flex-1 bg-[#f5f7fb]">
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 48 }}>
        <View className="px-6 pb-12 pt-14">
          <View className="mb-6 flex-row items-center justify-between">
            <Pressable
              onPress={onBack}
              className="h-11 w-11 items-center justify-center rounded-2xl border border-gray-200 bg-white shadow-sm">
              <Ionicons name="chevron-back" size={22} color="#111827" />
            </Pressable>
            <View className="flex-1 items-center">
              <Text className="text-xs uppercase tracking-[0.35em] text-gray-400">
                Inversión dirigida
              </Text>
              <Text className="text-lg font-semibold text-gray-900">CETES</Text>
            </View>
            <View className="h-11 w-11 items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50">
              <Ionicons name="shield-checkmark-outline" size={20} color="#059669" />
            </View>
          </View>

          <LinearGradient
            colors={['#e0f2fe', '#eef2ff']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              borderRadius: 32,
              padding: 24,
              marginBottom: 24,
              borderWidth: 1,
              borderColor: 'rgba(147,197,253,0.7)',
            }}>
            <Text className="text-sm text-gray-600">Rendimiento bruto estimado</Text>
            <Text className="mt-1 text-4xl font-semibold text-gray-900">{selectedTerm.rate}%</Text>
            <Text className="mt-2 text-xs text-gray-500">Tasa anual equivalente</Text>
            <View className="mt-4 flex-row gap-3">
              <View className="flex-1 rounded-2xl border border-white/70 bg-white/80 p-4">
                <Text className="text-xs text-gray-500">Plazo</Text>
                <Text className="text-lg font-semibold text-gray-900">{selectedTerm.label}</Text>
              </View>
              <View className="flex-1 rounded-2xl border border-white/70 bg-white/80 p-4">
                <Text className="text-xs text-gray-500">Días</Text>
                <Text className="text-lg font-semibold text-gray-900">{selectedTerm.days}</Text>
              </View>
            </View>
          </LinearGradient>

          <View className="mb-6 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm shadow-indigo-50">
            <Text className="mb-4 text-lg font-semibold text-gray-900">Elige tu plazo</Text>
            <View className="flex-row flex-wrap gap-3">
              {CETES_TERMS.map((term) => {
                const isActive = term.id === selectedTermId;
                return (
                  <Pressable
                    key={term.id}
                    onPress={() => setSelectedTermId(term.id)}
                    accessibilityRole="button"
                    accessibilityState={{ selected: isActive }}
                    accessibilityLabel={`Plazo ${term.label}`}
                    accessibilityHint="Selecciona este plazo"
                    className={`flex-1 rounded-2xl border px-4 py-3 ${
                      isActive ? 'border-emerald-200 bg-emerald-50' : 'border-gray-100 bg-gray-50'
                    }`}>
                    <Text
                      className={`text-sm font-semibold ${
                        isActive ? 'text-emerald-700' : 'text-gray-700'
                      }`}>
                      {term.label}
                    </Text>
                    <Text className="text-xs text-gray-500">{term.detail}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View className="mb-6 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm shadow-indigo-50">
            <Text className="mb-3 text-lg font-semibold text-gray-900">
              ¿Cuánto deseas invertir?
            </Text>
            <TextInput
              value={amount}
              onChangeText={(text) => setAmount(text.replace(/[^0-9]/g, ''))}
              keyboardType="numeric"
              placeholder="Ej. 5000"
              placeholderTextColor="#9ca3af"
              className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4 text-2xl font-semibold text-gray-900"
            />
            <Text className="mt-2 text-xs text-gray-500">
              Monto mínimo $100 • Sin comisión por operación
            </Text>
            <View className="mt-4 flex-row items-center justify-between">
              {[5000, 10000, 20000].map((preset) => (
                <Pressable
                  key={preset}
                  onPress={() => setAmount(String(preset))}
                  accessibilityRole="button"
                  accessibilityLabel={`Invertir ${preset.toLocaleString()} pesos`}
                  accessibilityHint="Rellena el campo con este monto"
                  className="rounded-full border border-gray-200 px-4 py-2">
                  <Text className="text-sm font-semibold text-gray-700">
                    ${preset.toLocaleString()}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View className="mb-6 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm shadow-indigo-50">
            <Text className="mb-4 text-lg font-semibold text-gray-900">Resumen estimado</Text>
            <View className="flex-row items-center justify-between border-b border-gray-100 pb-3">
              <Text className="text-sm text-gray-500">Monto a invertir</Text>
              <Text className="text-base font-semibold text-gray-900">
                {formatCurrency(numericAmount)}
              </Text>
            </View>
            <View className="flex-row items-center justify-between border-b border-gray-100 py-3">
              <Text className="text-sm text-gray-500">Rendimiento aproximado</Text>
              <Text className="text-base font-semibold text-emerald-600">
                {formatCurrency(estimatedYield)}
              </Text>
            </View>
            <View className="flex-row items-center justify-between pt-3">
              <Text className="text-sm text-gray-500">Total al vencimiento</Text>
              <Text className="text-lg font-semibold text-gray-900">
                {formatCurrency(totalAtMaturity)}
              </Text>
            </View>
          </View>

          <View className="mb-8 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm shadow-indigo-50">
            <View className="mb-3 flex-row items-center gap-2">
              <Ionicons name="shield-checkmark" size={20} color="#059669" />
              <Text className="text-lg font-semibold text-gray-900">Protección CETES</Text>
            </View>
            {protectionPoints.map((point) => (
              <View key={point} className="mt-3 flex-row items-center gap-3">
                <View className="h-2 w-2 rounded-full bg-emerald-400" />
                <Text className="flex-1 text-sm text-gray-600">{point}</Text>
              </View>
            ))}
          </View>

          <Pressable
            disabled={!numericAmount}
            accessibilityRole="button"
            accessibilityState={{ disabled: !numericAmount }}
            accessibilityLabel="Confirmar inversión"
            accessibilityHint="Envía la solicitud de inversión en CETES"
            className={`rounded-full py-4 ${
              numericAmount ? 'bg-indigo-600 shadow-lg shadow-indigo-200' : 'bg-gray-300'
            }`}>
            <Text
              className={`text-center text-lg font-semibold ${numericAmount ? 'text-white' : 'text-gray-500'}`}>
              Confirmar inversión
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}
