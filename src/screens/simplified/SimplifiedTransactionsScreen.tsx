import React from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { fetchSimplifiedHistory, type SimplifiedTransferHistoryItem } from '../../api/bank';

type Transaction = {
  id: string;
  beneficiary: string;
  relation: string;
  amount: string;
  direction: 'out' | 'in';
  timestamp: string;
};

type SimplifiedTransactionsScreenProps = {
  onBack: () => void;
  userEmail?: string;
};

function normalizeHistory(data: SimplifiedTransferHistoryItem[]): Transaction[] {
  return data.map((item) => ({
    id: String(item.id),
    beneficiary: item.beneficiary.name,
    relation: item.beneficiary.relation ?? 'Contacto',
    amount:
      (item.direction === 'out' ? '-' : '+') +
      Number(item.amount).toLocaleString('es-MX', {
        style: 'currency',
        currency: 'MXN',
        minimumFractionDigits: 2,
      }),
    direction: item.direction,
    timestamp: new Date(item.timestamp).toLocaleString('es-MX', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }),
  }));
}

export default function SimplifiedTransactionsScreen({ onBack, userEmail }: SimplifiedTransactionsScreenProps) {
  const [loading, setLoading] = React.useState(true);
  const [history, setHistory] = React.useState<Transaction[]>([]);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!userEmail) {
      setLoading(false);
      setError('Inicia sesión para consultar tus movimientos.');
      return;
    }
    setLoading(true);
    fetchSimplifiedHistory(userEmail)
      .then((response) => {
        setHistory(normalizeHistory(response.transactions));
        setError(null);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'No pudimos obtener el historial.');
      })
      .finally(() => setLoading(false));
  }, [userEmail]);

  return (
    <View className="flex-1 bg-white">
      <View className="flex-row items-center gap-3 px-6 pb-3 pt-14">
        <TouchableOpacity
          onPress={onBack}
          accessibilityRole="button"
          accessibilityLabel="Regresar"
          accessibilityHint="Vuelve al panel principal"
          className="flex-row items-center gap-2">
          <Ionicons name="chevron-back" size={22} color="#111827" />
          <Text className="text-lg font-semibold text-gray-900">Movimientos</Text>
        </TouchableOpacity>
        <View className="flex-1 items-end">
          {userEmail ? <Text className="text-xs uppercase text-gray-400">{userEmail}</Text> : null}
        </View>
      </View>
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#4338ca" />
          <Text className="mt-3 text-sm text-gray-500">Sincronizando movimientos...</Text>
        </View>
      ) : error ? (
        <View className="flex-1 items-center justify-center px-6">
          <Ionicons name="warning" size={42} color="#f59e0b" />
          <Text className="mt-4 text-base font-semibold text-gray-800">{error}</Text>
        </View>
      ) : (
        <ScrollView className="px-6" contentContainerStyle={{ paddingBottom: 48, paddingTop: 8 }}>
          {history.map((tx) => (
            <View
              key={tx.id}
              className="mb-4 rounded-3xl border border-gray-100 bg-gray-50 px-5 py-4 shadow-sm"
              accessible
              accessibilityRole="summary"
              accessibilityLabel={`Transferencia a ${tx.beneficiary}, ${tx.amount}, ${tx.timestamp}`}>
              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="text-base font-semibold text-gray-900">{tx.beneficiary}</Text>
                  <Text className="text-sm text-gray-500">{tx.relation}</Text>
                </View>
                <View className="items-end">
                  <Text
                    className={`text-base font-semibold ${tx.direction === 'out' ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {tx.amount}
                  </Text>
                  <Text className="text-xs uppercase text-gray-400">{tx.timestamp}</Text>
                </View>
              </View>
            </View>
          ))}
          {history.length === 0 && (
            <View className="mt-20 items-center">
              <Ionicons name="download-outline" size={48} color="#cbd5f5" />
              <Text className="mt-4 text-base font-semibold text-gray-700">
                No hay movimientos recientes
              </Text>
              <Text className="text-sm text-gray-500">Tus transferencias aparecerán aquí automáticamente.</Text>
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
}

//# sourceMappingURL=SimplifiedTransactionsScreen.tsx.map
