import React from 'react';
import {
  AccessibilityInfo,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  findNodeHandle,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import SimplifiedFeedbackView from './SimplifiedFeedbackView';

type SimplifiedServicesScreenProps = {
  onBack: () => void;
  userName: string;
};

type ServiceStep = 'list' | 'confirm' | 'feedback';

type ServiceBill = {
  id: string;
  provider: string;
  beneficiary: string;
  amount: number;
  description: string;
  background: string;
  titleColor: string;
  captionColor: string;
  mayFail?: boolean;
};

const services: ServiceBill[] = [
  {
    id: 'cfe',
    provider: 'CFE',
    beneficiary: 'Francisco Torres',
    amount: 320,
    description: 'Recibo de CFE de Francisco Torres',
    background: '#065F46',
    titleColor: '#ECFDF5',
    captionColor: '#D1FAE5',
  },
  {
    id: 'telmex',
    provider: 'Telmex',
    beneficiary: 'Paul Rosales',
    amount: 640,
    description: 'Recibo de Telmex de Paul Rosales',
    background: '#0284C7',
    titleColor: '#ECFEFF',
    captionColor: '#CFFAFE',
  },
  {
    id: 'sky',
    provider: 'SKY',
    beneficiary: 'Alonso Juárez',
    amount: 450,
    description: 'Recibo de SKY de Alonso Juárez',
    background: '#E0E7FF',
    titleColor: '#111827',
    captionColor: '#4B5563',
    mayFail: true,
  },
];

const formatCurrency = (value: number) =>
  `$ ${value.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function SimplifiedServicesScreen({ onBack, userName }: SimplifiedServicesScreenProps) {
  const [step, setStep] = React.useState<ServiceStep>('list');
  const [selectedService, setSelectedService] = React.useState<ServiceBill | null>(null);
  const instructionRef = React.useRef<React.ComponentRef<typeof Text>>(null);
  const [feedbackResult, setFeedbackResult] = React.useState<'success' | 'error' | null>(null);

  React.useEffect(() => {
    const announcements: Record<ServiceStep, string> = {
      list: 'Selecciona el servicio que deseas pagar',
      confirm: 'Confirma el pago del servicio seleccionado',
      feedback: 'Resultado del pago de servicio',
    };
    AccessibilityInfo.announceForAccessibility(announcements[step]);
    if (step === 'feedback') {
      return;
    }
    if (typeof AccessibilityInfo.setAccessibilityFocus === 'function') {
      const timeout = setTimeout(() => {
        const node = instructionRef.current ? findNodeHandle(instructionRef.current) : null;
        if (node) {
          AccessibilityInfo.setAccessibilityFocus(node);
        }
      }, 250);
      return () => clearTimeout(timeout);
    }
  }, [step]);

  const goBack = () => {
    if (step === 'list') {
      onBack();
    } else if (step === 'confirm') {
      setStep('list');
      setSelectedService(null);
    } else {
      setStep('confirm');
      setFeedbackResult(null);
    }
  };

  const handleServicePress = (service: ServiceBill) => {
    setSelectedService(service);
    setStep('confirm');
  };

  const handleConfirmPayment = () => {
    const outcome = selectedService?.mayFail ? 'error' : 'success';
    setFeedbackResult(outcome ?? 'success');
    setStep('feedback');
  };

  const resetFlow = () => {
    setStep('list');
    setSelectedService(null);
    setFeedbackResult(null);
    onBack();
  };

  const renderInstruction = (text: string) => (
    <Text
      ref={instructionRef}
      accessibilityRole="header"
      accessibilityLabel={`Paso actual: ${text}`}
      className="mb-3 text-xs uppercase tracking-wide text-gray-500">
      {text}
    </Text>
  );

  const renderList = () => (
    <View>
      {renderInstruction('Da click al servicio que desea pagar')}
      <Text className="mb-4 text-base text-gray-900">
        Servicios guardados para {userName}
      </Text>
      {services.map((service) => (
        <TouchableOpacity
          key={service.id}
          onPress={() => handleServicePress(service)}
          accessibilityRole="button"
          accessibilityLabel={`${service.description}`}
          accessibilityHint="Abre los detalles del servicio"
          className="mb-4 min-h-[128px] rounded-3xl px-6 py-8"
          style={{ backgroundColor: service.background }}>
          <Text className="text-base" style={{ color: service.captionColor }}>
            Recibo de {service.provider} de:
          </Text>
          <Text className="mt-2 text-2xl font-semibold" style={{ color: service.titleColor }}>
            {service.beneficiary}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderConfirm = () => (
    <View className="rounded-3xl bg-white px-5 py-6 shadow">
      <Text
        ref={instructionRef}
        accessibilityRole="header"
        accessibilityLabel={`Paso actual: Confirmar pago de ${selectedService?.provider ?? ''}`}
        className="text-lg font-semibold text-gray-900">
        Confirma tu pago
      </Text>
      <Text className="mt-2 text-sm text-gray-500">
        Revise los datos del servicio antes de confirmar el pago.
      </Text>
      <View
        accessible
        accessibilityRole="summary"
        accessibilityLabel={`Servicio seleccionado: ${selectedService?.provider ?? ''} de ${selectedService?.beneficiary ?? ''}`}
        className="mt-5 rounded-2xl bg-gray-100 px-4 py-3">
        <Text className="text-xs uppercase tracking-wide text-gray-500">Servicio</Text>
        <Text className="text-xl font-semibold text-gray-900">{selectedService?.provider ?? ''}</Text>
        <Text className="text-sm text-gray-500">{selectedService?.beneficiary}</Text>
      </View>
      <View
        accessible
        accessibilityRole="summary"
        accessibilityLabel={`Monto seleccionado: ${formatCurrency(selectedService?.amount ?? 0)} pesos mexicanos`}
        className="mt-4 rounded-2xl bg-gray-100 px-4 py-3">
        <Text className="text-xs uppercase tracking-wide text-gray-500">Monto</Text>
        <Text className="text-2xl font-semibold text-gray-900">
          {formatCurrency(selectedService?.amount ?? 0)}
        </Text>
        <Text className="text-sm text-gray-500">Pesos mexicanos</Text>
      </View>
      <TouchableOpacity
        onPress={handleConfirmPayment}
        accessibilityRole="button"
        accessibilityLabel="Confirmar pago"
        accessibilityHint="Completa el pago del servicio seleccionado"
        className="mt-6 rounded-3xl bg-[#2563EB] px-4 py-4 shadow-lg shadow-indigo-200">
        <Text className="text-center text-base font-semibold text-white">Confirmar pago</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          setStep('list');
          setSelectedService(null);
        }}
        accessibilityRole="button"
        accessibilityLabel="No, quiero volver atrás"
        accessibilityHint="Regresa al listado de servicios"
        className="mt-3 flex-row items-center justify-between rounded-3xl border border-gray-200 px-4 py-4">
        <Text className="text-base font-semibold text-gray-700">No, quiero volver atrás</Text>
        <Ionicons name="arrow-back" size={18} color="#111827" />
      </TouchableOpacity>
    </View>
  );

  if (step === 'feedback' && feedbackResult) {
    const isSuccess = feedbackResult === 'success';
    const message = isSuccess
      ? {
          pre: 'Su pago se ha realizado ',
          emphasis: 'correctamente',
          post: '',
        }
      : {
          pre: 'Su pago tuvo un ',
          emphasis: 'error',
          post: ', por falta de saldo en su cuenta',
        };
    return (
      <View className="flex-1 bg-white" onAccessibilityEscape={resetFlow}>
        <SimplifiedFeedbackView
          status={feedbackResult}
          heading={isSuccess ? 'Éxito' : 'Error'}
          message={message}
          detail={
            selectedService
              ? `${selectedService.provider} de ${selectedService.beneficiary}`
              : undefined
          }
          showStatusTabs
          onBack={() => {
            setStep('confirm');
            setFeedbackResult(null);
          }}
          onReturnHome={resetFlow}
        />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white" onAccessibilityEscape={goBack}>
      <View className="flex-row items-center gap-3 px-6 pb-2 pt-14">
        <TouchableOpacity
          onPress={goBack}
          accessibilityRole="button"
          accessibilityLabel="Regresar"
          accessibilityHint="Vuelve al paso anterior"
          className="flex-row items-center gap-1">
          <Ionicons name="chevron-back" size={22} color="#111827" />
          <Text className="text-lg text-gray-900">Servicios</Text>
        </TouchableOpacity>
      </View>
      <ScrollView className="px-6" contentContainerStyle={{ paddingBottom: 48, paddingTop: 12 }}>
        {step === 'list' ? renderList() : renderConfirm()}
      </ScrollView>
    </View>
  );
}
