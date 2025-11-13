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

type SimplifiedTransferScreenProps = {
  onBack: () => void;
  userName: string;
};

type TransferStep = 'beneficiary' | 'amount' | 'confirm' | 'feedback';

const beneficiaries = [
  { id: 'son', relation: 'Hijo', name: 'Francisco Torres' },
  { id: 'grandson', relation: 'Nieto', name: 'Paul Rosales' },
  { id: 'butcher', relation: 'Carnicero', name: 'Alonso Juárez' },
];

const amountOptions = [100, 500, 1000];

const formatCurrency = (value: number) =>
  `$ ${value.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function SimplifiedTransferScreen({
  onBack,
  userName,
}: SimplifiedTransferScreenProps) {
  const [step, setStep] = React.useState<TransferStep>('beneficiary');
  const [selectedBeneficiary, setSelectedBeneficiary] = React.useState<
    (typeof beneficiaries)[0] | null
  >(null);
  const [selectedAmount, setSelectedAmount] = React.useState<number | null>(null);
  const hitSlop = { top: 12, bottom: 12, left: 12, right: 12 };
  const instructionRef = React.useRef<React.ComponentRef<typeof Text>>(null);
  const [feedbackResult, setFeedbackResult] = React.useState<'success' | 'error' | null>(null);

  React.useEffect(() => {
    const announcements: Record<TransferStep, string> = {
      beneficiary: 'Selecciona un beneficiario',
      amount: 'Selecciona el monto a transferir',
      confirm: 'Confirma tu transferencia',
      feedback: 'Resultado de la transferencia',
    };
    const message = announcements[step];
    AccessibilityInfo.announceForAccessibility(message);
    if (step === 'feedback') {
      return undefined;
    }
    if (typeof AccessibilityInfo.setAccessibilityFocus === 'function') {
      const focusTimeout = setTimeout(() => {
        const node = instructionRef.current ? findNodeHandle(instructionRef.current) : null;
        if (node) {
          AccessibilityInfo.setAccessibilityFocus(node);
        }
      }, 250);
      return () => clearTimeout(focusTimeout);
    }
    return undefined;
  }, [step]);

  const goBack = () => {
    if (step === 'beneficiary') {
      onBack();
    } else if (step === 'amount') {
      setStep('beneficiary');
      setSelectedAmount(null);
    } else if (step === 'confirm') {
      setStep('amount');
    } else {
      setStep('confirm');
      setFeedbackResult(null);
    }
  };

  const resetFlow = () => {
    setStep('beneficiary');
    setSelectedAmount(null);
    setSelectedBeneficiary(null);
    setFeedbackResult(null);
  };

  const handleBeneficiaryPress = (beneficiary: (typeof beneficiaries)[number]) => {
    setSelectedBeneficiary(beneficiary);
    setStep('amount');
  };

  const handleAmountPress = (amount: number) => {
    setSelectedAmount(amount);
    setStep('confirm');
  };

  const handleConfirmTransfer = () => {
    const outcome = selectedAmount && selectedAmount > 500 ? 'error' : 'success';
    setFeedbackResult(outcome);
    setStep('feedback');
  };

  const getFeedbackMessage = (result: 'success' | 'error') => {
    if (result === 'success') {
      return {
        heading: 'Éxito',
        message: { pre: 'Su transferencia se ha realizado ', emphasis: 'correctamente', post: '' },
        detail:
          selectedBeneficiary && selectedAmount
            ? `Enviada a ${selectedBeneficiary.name} por ${formatCurrency(selectedAmount)}`
            : undefined,
      } as const;
    }
    return {
      heading: 'Error',
      message: {
        pre: 'Su transferencia tuvo un ',
        emphasis: 'error',
        post: ', por falta de saldo en su cuenta',
      },
      detail: 'Inténtalo con un monto menor o verifica tu saldo disponible.',
    } as const;
  };

  const renderCard = (
    title: string,
    subtitle: string,
    detail: string | null,
    onPress: () => void
  ) => (
    <TouchableOpacity
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${title} ${subtitle}`}
      accessibilityHint={detail ?? 'Selecciona esta opción para continuar'}
      className="mb-4 min-h-[128px] rounded-3xl bg-[#e8e5ff] px-6 py-8 shadow-sm"
      style={{
        shadowColor: '#c7d2fe',
        shadowOpacity: 0.5,
        shadowOffset: { width: 0, height: 6 },
        shadowRadius: 10,
        elevation: 3,
      }}>
      <Text className="text-base font-semibold text-gray-800">{title}</Text>
      <Text className="mt-2 text-2xl text-gray-900">{subtitle}</Text>
      {detail ? <Text className="text-sm text-gray-500">{detail}</Text> : null}
    </TouchableOpacity>
  );

  const renderInstruction = (text: string) => (
    <Text
      ref={instructionRef}
      accessibilityRole="header"
      accessibilityLabel={`Paso actual: ${text}`}
      className="mb-1 text-xs uppercase tracking-wide text-gray-500">
      {text}
    </Text>
  );

  const renderContent = () => {
    if (step === 'beneficiary') {
      return (
        <>
          {renderInstruction('Da click a quien deseas transferir')}
          {beneficiaries.map((beneficiary) =>
            renderCard(beneficiary.relation, beneficiary.name, null, () =>
              handleBeneficiaryPress(beneficiary)
            )
          )}
        </>
      );
    }

    if (step === 'amount') {
      return (
        <>
          {renderInstruction('Selecciona el monto a transferir')}
          {amountOptions.map((amount) =>
            renderCard('Monto:', formatCurrency(amount), 'Pesos mexicanos', () =>
              handleAmountPress(amount)
            )
          )}
        </>
      );
    }

    const beneficiaryDescription = selectedBeneficiary
      ? `${selectedBeneficiary.name}${selectedBeneficiary.relation ? `, ${selectedBeneficiary.relation}` : ''}`
      : 'sin seleccionar';
    const amountDescription = selectedAmount ? formatCurrency(selectedAmount) : '$ 0.00';

    return (
      <View className="rounded-3xl bg-white px-5 py-6 shadow">
        <Text
          ref={instructionRef}
          accessibilityRole="header"
          accessibilityLabel="Paso actual: Confirma tu transferencia"
          className="text-lg font-semibold text-gray-900">
          Confirma tu transferencia
        </Text>
        <View
          accessible
          accessibilityRole="summary"
          accessibilityLabel={`Beneficiario seleccionado: ${beneficiaryDescription}`}
          className="mt-4 rounded-2xl bg-gray-100 px-4 py-3">
          <Text className="text-xs uppercase tracking-wide text-gray-500">Beneficiario</Text>
          <Text className="text-xl font-semibold text-gray-900">
            {selectedBeneficiary?.name ?? ''}
          </Text>
          <Text className="text-sm text-gray-500">{selectedBeneficiary?.relation}</Text>
        </View>
        <View
          accessible
          accessibilityRole="summary"
          accessibilityLabel={`Monto seleccionado: ${amountDescription} pesos mexicanos`}
          className="mt-4 rounded-2xl bg-gray-100 px-4 py-3">
          <Text className="text-xs uppercase tracking-wide text-gray-500">Monto</Text>
          <Text className="text-2xl font-semibold text-gray-900">
            {amountDescription}
          </Text>
          <Text className="text-sm text-gray-500">Pesos mexicanos</Text>
        </View>
        <TouchableOpacity
          onPress={handleConfirmTransfer}
          accessibilityRole="button"
          accessibilityLabel="Confirmar transferencia"
          accessibilityHint="Completa el envío con los datos seleccionados"
          className="mt-6 rounded-3xl bg-[#2563EB] px-4 py-4 shadow-lg shadow-indigo-200">
          <Text className="text-center text-base font-semibold text-white">
            Confirmar transferencia
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (step === 'feedback' && feedbackResult) {
    const feedbackCopy = getFeedbackMessage(feedbackResult);
    return (
      <View className="flex-1 bg-white" onAccessibilityEscape={() => {
        resetFlow();
        onBack();
      }}>
        <SimplifiedFeedbackView
          status={feedbackResult}
          heading={feedbackCopy.heading}
          message={feedbackCopy.message}
          detail={feedbackCopy.detail}
          onBack={() => {
            setStep('confirm');
            setFeedbackResult(null);
          }}
          onReturnHome={() => {
            resetFlow();
            onBack();
          }}
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
          hitSlop={hitSlop}
          className="flex-row items-center gap-1">
          <Ionicons name="chevron-back" size={22} color="#111827" />
          <Text className="text-lg text-gray-900">Transferir</Text>
        </TouchableOpacity>
      </View>
      <ScrollView className="px-6" contentContainerStyle={{ paddingBottom: 48, paddingTop: 12 }}>
        {renderContent()}
      </ScrollView>
    </View>
  );
}
