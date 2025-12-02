import React from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
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
  split?: { label: string; value: number }[];
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
    split: [
      { label: 'Tú', value: 40 },
      { label: 'Ana', value: 30 },
      { label: 'Leo', value: 30 },
    ],
  },
  {
    id: 'trip',
    name: 'Viaje a Oaxaca',
    members: ['Tú', 'Pau', 'Rich', 'Majo'],
    balance: '$8,940 en curso',
    youOwe: '$0',
    othersOwe: '$2,310',
    lastActivity: 'Cata de mezcal · escaneado con OCR',
    split: [
      { label: 'Tú', value: 25 },
      { label: 'Pau', value: 25 },
      { label: 'Rich', value: 30 },
      { label: 'Majo', value: 20 },
    ],
  },
  {
    id: 'dinner',
    name: 'Cena familiar · Cumple de mamá',
    members: ['Tú', 'Papá', 'Hna Luisa'],
    balance: '$3,120 en curso',
    youOwe: '$1,040',
    othersOwe: '$0',
    lastActivity: 'Restaurante · ticket listo para dividir',
    split: [
      { label: 'Tú', value: 35 },
      { label: 'Papá', value: 40 },
      { label: 'Hna Luisa', value: 25 },
    ],
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
  const [searchTerm, setSearchTerm] = React.useState('');
  const [categoryFilter, setCategoryFilter] = React.useState<'Todos' | Subscription['category']>('Todos');
  const [priceFilter, setPriceFilter] = React.useState<'all' | 'lt300' | '300-600' | 'gt600'>('all');
  const [spendLimit, setSpendLimit] = React.useState('1200');
  const [showCategoryPicker, setShowCategoryPicker] = React.useState(false);
  const [showSubscriptionStats, setShowSubscriptionStats] = React.useState(false);
  const [roundUpLevel, setRoundUpLevel] = React.useState<'1×' | '2×' | '5×'>('2×');
  const [expandedSplitGroups, setExpandedSplitGroups] = React.useState<Record<string, boolean>>({});
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

  const filteredSubscriptions = React.useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return subscriptionInsights.filter((item) => {
      const matchesTerm =
        !term || item.name.toLowerCase().includes(term) || item.category.toLowerCase().includes(term);
      const matchesCategory = categoryFilter === 'Todos' || item.category === categoryFilter;
      const matchesPrice =
        priceFilter === 'all' ||
        (priceFilter === 'lt300' && item.amount < 300) ||
        (priceFilter === '300-600' && item.amount >= 300 && item.amount <= 600) ||
        (priceFilter === 'gt600' && item.amount > 600);
      return matchesTerm && matchesCategory && matchesPrice;
    });
  }, [categoryFilter, priceFilter, searchTerm]);

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

  const renderSubscriptionStatsPage = () => (
    <View className="flex-1 bg-[#f9fafb]">
      <View className="flex-row items-center justify-between px-6 pb-3 pt-14">
        <TouchableOpacity
          onPress={() => setShowSubscriptionStats(false)}
          accessibilityRole="button"
          accessibilityLabel="Cerrar estadísticas"
          accessibilityHint="Regresa al panel de suscripciones"
          className="flex-row items-center gap-1">
          <Ionicons name="chevron-back" size={22} color="#111827" />
          <Text className="text-lg font-semibold text-gray-900">Estadísticas</Text>
        </TouchableOpacity>
        <View className="rounded-full bg-indigo-100 px-3 py-1.5">
          <Text className="text-xs font-semibold text-indigo-700">Detector de suscripciones</Text>
        </View>
      </View>
      <ScrollView className="px-6" contentContainerStyle={{ paddingBottom: 48 }}>
        <View className="mb-4 rounded-3xl bg-white px-5 py-5 shadow-sm shadow-indigo-50">
          <Text className="text-sm font-semibold text-gray-900">Distribución por categoría</Text>
          <Text className="text-xs text-gray-500">Últimos 30 días</Text>
          <View className="mt-3 flex-row items-end justify-between">
            {[
              { label: 'Streaming', value: 48, color: '#6366f1' },
              { label: 'Software', value: 32, color: '#22c55e' },
              { label: 'Gimnasio', value: 20, color: '#f59e0b' },
              { label: 'Otros', value: 12, color: '#0ea5e9' },
            ].map((bar) => (
              <View key={bar.label} className="items-center">
                <View
                  className="w-10 rounded-t-xl"
                  style={{
                    height: 12 + bar.value,
                    backgroundColor: bar.color,
                  }}
                />
                <Text className="mt-1 text-[11px] text-gray-700">{bar.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className="mb-4 rounded-3xl bg-white px-5 py-5 shadow-sm shadow-indigo-50">
          <Text className="text-sm font-semibold text-gray-900">Tendencia mensual</Text>
          <Text className="text-xs text-gray-500">Proyección basada en cargos recurrentes</Text>
          <View className="mt-3 flex-row items-end justify-between">
            {[480, 520, 610, 580, 640, 700].map((value, idx) => (
              <View key={idx} className="items-center">
                <View
                  className="w-8 rounded-t-xl bg-indigo-600"
                  style={{ height: Math.max(16, value / 4) }}
                />
                <Text className="mt-1 text-[10px] text-gray-500">{`M${idx + 1}`}</Text>
              </View>
            ))}
          </View>
          <Text className="mt-3 text-sm text-gray-700">
            Promedio mensual: $588 · Máximo reciente: $700 · Proyección anual: $7,056
          </Text>
        </View>

        <View className="mb-4 rounded-3xl bg-white px-5 py-5 shadow-sm shadow-indigo-50">
          <Text className="text-sm font-semibold text-gray-900">Top suscripciones por monto</Text>
          <View className="mt-3 space-y-3">
            {[
              { name: 'Club Activo Sur', value: 899, color: '#f97316' },
              { name: 'Suite Creativa Pro', value: 429, color: '#22c55e' },
              { name: 'Netflix 4K', value: 199, color: '#6366f1' },
            ].map((item) => (
              <View key={item.name}>
                <View className="flex-row justify-between">
                  <Text className="text-sm font-semibold text-gray-900">{item.name}</Text>
                  <Text className="text-sm text-gray-600">{formatCurrency(item.value)}</Text>
                </View>
                <View className="mt-1 h-2.5 rounded-full bg-gray-100">
                  <View
                    className="h-full rounded-full"
                    style={{ width: `${Math.min(100, (item.value / 900) * 100)}%`, backgroundColor: item.color }}
                  />
                </View>
              </View>
            ))}
          </View>
        </View>

        <View className="mb-4 rounded-3xl bg-white px-5 py-5 shadow-sm shadow-indigo-50">
          <Text className="text-sm font-semibold text-gray-900">Impacto anual estimado</Text>
          <Text className="text-xs text-gray-500">Comparativa por categoría</Text>
          <View className="mt-3 gap-2">
            {[
              { label: 'Streaming', value: 2388, color: '#6366f1' },
              { label: 'Software', value: 5148, color: '#22c55e' },
              { label: 'Gimnasio', value: 10788, color: '#f59e0b' },
            ].map((row) => (
              <View key={row.label} className="flex-row items-center justify-between">
                <Text className="text-sm text-gray-800">{row.label}</Text>
                <View className="flex-1 px-2">
                  <View className="h-2 rounded-full bg-gray-100">
                    <View
                      className="h-full rounded-full"
                      style={{
                        width: `${Math.min(100, (row.value / 12000) * 100)}%`,
                        backgroundColor: row.color,
                      }}
                    />
                  </View>
                </View>
                <Text className="text-sm font-semibold text-gray-900">
                  {formatCurrency(row.value)}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );


  const renderFinDetective = () => (
    <View className="mb-10 rounded-3xl bg-white px-5 py-6 shadow-sm">
      {renderSectionHeader(
        moduleMetadata.subscriptions.title,
        'Identificamos y clasificamos pagos recurrentes para evitar fugas de dinero invisibles.',
        moduleMetadata.subscriptions.accent
      )}
      <View className="mb-6 rounded-2xl border border-indigo-50 bg-indigo-50/60 px-4 py-4">
        <Text className="text-sm font-semibold text-indigo-900">Panel de control</Text>
        <Text className="text-xs text-indigo-800">
          Busca, filtra o ajusta límites para detectar suscripciones
        </Text>
        <View className="mt-3 gap-3">
          <TextInput
            value={searchTerm}
            onChangeText={setSearchTerm}
            placeholder="Buscar suscripción (ej. Netflix, gimnasio)"
            placeholderTextColor="#6366f1"
            accessibilityLabel="Buscar suscripción"
            className="rounded-xl border border-indigo-100 bg-white px-3 py-2.5 text-sm text-gray-900"
          />
          <View>
            <Text className="text-xs font-semibold uppercase tracking-wide text-gray-600 mb-1">
              Categoría
            </Text>
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="Elegir categoría de suscripción"
              accessibilityState={{ expanded: showCategoryPicker }}
              onPress={() => setShowCategoryPicker((prev) => !prev)}
              className="flex-row items-center justify-between rounded-xl border border-indigo-100 bg-white px-3 py-2.5">
              <Text className="text-sm font-semibold text-gray-900">{categoryFilter}</Text>
              <Ionicons name={showCategoryPicker ? 'chevron-up' : 'chevron-down'} size={18} color="#4338ca" />
            </TouchableOpacity>
            {showCategoryPicker ? (
              <View className="mt-2 rounded-xl border border-indigo-100 bg-indigo-50">
                {(['Todos', 'Streaming', 'Software', 'Gimnasio'] as const).map((cat) => {
                  const isActive = categoryFilter === cat;
                  return (
                    <TouchableOpacity
                      key={cat}
                      onPress={() => {
                        setCategoryFilter(cat);
                        setShowCategoryPicker(false);
                      }}
                      accessibilityRole="button"
                      accessibilityLabel={`Seleccionar ${cat}`}
                      className={`flex-row items-center justify-between px-3 py-2 ${
                        isActive ? 'bg-white' : ''
                      }`}>
                      <Text className={`text-sm ${isActive ? 'font-semibold text-indigo-800' : 'text-gray-800'}`}>
                        {cat}
                      </Text>
                      {isActive ? <Ionicons name="checkmark" size={16} color="#4338ca" /> : null}
                    </TouchableOpacity>
                  );
                })}
              </View>
            ) : null}
          </View>
          <View>
            <Text className="text-xs font-semibold uppercase tracking-wide text-gray-600">
              Rango de precio
            </Text>
            <View className="mt-2 flex-row flex-wrap gap-2">
              {[
                { id: 'all', label: 'Todos' },
                { id: 'lt300', label: '< $300' },
                { id: '300-600', label: '$300 - $600' },
                { id: 'gt600', label: '> $600' },
              ].map((filter) => {
                const isActive = priceFilter === filter.id;
                return (
                  <TouchableOpacity
                    key={filter.id}
                    onPress={() => setPriceFilter(filter.id as typeof priceFilter)}
                    className={`rounded-full px-3 py-1.5 ${
                      isActive ? 'bg-amber-400' : 'bg-white'
                    }`}>
                    <Text
                      className={`text-xs font-semibold ${isActive ? 'text-amber-900' : 'text-amber-700'}`}>
                      {filter.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
          <View className="flex-row items-center justify-between rounded-xl border border-indigo-100 bg-white px-3 py-2.5">
            <View>
              <Text className="text-xs uppercase tracking-wide text-gray-500">Límite mensual</Text>
              <Text className="text-sm font-semibold text-gray-900">
                Detectar cargos &gt; ${spendLimit || '0'}
              </Text>
            </View>
            <TextInput
              value={spendLimit}
              onChangeText={setSpendLimit}
              keyboardType="numeric"
              placeholder="1200"
              accessibilityLabel="Límite para detectar suscripciones"
              className="w-24 rounded-lg border border-indigo-100 bg-indigo-50 px-2 py-1.5 text-right text-sm text-gray-900"
            />
          </View>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Ver estadísticas de suscripciones"
            accessibilityHint="Abre un panel separado con gráficas y comparativas"
            onPress={() => setShowSubscriptionStats(true)}
            className="flex-row items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3">
            <Ionicons name="stats-chart" size={18} color="#fff" />
            <Text className="text-sm font-semibold text-white">Ver estadísticas y tendencias</Text>
          </TouchableOpacity>
        </View>
      </View>

      {filteredSubscriptions.map((item) => (
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
          <View className="mt-3 flex-row flex-wrap gap-2">
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel={`Cancelar ${item.name}`}
              className="flex-row items-center gap-1 rounded-full bg-rose-50 px-3 py-2">
              <Ionicons name="close-circle" size={16} color="#be123c" />
              <Text className="text-xs font-semibold text-rose-700">Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel={`Ver detalles de ${item.name}`}
              className="flex-row items-center gap-1 rounded-full bg-white px-3 py-2">
              <Ionicons name="information-circle" size={16} color="#4338ca" />
              <Text className="text-xs font-semibold text-indigo-700">Ver información</Text>
            </TouchableOpacity>
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel={`Cambiar plan para ${item.name}`}
              className="flex-row items-center gap-1 rounded-full bg-emerald-50 px-3 py-2">
              <Ionicons name="swap-horizontal" size={16} color="#047857" />
              <Text className="text-xs font-semibold text-emerald-700">Cambiar plan</Text>
            </TouchableOpacity>
          </View>
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
      <View className="mb-5 rounded-2xl bg-indigo-50 px-4 py-4">
        <Text className="text-sm font-semibold text-indigo-900">Nivel de redondeo</Text>
        <View className="mt-3 flex-row items-center justify-between gap-2">
          {['1×', '2×', '5×'].map((level) => {
            const isSelected = roundUpLevel === level;
            return (
              <TouchableOpacity
                key={level}
                onPress={() => setRoundUpLevel(level as typeof roundUpLevel)}
                accessibilityRole="button"
                accessibilityLabel={`Seleccionar redondeo ${level}`}
                className={`flex-1 rounded-2xl border px-3 py-3 text-center ${
                  isSelected ? 'border-indigo-500 bg-white' : 'border-transparent bg-indigo-100'
                }`}>
                <Text className={`text-center text-base font-semibold ${isSelected ? 'text-indigo-900' : 'text-indigo-700'}`}>
                  {level}
                </Text>
                <Text className="mt-1 text-center text-xs text-indigo-700">
                  {isSelected ? 'Seleccionado' : 'Disponible'}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        <Text className="mt-3 text-sm text-indigo-800">
          Compra de $50.45 → se redondea a {roundUpLevel === '1×' ? '$51.00' : roundUpLevel === '2×' ? '$52.00' : '$55.00'} ·
          ahorro enviado a metas activas.
        </Text>
      </View>
      {savingsGoals.map((goal) => {
        const progress = getProgressWidth(goal.saved, goal.target);
        const palette =
          goal.id === 'trip'
            ? { bg: '#eff6ff', bar: '#2563eb', iconBg: '#dbeafe', text: '#1d4ed8' }
            : goal.id === 'emergency'
              ? { bg: '#ecfdf3', bar: '#16a34a', iconBg: '#dcfce7', text: '#15803d' }
              : { bg: '#fff7ed', bar: '#f97316', iconBg: '#ffedd5', text: '#c2410c' };
        return (
          <View
            key={goal.id}
            className="mb-4 rounded-2xl border px-4 py-4"
            style={{ borderColor: palette.bar, backgroundColor: palette.bg }}>
            <View className="flex-row items-center gap-3">
              <View className="rounded-2xl p-3" style={{ backgroundColor: palette.iconBg }}>
                <Ionicons name={goal.icon} size={20} color={palette.bar} />
              </View>
              <View className="flex-1">
                <Text className="text-base font-semibold text-gray-900">{goal.name}</Text>
                <Text className="text-sm text-gray-500">
                  {formatCurrency(goal.saved)} / {formatCurrency(goal.target)}
                </Text>
              </View>
              <View className="rounded-full px-3 py-1" style={{ backgroundColor: palette.iconBg }}>
                <Text className="text-xs font-semibold" style={{ color: palette.text }}>
                  {goal.streak} días de racha
                </Text>
              </View>
            </View>
            <View className="mt-3 h-3 rounded-full bg-white/60">
              <View className="h-full rounded-full" style={{ width: progress, backgroundColor: palette.bar }} />
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
      {splitGroups.map((group) => {
        const palette =
          group.id === 'roommates'
            ? { border: '#f59e0b', bg: '#fff7ed', accent: '#c2410c', chip: '#fde68a' }
            : group.id === 'trip'
              ? { border: '#0ea5e9', bg: '#e0f2fe', accent: '#075985', chip: '#bae6fd' }
              : { border: '#8b5cf6', bg: '#f3e8ff', accent: '#6d28d9', chip: '#e9d5ff' };
        const isExpanded = Boolean(expandedSplitGroups[group.id]);
        return (
          <View
            key={group.id}
            className="mb-4 rounded-2xl border px-4 py-4"
            style={{ borderColor: palette.border, backgroundColor: palette.bg }}>
            <View className="flex-row items-start justify-between">
              <View className="flex-1 pr-3">
                <Text className="text-lg font-semibold text-gray-900">{group.name}</Text>
                <Text className="text-sm text-gray-500">{group.members.join(', ')}</Text>
              </View>
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityLabel={isExpanded ? 'Colapsar grupo' : 'Ver detalle del grupo'}
                onPress={() =>
                  setExpandedSplitGroups((prev) => ({ ...prev, [group.id]: !isExpanded }))
                }
                className="rounded-full bg-white px-3 py-1.5"
                style={{ borderColor: palette.border, borderWidth: 1 }}>
                <Text className="text-xs font-semibold" style={{ color: palette.accent }}>
                  {isExpanded ? 'Colapsar' : 'Ver detalle'}
                </Text>
              </TouchableOpacity>
            </View>

            <View className="mt-3 rounded-2xl px-4 py-3" style={{ backgroundColor: palette.chip }}>
              <View className="flex-row flex-wrap items-center justify-between gap-2">
                <Text className="text-sm font-semibold" style={{ color: palette.accent }}>
                  Balance total
                </Text>
                <Text className="text-base font-semibold" style={{ color: palette.accent }}>
                  {group.balance}
                </Text>
              </View>
              <View className="mt-3 flex-row justify-between">
                <View>
                  <Text className="text-xs uppercase tracking-wide text-gray-600">Tu parte</Text>
                  <Text className="text-lg font-semibold text-gray-900">{group.youOwe}</Text>
                </View>
                <View className="items-end">
                  <Text className="text-xs uppercase tracking-wide text-gray-600">Cuenta maestra</Text>
                  <Text className="text-lg font-semibold text-gray-900">Recibe aportes</Text>
                </View>
              </View>
            </View>

            {!isExpanded ? (
              <View className="mt-2 flex-row items-center gap-2">
                <Ionicons name="receipt" size={18} color={palette.accent} />
                <Text className="text-sm text-gray-500">{group.lastActivity}</Text>
              </View>
            ) : (
              <>
                {group.split ? (
                  <View className="mt-3 rounded-2xl bg-white/70 px-4 py-3">
                    <Text className="text-xs uppercase tracking-wide text-gray-600">Reparto editable</Text>
                    {group.split.map((item) => (
                      <View key={item.label} className="mt-2 flex-row items-center gap-2">
                        <Text className="w-16 text-sm text-gray-800">{item.label}</Text>
                        <View className="flex-1 h-2 rounded-full bg-gray-100">
                          <View
                            className="h-full rounded-full"
                            style={{ width: `${item.value}%`, backgroundColor: palette.border }}
                          />
                        </View>
                        <Text className="text-sm font-semibold text-gray-900">{item.value}%</Text>
                        <TouchableOpacity
                          accessibilityRole="button"
                          accessibilityLabel={`Incrementar porcentaje de ${item.label}`}
                          className="rounded-full border border-gray-300 px-2 py-1">
                          <Text className="text-xs">+</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          accessibilityRole="button"
                          accessibilityLabel={`Reducir porcentaje de ${item.label}`}
                          className="rounded-full border border-gray-300 px-2 py-1">
                          <Text className="text-xs">-</Text>
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                ) : null}
                <View className="mt-3 flex-row items-center gap-2">
                  <Ionicons name="receipt" size={18} color={palette.accent} />
                  <Text className="text-sm text-gray-500">{group.lastActivity}</Text>
                </View>
                <View className="mt-3 flex-row flex-wrap gap-3">
                  <TouchableOpacity
                    accessibilityRole="button"
                    accessibilityLabel="Abrir cámara para escanear ticket"
                    className="flex-1 rounded-2xl border border-dashed px-3 py-3"
                    style={{ borderColor: palette.border }}>
                    <Text className="text-xs font-semibold uppercase tracking-wide text-gray-600">
                      OCR rápido
                    </Text>
                    <Text className="mt-1 text-sm text-gray-700">Escanea ticket o agrega gasto (comida, tour, etc.)</Text>
                    <View className="mt-2 flex-row items-center gap-2">
                      <View className="h-8 w-8 items-center justify-center rounded-full" style={{ backgroundColor: palette.chip }}>
                        <Ionicons name="camera" size={18} color={palette.accent} />
                      </View>
                      <Text className="text-xs text-gray-600">Abrirá la cámara (mock)</Text>
                    </View>
                  </TouchableOpacity>
                  <View className="flex-1 rounded-2xl border px-3 py-3" style={{ borderColor: palette.border }}>
                    <Text className="text-xs font-semibold uppercase tracking-wide text-gray-600">
                      Aportar a cuenta maestra
                    </Text>
                    <Text className="mt-1 text-sm text-gray-700">Transfiere tu parte y notifica al grupo</Text>
                    <View className="mt-2 flex-row flex-wrap gap-1">
                      {['Transferir', 'Recordar pago', 'Agregar gasto'].map((cta) => (
                        <TouchableOpacity
                          key={cta}
                          className="rounded-full bg-white px-2 py-1"
                          accessibilityRole="button"
                          accessibilityLabel={cta}>
                          <Text className="text-[11px] font-semibold text-gray-800">{cta}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                </View>
              </>
            )}
          </View>
        );
      })}
      <TouchableOpacity className="mt-2 rounded-3xl bg-gradient-to-r from-indigo-600 to-emerald-500 px-4 py-4">
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

  if (showSubscriptionStats) {
    return renderSubscriptionStatsPage();
  }

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
