import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

type FeedbackMessage = {
  pre: string;
  emphasis: string;
  post?: string;
};

type SimplifiedFeedbackViewProps = {
  status: 'success' | 'error';
  heading: string;
  message: FeedbackMessage;
  detail?: string;
  showStatusTabs?: boolean;
  onReturnHome: () => void;
  onBack: () => void;
};

export default function SimplifiedFeedbackView({
  status,
  heading,
  message,
  detail,
  showStatusTabs,
  onReturnHome,
  onBack,
}: SimplifiedFeedbackViewProps) {
  const accentTextClass = status === 'success' ? 'text-emerald-500' : 'text-rose-500';
  const buttonClass = status === 'success' ? 'bg-emerald-100' : 'bg-rose-100';
  const buttonTextClass = status === 'success' ? 'text-emerald-900' : 'text-rose-900';
  const buttonIconColor = status === 'success' ? '#065F46' : '#7F1D1D';

  const statusTabs = (
    showStatusTabs
      ? (
          <View className="mt-6 flex-row gap-3" accessibilityRole="tablist">
            {[
              { key: 'success', label: 'Confirmación' },
              { key: 'error', label: 'Error' },
            ].map((tab) => {
              const isActive = tab.key === status;
              return (
                <View
                  key={tab.key}
                  accessibilityRole="tab"
                  accessibilityState={{ selected: isActive }}
                  className={`flex-1 rounded-2xl px-4 py-3 ${
                    isActive ? buttonClass : 'bg-gray-100'
                  }`}>
                  <Text
                    className={`text-center text-base font-semibold ${
                      isActive ? buttonTextClass : 'text-gray-600'
                    }`}>
                    {tab.label}
                  </Text>
                </View>
              );
            })}
          </View>
        )
      : null
  );

  return (
    <View className="flex-1 bg-white px-6 pb-10 pt-14">
      <TouchableOpacity
        onPress={onBack}
        accessibilityRole="button"
        accessibilityLabel={`Regresar desde ${heading}`}
        accessibilityHint="Vuelve al paso anterior"
        className="flex-row items-center gap-2">
        <Ionicons name="chevron-back" size={20} color="#111827" />
        <Text className="text-xl font-semibold text-gray-900">{heading}</Text>
      </TouchableOpacity>

      <View className="mt-12">
        <Text className="text-3xl leading-[44px] text-gray-900" accessibilityRole="header">
          {message.pre}
          <Text className={`font-semibold ${accentTextClass}`}>{message.emphasis}</Text>
          {message.post}
        </Text>
        {detail ? <Text className="mt-4 text-xl text-gray-600">{detail}</Text> : null}
        {statusTabs}
      </View>

      <View className="mt-auto">
        <TouchableOpacity
          onPress={onReturnHome}
          accessibilityRole="button"
          accessibilityLabel="Volver al inicio"
          accessibilityHint="Regresa a la pantalla principal simplificada"
          className={`rounded-3xl px-4 py-4 ${buttonClass}`}>
          <View className="flex-row items-center justify-between">
            <Text className={`text-base font-semibold ${buttonTextClass}`}>Volver al Inicio</Text>
            <Ionicons name="arrow-forward" size={18} color={buttonIconColor} />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}
