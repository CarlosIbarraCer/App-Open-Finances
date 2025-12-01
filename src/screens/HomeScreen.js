import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Pressable,
  ScrollView,
  Image,
  Dimensions,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useReduceMotionPreference } from '../hooks/useReduceMotionPreference';

const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = Dimensions.get('window');
const SCREEN_WIDTH = DEVICE_WIDTH;
const CARD_WIDTH = Math.min(SCREEN_WIDTH * 0.82, 340);
const CARD_HEIGHT = CARD_WIDTH / 1.58;
const CARD_SPACING = 20;
const SNAP_INTERVAL = CARD_WIDTH + CARD_SPACING;
const HIT_SLOP = { top: 12, right: 12, bottom: 12, left: 12 };
const HIGHLIGHT_CARD_WIDTH = Math.min(SCREEN_WIDTH - 72, 320);
const HIGHLIGHT_CARD_HEIGHT = HIGHLIGHT_CARD_WIDTH / 1.68;
const CONTENT_WIDTH = Math.min(SCREEN_WIDTH - 32, 460);

const cards = [
  {
    id: 1,
    type: 'Amazon Platinium',
    number: '4756 •••• •••• 9018',
    balance: '$3,469.52',
    colors: ['#1e1b4b', '#3b82f6'],
  },
  {
    id: 2,
    type: 'Visa Gold',
    number: '5234 •••• •••• 7821',
    balance: '$5,234.18',
    colors: ['#7c3aed', '#a855f7'],
  },
  {
    id: 3,
    type: 'Mastercard Black',
    number: '6789 •••• •••• 3456',
    balance: '$8,921.03',
    colors: ['#dc2626', '#f97316'],
  },
];

const menuItems = [
  {
    key: 'finDetective',
    icon: 'search-outline',
    label: 'Detector de\nSuscripciones',
    color: '#4338CA',
  },
  {
    key: 'microSaving',
    icon: 'trending-up-outline',
    label: 'MicroAhorro\nInteligente',
    color: '#047857',
  },
  {
    key: 'splitSmart',
    icon: 'people-outline',
    label: 'SplitSmart\nGastos',
    color: '#6B21A8',
  },
  {
    key: 'guardianAi',
    icon: 'shield-checkmark-outline',
    label: 'Guardian AI\nFraude',
    color: '#BE123C',
  },
  { key: 'transfer', icon: 'swap-horizontal-outline', label: 'Transferencias', color: '#EC4899' },
  { key: 'bill', icon: 'receipt-outline', label: 'Pagar\nservicios', color: '#10B981' },
  { key: 'report', icon: 'document-text-outline', label: 'Reporte\nmovimientos', color: '#0F172A' },
  {
    key: 'openBanking',
    icon: 'link-outline',
    label: 'Permisos\nOpen Finance',
    color: '#0EA5E9',
  },
];

const simplifiedMenuKeys = ['transfer', 'microSaving', 'guardianAi'];
const highlightedCards = [
  {
    id: 'visa',
    brand: 'VISA',
    balance: '$5,566.55',
    number: '•••• 4552',
    valid: '12/22',
  },
  {
    id: 'master',
    brand: 'Mastercard',
    balance: '$8,120.00',
    number: '•••• 2345',
    valid: '08/24',
  },
];

const transactions = [
  {
    id: 'txn-1',
    label: 'Transferencia',
    subtitle: 'Transferencia entrante',
    amount: '+ $3,110',
    type: 'in',
  },
  { id: 'txn-2', label: 'Salud', subtitle: 'Farmacia', amount: '- $312.90', type: 'out' },
  {
    id: 'txn-3',
    label: 'Transferencia',
    subtitle: 'Transferencia entrante',
    amount: '+ $3,110',
    type: 'in',
    date: '13 de junio',
  },
  {
    id: 'txn-4',
    label: 'Salud',
    subtitle: 'Farmacia',
    amount: '- $312.90',
    type: 'out',
    date: '13 de junio',
  },
];

const simplifiedCardsData = [
  {
    id: '3276',
    label: '*** 3276',
    type: 'De Débito',
    expires: '07/28',
    color: '#6366f1',
  },
  {
    id: '4167',
    label: '*** 4167',
    type: 'De Crédito',
    expires: '07/32',
    color: '#0f172a',
  },
];

const openBankingInsights = [
  { id: 'connected', label: 'Bancos conectados', value: '3 activos' },
  { id: 'renewals', label: 'Permisos por renovar', value: '1 en 5 días' },
];

export default function HomeScreen({
  userName = 'Juan Pérez',
  onTransfer,
  simplifiedMode = false,
  onOpenBankConnections,
  onOpenFinanceModule,
}) {
  const [activeCardIndex, setActiveCardIndex] = React.useState(0);
  const scrollX = React.useRef(new Animated.Value(0)).current;
  const listRef = React.useRef(null);
  const reduceMotion = useReduceMotionPreference();
  const displayedMenuItems = simplifiedMode
    ? menuItems.filter((item) => simplifiedMenuKeys.includes(item.key))
    : menuItems;
  const cardsData = simplifiedMode ? cards.slice(0, 1) : cards;
  const quickTips = [
    { id: 'tip-1', title: 'Saldo disponible', value: '$24,210.00' },
    { id: 'tip-2', title: 'Próximo pago', value: '12 Feb • $850.00' },
  ];
  const simplifiedCard = simplifiedCardsData[0];
  const openBankingEnabled = typeof onOpenBankConnections === 'function';
  const handleOpenBanking = () => {
    if (openBankingEnabled) {
      onOpenBankConnections();
    }
  };
  const financeModuleMap = {
    finDetective: 'subscriptions',
    microSaving: 'microSaving',
    splitSmart: 'splitSmart',
    guardianAi: 'guardianAi',
  };

  const handleMenuItemPress = (itemKey) => {
    if (itemKey === 'transfer' && typeof onTransfer === 'function') {
      onTransfer();
      return;
    }
    if (itemKey === 'openBanking') {
      handleOpenBanking();
      return;
    }
    if (financeModuleMap[itemKey] && typeof onOpenFinanceModule === 'function') {
      onOpenFinanceModule(financeModuleMap[itemKey]);
    }
  };

  if (simplifiedMode) {
    return (
      <View className="flex-1 bg-white">
        <View className="rounded-b-[32px] bg-[#050505] px-6 pb-10 pt-16">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-sm text-gray-400">Hola,</Text>
              <Text className="text-2xl font-semibold text-white">{userName}!</Text>
            </View>
            <View className="relative">
              <View className="h-11 w-11 items-center justify-center rounded-full bg-gray-800">
                <Ionicons name="notifications-outline" size={22} color="#fff" />
              </View>
              <View className="absolute -right-1 -top-1 h-4 w-4 rounded-full bg-pink-500" />
            </View>
          </View>
        </View>

        <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 32 }}>
          <View className="px-6 pt-8">
            <Text className="mb-4 text-xl font-semibold text-gray-900">Tu tarjeta principal</Text>
            <View className="rounded-[36px] p-6" style={{ backgroundColor: simplifiedCard.color }}>
              <View className="flex-row items-center justify-between">
                <Text className="text-3xl font-semibold text-white">{simplifiedCard.label}</Text>
                <View className="h-12 w-20 rounded-full bg-white/30" />
              </View>
              <Text className="mt-4 text-lg text-white/80">{simplifiedCard.type}</Text>
              <Text className="text-sm text-white/70">Vence {simplifiedCard.expires}</Text>
              <Text className="mt-6 text-2xl font-semibold text-white">{userName}</Text>
            </View>

            <Pressable
              onPress={() => onTransfer && onTransfer()}
              className="mt-10 flex-row items-center justify-center rounded-[32px] bg-[#0f172a] px-6 py-6 shadow-lg shadow-indigo-200">
              <Ionicons name="swap-horizontal" size={40} color="#FFFFFF" />
              <Text className="ml-4 text-3xl font-bold text-white">Transferir</Text>
            </Pressable>

            <Text className="mt-8 text-center text-base text-gray-500">
              Presiona el botón para enviar dinero. Nosotros te guiamos paso a paso.
            </Text>
          </View>
        </ScrollView>
      </View>
    );
  }
  const renderHighlightedCard = (card) => (
    <LinearGradient
      key={card.id}
      colors={['#fef9c3', '#fef08a']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className="mr-4 rounded-[32px] p-6"
      style={{
        width: HIGHLIGHT_CARD_WIDTH,
        height: HIGHLIGHT_CARD_HEIGHT,
        shadowColor: '#c4b5fd',
        shadowOpacity: 0.25,
        shadowRadius: 18,
        shadowOffset: { width: 0, height: 10 },
        elevation: 5,
      }}>
      <View className="flex-row items-center justify-between">
        <Text className="text-xl font-semibold text-[#111827]">{card.brand}</Text>
        <Text className="text-2xl font-bold text-[#111827]">{card.balance}</Text>
      </View>
      <View className="mt-6 flex-row items-center justify-between">
        <View>
          <Text className="text-xs uppercase tracking-[0.35em] text-gray-700">••••</Text>
          <Text className="mt-1 text-base font-semibold text-gray-900">{card.number}</Text>
        </View>
        <View className="items-end">
          <Text className="text-xs text-gray-600">VIGENCIA</Text>
          <Text className="text-base font-semibold text-gray-900">{card.valid}</Text>
        </View>
      </View>
      <View className="mt-8 flex-row justify-between">
        <Text className="text-xs uppercase tracking-[0.3em] text-gray-500">MARGO LEPSKI</Text>
        <View className="h-8 w-12 rounded-lg bg-white/40" />
      </View>
    </LinearGradient>
  );

  const handleMomentumEnd = (event) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / SNAP_INTERVAL);
    setActiveCardIndex(index);
  };

  const handleIndicatorPress = (index) => {
    setActiveCardIndex(index);
    listRef.current?.scrollToOffset({
      offset: index * SNAP_INTERVAL,
      animated: true,
    });
  };

  const renderCardSurface = (item) => (
    <LinearGradient
      colors={item.colors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className="relative h-full w-full overflow-hidden rounded-[32px] p-6 shadow-2xl">
      <View
        className="absolute -right-24 -top-24 h-64 w-64 rounded-full opacity-25"
        style={{ backgroundColor: item.colors[1] }}
      />
      <View
        className="absolute right-0 top-24 h-36 w-36 rounded-full opacity-20"
        style={{ backgroundColor: item.colors[1] }}
      />
      <View className="relative z-10 h-full justify-between">
        <View>
          <Text className="mb-1 text-[10px] uppercase tracking-[0.5em] text-white/70">FinHub</Text>
          <Text className="text-3xl font-semibold text-white">{userName}</Text>
          <Text className="mt-2 text-sm text-white/80">{item.type}</Text>
        </View>
        <View>
          <Text className="mb-3 text-lg tracking-[0.35em] text-white">{item.number}</Text>
          <View className="flex-row items-end justify-between">
            <View>
              <Text className="text-[10px] uppercase tracking-[0.4em] text-white/60">Saldo</Text>
              <Text className="text-3xl font-bold text-white">{item.balance}</Text>
            </View>
            <Text className="text-2xl font-bold text-white">VISA</Text>
          </View>
        </View>
      </View>
    </LinearGradient>
  );

  const renderCard = ({ item, index }) => {
    const inputRange = [
      (index - 1) * SNAP_INTERVAL,
      index * SNAP_INTERVAL,
      (index + 1) * SNAP_INTERVAL,
    ];

    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.92, 1, 0.92],
      extrapolate: 'clamp',
    });
    const translateX = scrollX.interpolate({
      inputRange,
      outputRange: [30, 0, -30],
      extrapolate: 'clamp',
    });
    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [0.75, 1, 0.75],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View
        style={{
          width: CARD_WIDTH,
          height: CARD_HEIGHT,
          marginRight: CARD_SPACING,
          marginLeft: index === 0 ? 0 : -CARD_SPACING / 2,
          transform: [{ translateX }, { scale }],
          opacity,
          zIndex: cards.length - index,
        }}>
        {renderCardSurface(item)}
      </Animated.View>
    );
  };

  return (
    <View className={`flex-1 ${simplifiedMode ? 'bg-gray-50' : 'bg-[#050505]'}`}>
      <View
        className={`flex-row items-center justify-between px-6 pb-4 pt-16 ${
          simplifiedMode ? 'bg-gray-50' : 'bg-[#050505]'
        }`}>
        <View className="flex-row items-center">
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=facearea&w=120&h=120',
            }}
            className="mr-3 h-12 w-12 rounded-full"
          />
          <Text
            className={`text-xl font-semibold ${simplifiedMode ? 'text-gray-900' : 'text-white'}`}>
            Hola, {userName}
          </Text>
        </View>
        <View className="relative">
          <View
            className={`h-11 w-11 items-center justify-center rounded-full ${
              simplifiedMode ? 'border border-gray-200 bg-white' : 'bg-gray-800'
            }`}>
            <Ionicons
              name="notifications-outline"
              size={22}
              color={simplifiedMode ? '#111827' : '#fff'}
            />
          </View>
          <View
            className={`absolute -right-1 -top-1 h-4 w-4 rounded-full ${
              simplifiedMode ? 'bg-emerald-400' : 'bg-pink-500'
            }`}
          />
        </View>
      </View>

      <ScrollView
        className={`flex-1 ${simplifiedMode ? 'bg-gray-50' : 'bg-[#050505]'}`}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 16 }}>
        <View
          className="flex-1 items-center rounded-t-[36px] bg-white pb-12 pt-6"
          style={{ minHeight: DEVICE_HEIGHT * 0.85 }}>
          {simplifiedMode ? (
            <View className="px-6" style={{ width: CONTENT_WIDTH }}>
              {cardsData.map((card) => (
                <View key={card.id} className="mb-4" style={{ height: CARD_HEIGHT }}>
                  {renderCardSurface(card)}
                </View>
              ))}
              <View className="mb-6 rounded-3xl border border-gray-100 bg-gray-50 p-5">
                {quickTips.map((tip) => (
                  <View key={tip.id} className="mb-3">
                    <Text className="text-xs uppercase tracking-wide text-gray-500">
                      {tip.title}
                    </Text>
                    <Text className="text-2xl font-semibold text-gray-900">{tip.value}</Text>
                  </View>
                ))}
              </View>
            </View>
          ) : (
            <>
              <Animated.FlatList
                ref={listRef}
                data={cardsData}
                keyExtractor={(item) => String(item.id)}
                renderItem={({ item, index }) =>
                  reduceMotion ? (
                    <View
                      style={{
                        width: CARD_WIDTH,
                        height: CARD_HEIGHT,
                        marginRight: CARD_SPACING,
                        marginLeft: index === 0 ? 0 : -CARD_SPACING / 2,
                      }}>
                      {renderCardSurface(item)}
                    </View>
                  ) : (
                    renderCard({ item, index })
                  )
                }
                horizontal
                showsHorizontalScrollIndicator={false}
                snapToInterval={SNAP_INTERVAL}
                decelerationRate="fast"
                contentContainerStyle={{ paddingHorizontal: 32 }}
                onScroll={
                  reduceMotion
                    ? undefined
                    : Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
                        useNativeDriver: true,
                      })
                }
                scrollEventThrottle={16}
                onMomentumScrollEnd={handleMomentumEnd}
              />

              <View className="mt-4 flex-row justify-center space-x-2">
                {cardsData.map((card, index) => (
                  <TouchableOpacity
                    key={card.id}
                    onPress={() => handleIndicatorPress(index)}
                    accessibilityRole="button"
                    accessibilityLabel={`Mostrar tarjeta ${index + 1}`}
                    accessibilityState={{ selected: index === activeCardIndex }}
                    className={`h-2 rounded-full ${
                      index === activeCardIndex ? 'w-8 bg-gray-900' : 'w-2 bg-gray-300'
                    }`}
                  />
                ))}
              </View>
            </>
          )}

          {!simplifiedMode && (
            <View className="mt-8 px-6" style={{ width: CONTENT_WIDTH }}>
              <View className="mb-4 flex-row items-center justify-between">
                <Text className="text-lg font-semibold text-gray-900">Mis tarjetas</Text>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Administrar tarjetas"
                  accessibilityHint="Abre opciones para gestionar tus tarjetas"
                  hitSlop={HIT_SLOP}
                  className="flex-row items-center gap-1 rounded-full bg-gray-200/70 px-3 py-1.5">
                  <Ionicons name="filter" size={14} color="#111827" />
                  <Text className="text-xs font-semibold text-gray-800">Administrar</Text>
                </Pressable>
              </View>
              <View className="mb-4">
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingRight: 24, paddingLeft: 4 }}>
                  {highlightedCards.map((card) => renderHighlightedCard(card))}
                </ScrollView>
              </View>
              <View className="items-center">
                <View className="h-1.5 w-16 rounded-full bg-gray-200" />
              </View>
              <LinearGradient
                colors={['#eef2ff', '#e0f2fe']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="mt-6 rounded-[32px] p-6"
                style={{
                  borderWidth: 1,
                  borderColor: 'rgba(148,163,184,0.3)',
                  width: '100%',
                  shadowColor: '#cbd5f5',
                  shadowOpacity: 0.3,
                  shadowRadius: 20,
                  shadowOffset: { width: 0, height: 12 },
                  elevation: 6,
                }}>
                <View className="mb-4 flex-row items-center justify-between">
                  <Text className="text-lg font-semibold text-gray-900">Transacciones</Text>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Filtrar transacciones"
                    accessibilityHint="Muestra las opciones de filtro para la lista de transacciones"
                    hitSlop={HIT_SLOP}
                    className="flex-row items-center gap-1 rounded-full bg-white px-3 py-1.5">
                    <Text className="text-xs font-semibold text-gray-800">Filtrar</Text>
                    <Ionicons name="chevron-down-outline" size={14} color="#111827" />
                  </Pressable>
                </View>
                {transactions.map((txn, index) => (
                  <View
                    key={txn.id}
                    className={`flex-row items-center justify-between py-3 ${
                      index < transactions.length - 1 ? 'border-b border-white/40' : ''
                    }`}>
                    <View className="flex-row items-center gap-3">
                      <View
                        className={`h-10 w-10 items-center justify-center rounded-full ${
                          txn.type === 'in' ? 'bg-emerald-100' : 'bg-amber-100'
                        }`}>
                        <Ionicons
                          name={txn.type === 'in' ? 'arrow-down' : 'arrow-up'}
                          size={16}
                          color={txn.type === 'in' ? '#047857' : '#b45309'}
                        />
                      </View>
                      <View>
                        <Text className="font-semibold text-gray-900">{txn.label}</Text>
                        <Text className="text-xs text-gray-500">{txn.subtitle}</Text>
                      </View>
                    </View>
                    <Text
                      className={`text-sm font-semibold ${
                        txn.type === 'in' ? 'text-emerald-600' : 'text-amber-600'
                      }`}>
                      {txn.amount}
                    </Text>
                  </View>
                ))}
              </LinearGradient>
            </View>
          )}

          <View className="mt-8 px-6 pb-4" style={{ width: CONTENT_WIDTH }}>
            <View className="-mx-2 flex-row flex-wrap">
              {displayedMenuItems.map((item) => (
                <View key={item.label} className="mb-6 w-1/3 px-2">
                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => handleMenuItemPress(item.key)}
                    accessibilityRole="button"
                    accessibilityLabel={item.label.replace('\n', ' ')}
                    accessibilityHint={
                      item.key === 'transfer'
                        ? 'Abre el flujo de transferencias'
                        : financeModuleMap[item.key]
                          ? `Abre el módulo ${item.label.replace('\n', ' ')}`
                          : item.key === 'openBanking'
                            ? 'Gestiona tus permisos de finanzas abiertas'
                            : `Accede a la opción ${item.label.replace('\n', ' ')}`
                    }
                    hitSlop={HIT_SLOP}
                    className={`items-center rounded-[22px] border px-3 py-5 ${
                      simplifiedMode
                        ? 'border-emerald-100 bg-emerald-50'
                        : 'border-gray-100 bg-white'
                    }`}
                    style={{
                      minHeight: 120,
                      shadowColor: simplifiedMode ? '#E0F2F1' : '#E5E7F5',
                      shadowOffset: { width: 0, height: 8 },
                      shadowOpacity: 0.2,
                      shadowRadius: 10,
                      elevation: 4,
                    }}>
                    <Ionicons
                      name={item.icon}
                      size={28}
                      color={simplifiedMode ? '#047857' : item.color}
                    />
                    <Text
                      className={`mt-3 text-center text-sm font-semibold leading-4 ${
                        simplifiedMode ? 'text-gray-900' : 'text-gray-900'
                      }`}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>

          <View className="mt-6 px-6">
            <View
              className={`rounded-[28px] border px-5 py-4 ${
                simplifiedMode ? 'border-emerald-100 bg-white' : 'border-indigo-100 bg-indigo-50'
              }`}>
              <Text className="text-xs uppercase tracking-[0.35em] text-gray-500">Open banking</Text>
              <Text className="mt-1.5 text-xl font-semibold text-gray-900">Gestiona tus permisos</Text>
              <Text className="mt-1 text-xs text-gray-600">
                Conecta, renueva o modifica accesos conforme al estándar de finanzas abiertas.
              </Text>
              <View className="mt-3 flex-row justify-between">
                {openBankingInsights.map((item) => (
                  <View key={item.id}>
                    <Text className="text-[11px] uppercase text-gray-500">{item.label}</Text>
                    <Text className="mt-0.5 text-lg font-semibold text-gray-900">{item.value}</Text>
                  </View>
                ))}
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Gestionar conexiones bancarias"
                accessibilityHint="Abre el flujo para administrar tus permisos bancarios"
                disabled={!openBankingEnabled}
                onPress={handleOpenBanking}
                className={`mt-4 rounded-2xl px-4 py-2.5 ${
                  openBankingEnabled
                    ? simplifiedMode
                      ? 'bg-emerald-500'
                      : 'bg-gray-900'
                    : 'bg-gray-300'
                }`}>
                <Text className="text-center text-base font-semibold text-white">Gestionar permisos</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
