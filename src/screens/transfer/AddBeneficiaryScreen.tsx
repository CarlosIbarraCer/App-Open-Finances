import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

type AddBeneficiaryScreenProps = {
  onBack: () => void;
  onSave: (payload: { name: string; account: string }) => void;
};

export default function AddBeneficiaryScreen({ onBack, onSave }: AddBeneficiaryScreenProps) {
  const [name, setName] = React.useState('');
  const [account, setAccount] = React.useState('');
  const [bank, setBank] = React.useState('');
  const [email, setEmail] = React.useState('');

  const isDisabled = !name.trim() || !account.trim() || !bank.trim();

  const handleSave = () => {
    if (isDisabled) return;
    onSave({ name, account });
  };

  return (
    <View className="flex-1 bg-white">
      <View className="flex-row items-center px-6 pb-4 pt-14">
        <TouchableOpacity
          onPress={onBack}
          className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-gray-100">
          <Ionicons name="chevron-back" size={20} color="#111827" />
        </TouchableOpacity>
        <Text className="text-2xl font-semibold text-gray-900">Add beneficiary</Text>
      </View>

      <ScrollView className="flex-1 px-6" contentContainerStyle={{ paddingBottom: 32 }}>
        <View className="rounded-3xl bg-white p-5" style={cardShadow}>
          <Text className="text-sm font-semibold uppercase tracking-wide text-gray-400">
            Basic info
          </Text>

          <View className="mt-5" style={{ gap: 24 }}>
            <TextInput
              placeholder="Full name"
              placeholderTextColor="#9CA3AF"
              value={name}
              onChangeText={setName}
              className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-base text-gray-900"
            />
            <TextInput
              placeholder="Account number"
              placeholderTextColor="#9CA3AF"
              keyboardType="number-pad"
              value={account}
              onChangeText={setAccount}
              className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-base text-gray-900"
            />
            <TextInput
              placeholder="Bank"
              placeholderTextColor="#9CA3AF"
              value={bank}
              onChangeText={setBank}
              className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-base text-gray-900"
            />
            <TextInput
              placeholder="Email (optional)"
              placeholderTextColor="#9CA3AF"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
              className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-base text-gray-900"
            />
          </View>

          <TouchableOpacity
            disabled={isDisabled}
            onPress={handleSave}
            className={`mt-6 rounded-2xl py-4 ${isDisabled ? 'bg-gray-300' : 'bg-gray-900'}`}>
            <Text className="text-center text-base font-semibold text-white">Save</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const cardShadow = {
  shadowColor: '#CBD5F5',
  shadowOffset: { width: 0, height: 12 },
  shadowOpacity: 0.25,
  shadowRadius: 16,
  elevation: 8,
};
