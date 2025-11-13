import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Image } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import { Beneficiary } from './TransferFlow';

type TransferScreenProps = {
  onClose: () => void;
  beneficiaries: Beneficiary[];
  onAddBeneficiary: () => void;
};

const paymentMethods = [
  { id: 'visa', label: 'VISA •••• 1234' },
  { id: 'master', label: 'MasterCard •••• 0912' },
  { id: 'amex', label: 'AMEX •••• 7722' },
  { id: 'discover', label: 'Discover •••• 5544' },
];

const transactions = [
  { id: 'number', label: 'Transferencia mediante número de cuenta', icon: 'card-outline' },
  { id: 'same', label: 'Transfer to the same bank', icon: 'person-outline' },
  { id: 'other', label: 'Transfer to another bank', icon: 'business-outline' },
];

export default function TransferScreen({
  onClose,
  beneficiaries,
  onAddBeneficiary,
}: TransferScreenProps) {
  const [selectedMethod, setSelectedMethod] = React.useState(paymentMethods[0].id);
  const [showMethods, setShowMethods] = React.useState(false);
  const [selectedTransaction, setSelectedTransaction] = React.useState('number');
  const [selectedBeneficiary, setSelectedBeneficiary] = React.useState<Beneficiary | null>(
    beneficiaries[0] ?? null
  );
  const [saveBeneficiary, setSaveBeneficiary] = React.useState(true);

  return (
    <View className="flex-1 bg-white">
      <View className="flex-row items-center px-6 pb-4 pt-14">
        <TouchableOpacity
          onPress={onClose}
          className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-gray-100">
          <Ionicons name="chevron-back" size={20} color="#111827" />
        </TouchableOpacity>
        <Text className="text-2xl font-semibold text-gray-900">Transfer</Text>
      </View>

      <ScrollView className="flex-1 px-6" contentContainerStyle={{ paddingBottom: 32 }}>
        <View className="mb-8">
          <Text className="text-sm font-semibold text-gray-400">Payment method</Text>
          <TouchableOpacity
            onPress={() => setShowMethods((prev) => !prev)}
            className="mt-2 flex-row items-center justify-between rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3">
            <Text className="text-base font-semibold text-gray-900">
              {paymentMethods.find((p) => p.id === selectedMethod)?.label}
            </Text>
            <Ionicons
              name={showMethods ? 'chevron-up' : 'chevron-down'}
              size={18}
              color="#9CA3AF"
            />
          </TouchableOpacity>
          {showMethods && (
            <View className="mt-2 rounded-2xl border border-gray-200 bg-white">
              {paymentMethods.map((method) => (
                <TouchableOpacity
                  key={method.id}
                  onPress={() => {
                    setSelectedMethod(method.id);
                    setShowMethods(false);
                  }}
                  className={`flex-row items-center justify-between px-4 py-3 ${
                    method.id === selectedMethod ? 'bg-gray-100' : ''
                  }`}>
                  <Text className="text-base text-gray-900">{method.label}</Text>
                  {method.id === selectedMethod && (
                    <Ionicons name="checkmark-circle" size={20} color="#16A34A" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}
          <Text className="mt-3 text-sm text-gray-500">Available balance : 10,000$</Text>
        </View>

        <Text className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-400">
          Choose transaction
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-1 mb-6">
          {transactions.map((tx) => {
            const isActive = tx.id === selectedTransaction;
            return (
              <TouchableOpacity
                key={tx.id}
                onPress={() => setSelectedTransaction(tx.id)}
                className={`mx-1 w-48 rounded-3xl px-4 py-5 ${
                  isActive ? 'bg-gray-900' : 'bg-gray-100'
                }`}
                style={cardShadow}>
                <Ionicons
                  name={tx.icon as keyof typeof Ionicons.glyphMap}
                  size={24}
                  color={isActive ? '#FFFFFF' : '#4B5563'}
                />
                <Text
                  className={`mt-3 text-sm font-semibold ${
                    isActive ? 'text-white' : 'text-gray-600'
                  }`}>
                  {tx.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View className="mb-4 flex-row items-center justify-between">
          <Text className="text-sm font-semibold uppercase tracking-wide text-gray-400">
            Choose beneficiary
          </Text>
          <TouchableOpacity onPress={onAddBeneficiary}>
            <Text className="text-sm font-semibold text-gray-900">Find beneficiary</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-1 mb-6">
          <TouchableOpacity
            onPress={onAddBeneficiary}
            className="mx-1 h-16 w-16 items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50">
            <Ionicons name="add-outline" size={24} color="#6B7280" />
          </TouchableOpacity>
          {beneficiaries.map((beneficiary) => {
            const isSelected = selectedBeneficiary?.id === beneficiary.id;
            return (
              <TouchableOpacity
                key={beneficiary.id}
                onPress={() => setSelectedBeneficiary(beneficiary)}
                className="mx-1 items-center">
                <Image
                  source={{ uri: beneficiary.avatar }}
                  className={`h-16 w-16 rounded-2xl ${
                    isSelected ? 'border-2 border-gray-900' : ''
                  }`}
                />
                <Text
                  className={`mt-2 text-xs font-semibold ${
                    isSelected ? 'text-gray-900' : 'text-gray-500'
                  }`}>
                  {beneficiary.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View className="rounded-3xl bg-white p-5" style={cardShadow}>
          <View style={{ gap: 20 }}>
            <TextInput
              placeholder="Beneficiary name"
              placeholderTextColor="#9CA3AF"
              value={selectedBeneficiary?.name ?? ''}
              className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-base text-gray-900"
            />
            <TextInput
              placeholder="Account number"
              placeholderTextColor="#9CA3AF"
              value={selectedBeneficiary?.account ?? ''}
              className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-base text-gray-900"
            />
            <TextInput
              placeholder="$1000"
              placeholderTextColor="#9CA3AF"
              className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-base text-gray-900"
            />
            <TextInput
              placeholder="Description"
              placeholderTextColor="#9CA3AF"
              className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-base text-gray-900"
            />
          </View>

          <View className="mt-4 flex-row items-center">
            <TouchableOpacity
              onPress={() => setSaveBeneficiary((prev) => !prev)}
              className={`mr-3 h-5 w-5 items-center justify-center rounded ${
                saveBeneficiary ? 'bg-gray-900' : 'bg-gray-200'
              }`}>
              {saveBeneficiary && <Ionicons name="checkmark" size={12} color="#fff" />}
            </TouchableOpacity>
            <Text className="text-sm text-gray-700">Save to directory of beneficiary</Text>
          </View>

          <TouchableOpacity className="mt-6 rounded-2xl bg-gray-900 py-4">
            <Text className="text-center text-base font-semibold text-white">Confirm</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const cardShadow = {
  shadowColor: '#CBD5F5',
  shadowOffset: { width: 0, height: 10 },
  shadowOpacity: 0.25,
  shadowRadius: 14,
  elevation: 6,
};
