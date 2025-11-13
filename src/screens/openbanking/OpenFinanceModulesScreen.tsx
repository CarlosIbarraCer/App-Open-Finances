import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

export type OpenFinanceModuleKey = 'subscriptions' | 'microSaving' | 'splitSmart' | 'guardianAi';

type OpenFinanceModulesScreenProps = {
  onBack: () => void;
  module?: OpenFinanceModuleKey;
};

type Subscription = {
  id: string;
  name: string;
  category: 'Streaming' | 'Software' | 'Gimnasio';
  amount: number;
  cycle: string;
  nextCharge: string;
  annualCost: string;
  suggestion?: string;
};

type SavingsGoal = {
  id: string;
  name: string;
  saved: number;
  target: number;
  icon: keyof typeof Ionicons.glyphMap;
  streak: number;
};

type SplitGroup = {
  id: string;
  name: string;
  members: string[];
  balance: string;
  youOwe: string;
  othersOwe: string;
  lastActivity: string;
};

const subscriptionInsights: Subscription[] = [
  {
    id: 'netflix',
    name: 'Netflix 4K',
    category: 'Streaming',
    amount: 199,
    cycle: 'mensual',
    nextCharge: '12 de abril',
    annualCost: '$2,388.00',
    suggestion: 'Considera migrar al plan con anuncios para ahorrar $70/mes',
  },
  {
    id: 'gym',
    name: 'Club Activo Sur',
    category: 'Gimnasio',
    amount: 899,
    cycle: 'mensual',
    nextCharge: '05 de abril',
    annualCost: '$10,788.00',
  },
  {
    id: 'software',
    name: 'Suite Creativa Pro',
    category: 'Software',
    amount: 429,
    cycle: 'mensual',
    nextCharge: '28 de marzo',
    annualCost: '$5,148.00',
    suggestion: 'Sin uso en 90 días · Sugerencia de cancelación inmediata',
  },
];

const alerts = [
  { id: 'alert-1', label: '3 cargos esta semana', description: 'Netflix, Spotify y Club Activo Sur' },
  { id: 'alert-2', label: 'Monto anual en suscripciones', description: '$18,324 · 14% de tus gastos' },
];

const savingsGoals: SavingsGoal[] = [
  { id: 'trip', name: 'Viaje familiar', saved: 7800, target: 15000, icon: 'airplane', streak: 18 },
  { id: 'emergency', name: 'Fondo de emergencias', saved: 12250, target: 20000, icon: 'shield-checkmark', streak: 24 },
  { id: 'gadget', name: 'Tablet para papá', saved: 3200, target: 6000, icon: 'tablet-portrait', streak: 5 },
];

const splitGroups: SplitGroup[] = [
  {
    id: 'roommates',
    name: 'Roommates · Depa Narvarte',
    members: ['Tú', 'Ana', 'Leo'],
    balance: '$12,430 en curso',
    youOwe: '$1,220',
    othersOwe: '$1,980',
    lastActivity: 'Renta marzo · pendiente',
  },
  {
    id: 'trip',
    name: 'Viaje a Oaxaca',
    members: ['Tú', 'Pau', 'Rich', 'Majo'],
    balance: '$8,940 en curso',
    youOwe: '$0',
    othersOwe: '$2,310',
    lastActivity: 'Cata de mezcal · escaneado con OCR',
  },
];

const fraudSignals = [
  { id: 'amount', label: 'Monto inusualmente alto', status: 'Activo', detail: '>$25,000 sin historial previo' },
  { id: 'burst', label: 'Múltiples transferencias en 15 min', status: 'Activo', detail: '5 operaciones consecutivas' },
  { id: 'geo', label: 'Geolocalización distinta', status: 'Monitor', detail: 'Transacción desde Bogotá, Colombia' },
  { id: 'senior', label: 'Beneficiario nuevo + adulto mayor', status: 'Requiere voz biométrica', detail: 'Verificación de contacto de confianza' },
];

const formatCurrency = (value: number) =>
  value.toLocaleString('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 2 });

const getProgressWidth = (saved: number, target: number) => `${Math.min(100, Math.round((saved / target) * 100))}%`;

const moduleMetadata: Record<OpenFinanceModuleKey, { title: string; tagline: string; accent: string }> = {
  subscriptions: {
    title: 'Detector de Suscripciones',
    tagline: 'Analizamos patrones recurrentes y te avisamos antes de que te cobren.',
    accent: 'Suscripciones inteligentes',
  },
  microSaving: {
    title: 'MicroAhorro Inteligente',
    tagline: 'Redondeos automáticos y metas gamificadas para ahorrar sin pensarlo.',
    accent: 'Ahorro asistido',
  },
  splitSmart: {
    title: 'SplitSmart — Gastos Compartidos',
    tagline: 'Organiza grupos, digitaliza tickets y liquida al instante.',
    accent: 'División inteligente',
  },
  guardianAi: {
    title: 'Guardian AI — Fraude y Protección',
    tagline: 'Motor antifraude con detección temprana para adultos mayores.',
    accent: 'Seguridad adaptativa',
  },
};

export default function OpenFinanceModulesScreen({ onBack, module }: OpenFinanceModulesScreenProps) {
  const selectedModule = module ?? 'subscriptions';
  const showingAllModules = !module;
  const overviewMetadata = {
    accent: 'Ecosistema de soluciones',
    title: 'Open Finance Plus',
    tagline: 'Explora módulos inteligentes para descubrir, ahorrar y proteger tu dinero.',
  };
  const renderSectionHeader = (title: string, description: string, accent: string) => (
    <View className="mb-4">
      <Text className="text-xs uppercase tracking-[0.2em] text-gray-400">{accent}</Text>
      <Text className="mt-1 text-2xl font-semibold text-gray-900">{title}</Text>
      <Text className="mt-1 text-base text-gray-600">{description}</Text>
    </View>
  );

  const renderBadge = (label: string, variant: 'info' | 'success' | 'warning') => {
    const palette = {
      info: 'bg-indigo-100 text-indigo-700',
      success: 'bg-emerald-100 text-emerald-700',
      warning: 'bg-amber-100 text-amber-700',
    }[variant];
    return (
      <View className={`rounded-full px-3 py-1 ${palette}`} style={{ maxWidth: 160 }}>
        <Text className="text-center text-xs font-semibold">{label}</Text>
      </View>
    );
  };

  const renderFinDetective = () => (
    <View className="mb-10 rounded-3xl bg-white px-5 py-6 shadow-sm">
      {renderSectionHeader(
        moduleMetadata.subscriptions.title,
        'Identificamos y clasificamos pagos recurrentes para evitar fugas de dinero invisibles.',
        moduleMetadata.subscriptions.accent
      )}
      <View className="mb-4 flex-row flex-wrap gap-2">
        {renderBadge('ML temporal', 'info')}
        {renderBadge('Alertas proactivas', 'warning')}
        {renderBadge('Costo anualizado', 'success')}
      </View>
      {subscriptionInsights.map((item) => (
        <View
          key={item.id}
          className="mb-4 rounded-2xl border border-indigo-50 bg-indigo-50/60 px-4 py-4">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-lg font-semibold text-gray-900">{item.name}</Text>
              <Text className="text-sm text-gray-500">{item.category} · {item.cycle}</Text>
            </View>
            <Text className="text-lg font-semibold text-indigo-700">{formatCurrency(item.amount)}</Text>
          </View>
          <View className="mt-3 flex-row justify-between">
            <Text className="text-xs uppercase tracking-wide text-gray-500">Próximo cargo</Text>
            <Text className="text-xs uppercase tracking-wide text-gray-500">Costo anual</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-base text-gray-900">{item.nextCharge}</Text>
            <Text className="text-base text-gray-900">{item.annualCost}</Text>
          </View>
          {item.suggestion ? (
            <View className="mt-3 flex-row items-start gap-2">
              <Ionicons name="sparkles" size={18} color="#4338ca" />
              <Text className="flex-1 text-sm text-gray-600">{item.suggestion}</Text>
            </View>
          ) : null}
        </View>
      ))}
      <View className="rounded-2xl border border-dashed border-indigo-200 px-4 py-4">
        <Text className="text-sm font-semibold text-indigo-900">Alertas inmediatas</Text>
        {alerts.map((alert) => (
          <View key={alert.id} className="mt-2 flex-row items-start gap-3">
            <Ionicons name="warning" size={18} color="#b45309" />
            <View className="flex-1">
              <Text className="text-sm font-semibold text-gray-900">{alert.label}</Text>
              <Text className="text-sm text-gray-600">{alert.description}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  const renderMicroSaving = () => (
    <View className="mb-10 rounded-3xl bg-white px-5 py-6 shadow-sm">
      {renderSectionHeader(
        moduleMetadata.microSaving.title,
        'Redondeo automático y metas gamificadas para mantener el hábito de ahorro diario.',
        moduleMetadata.microSaving.accent
      )}
      <View className="mb-5 rounded-2xl bg-emerald-50 px-4 py-4">
        <Text className="text-sm font-semibold text-emerald-900">Nivel de redondeo</Text>
        <View className="mt-3 flex-row items-center justify-between">
          {['1×', '2×', '5×'].map((level, index) => {
            const isSelected = index === 1;
            return (
              <View
                key={level}
                className={`flex-1 rounded-2xl border px-3 py-3 text-center ${
                  isSelected ? 'border-emerald-500 bg-white' : 'border-transparent'
                }`}>
                <Text className={`text-center text-base font-semibold ${isSelected ? 'text-emerald-900' : 'text-emerald-600'}`}>
                  {level}
                </Text>
                <Text className="mt-1 text-center text-xs text-emerald-700">
                  {isSelected ? 'Sugerido' : 'Disponible'}
                </Text>
              </View>
            );
          })}
        </View>
        <Text className="mt-3 text-sm text-emerald-700">
          Compra de $50.45 → se redondea a $52.00 · $1.55 enviados a metas activas.
        </Text>
      </View>
      {savingsGoals.map((goal) => {
        const progress = getProgressWidth(goal.saved, goal.target);
        return (
          <View key={goal.id} className="mb-4 rounded-2xl border border-emerald-100 px-4 py-4">
            <View className="flex-row items-center gap-3">
              <View className="rounded-2xl bg-emerald-100 p-3">
                <Ionicons name={goal.icon} size={20} color="#047857" />
              </View>
              <View className="flex-1">
                <Text className="text-base font-semibold text-gray-900">{goal.name}</Text>
                <Text className="text-sm text-gray-500">
                  {formatCurrency(goal.saved)} / {formatCurrency(goal.target)}
                </Text>
              </View>
              {renderBadge(`${goal.streak} días de racha`, 'success')}
            </View>
            <View className="mt-3 h-3 rounded-full bg-emerald-100">
              <View className="h-full rounded-full bg-emerald-500" style={{ width: progress }} />
            </View>
          </View>
        );
      })}
      <View className="rounded-2xl bg-gray-50 px-4 py-4">
        <Text className="text-sm font-semibold text-gray-900">Insignias recientes</Text>
        <View className="mt-3 flex-row flex-wrap gap-2">
          {['Ahorrista nivel plata', 'Meta cumplida: Emergencias', 'Top 10% comunidad'].map((badge) => (
            <View key={badge} className="rounded-full bg-white px-3 py-1 shadow">
              <Text className="text-xs font-semibold text-gray-700">{badge}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );

  const renderSplitSmart = () => (
    <View className="mb-10 rounded-3xl bg-white px-5 py-6 shadow-sm">
      {renderSectionHeader(
        moduleMetadata.splitSmart.title,
        'Organiza grupos, digitaliza tickets y liquida al instante con SPEI®.',
        moduleMetadata.splitSmart.accent
      )}
      {splitGroups.map((group) => (
        <View key={group.id} className="mb-4 rounded-2xl border border-purple-100 px-4 py-4">
          <Text className="text-lg font-semibold text-gray-900">{group.name}</Text>
          <Text className="text-sm text-gray-500">{group.members.join(', ')}</Text>
          <View className="mt-3 rounded-2xl bg-purple-50 px-4 py-3">
            <View className="flex-row flex-wrap items-center justify-between gap-2">
              <Text className="text-sm font-semibold text-purple-900">Balance activo</Text>
              <Text className="text-base font-semibold text-purple-900">{group.balance}</Text>
            </View>
            <View className="mt-3 flex-row justify-between">
              <View>
                <Text className="text-xs uppercase tracking-wide text-purple-800">Debes</Text>
                <Text className="text-lg font-semibold text-purple-900">{group.youOwe}</Text>
              </View>
              <View className="items-end">
                <Text className="text-xs uppercase tracking-wide text-purple-800">Te deben</Text>
                <Text className="text-lg font-semibold text-purple-900">{group.othersOwe}</Text>
              </View>
            </View>
          </View>
          <View className="mt-3 flex-row items-center gap-2">
            <Ionicons name="receipt" size={18} color="#6b21a8" />
            <Text className="text-sm text-gray-500">{group.lastActivity}</Text>
          </View>
          <View className="mt-3 flex-row gap-3">
            <View className="flex-1 rounded-2xl border border-dashed border-purple-200 px-3 py-3">
              <Text className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                OCR rápido
              </Text>
              <Text className="mt-1 text-sm text-gray-700">Escanea ticket y asigna por persona</Text>
            </View>
            <View className="flex-1 rounded-2xl border border-purple-200 px-3 py-3">
              <Text className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Liquidación SPEI®
              </Text>
              <Text className="mt-1 text-sm text-gray-700">Difunde CLABE y liquida al instante</Text>
            </View>
          </View>
        </View>
      ))}
      <TouchableOpacity className="mt-2 rounded-3xl bg-purple-600 px-4 py-4">
        <Text className="text-center text-base font-semibold text-white">Crear nuevo grupo</Text>
      </TouchableOpacity>
    </View>
  );

  const renderGuardianAI = () => (
    <View className="mb-10 rounded-3xl bg-white px-5 py-6 shadow-sm">
      {renderSectionHeader(
        moduleMetadata.guardianAi.title,
        'Motor de prevención enfocado en adultos mayores con reglas dinámicas y biometría de voz.',
        moduleMetadata.guardianAi.accent
      )}
      <View className="mb-4 rounded-2xl bg-rose-50 px-4 py-4">
        <Text className="text-sm font-semibold text-rose-900">Estado en tiempo real</Text>
        <View className="mt-3 flex-row flex-wrap gap-3">
          {['Operaciones monitoreadas', 'Contactos de confianza activos', 'Cuenta sin bloqueos'].map((item, index) => (
            <View key={item} className="flex-1 rounded-2xl bg-white px-3 py-3 shadow">
              <Text className="text-2xl font-semibold text-rose-900">{[12, 3, 'OK'][index]}</Text>
              <Text className="text-xs text-gray-500">{item}</Text>
            </View>
          ))}
        </View>
      </View>
      {fraudSignals.map((signal) => (
        <View key={signal.id} className="mb-3 rounded-2xl border border-rose-100 px-4 py-4">
          <View className="flex-row items-center justify-between">
            <Text className="text-base font-semibold text-gray-900">{signal.label}</Text>
            {renderBadge(signal.status, signal.status === 'Activo' ? 'warning' : 'info')}
          </View>
          <Text className="mt-1 text-sm text-gray-600">{signal.detail}</Text>
        </View>
      ))}
      <View className="rounded-2xl border border-dashed border-rose-200 px-4 py-4">
        <Text className="text-sm font-semibold text-gray-900">Protocolos para adultos mayores</Text>
        <View className="mt-3">
          {[
            'Confirmación por voz biométrica para operaciones riesgosas',
            'Notificación inmediata a 2 contactos de confianza',
            'Bloqueo temporal automático + asesor humano en 3 minutos',
            'Límites personalizados por horario y beneficiario',
          ].map((item, index) => (
            <View key={item} className={`flex-row items-start gap-2 ${index === 0 ? '' : 'mt-2'}`}>
              <Ionicons name="shield-checkmark" size={18} color="#be123c" />
              <Text className="flex-1 text-sm text-gray-700">{item}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-[#f9fafb]">
      <View className="flex-row items-center gap-2 px-6 pb-3 pt-14">
        <TouchableOpacity
          onPress={onBack}
          accessibilityRole="button"
          accessibilityLabel="Regresar"
          accessibilityHint="Vuelve al panel anterior"
          className="flex-row items-center gap-1">
          <Ionicons name="chevron-back" size={22} color="#111827" />
          <Text className="text-lg font-semibold text-gray-900">
            {showingAllModules ? overviewMetadata.title : 'Open Finance Plus'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="px-6" contentContainerStyle={{ paddingBottom: 64 }}>
        {showingAllModules && (
          <View className="mb-6">
            <Text className="text-xs uppercase tracking-[0.3em] text-gray-400">
              {overviewMetadata.accent}
            </Text>
            <Text className="mt-2 text-2xl font-semibold text-gray-900">
              {overviewMetadata.title}
            </Text>
            <Text className="mt-1 text-base text-gray-600">{overviewMetadata.tagline}</Text>
          </View>
        )}
        {(showingAllModules || selectedModule === 'subscriptions') && renderFinDetective()}
        {(showingAllModules || selectedModule === 'microSaving') && renderMicroSaving()}
        {(showingAllModules || selectedModule === 'splitSmart') && renderSplitSmart()}
        {(showingAllModules || selectedModule === 'guardianAi') && renderGuardianAI()}
      </ScrollView>
    </View>
  );
}
