import React from 'react';
import TransferScreen from './TransferScreen';
import AddBeneficiaryScreen from './AddBeneficiaryScreen';

type TransferFlowProps = {
  onClose: () => void;
};

type TransferView = 'main' | 'add';

export type Beneficiary = {
  id: string;
  name: string;
  account: string;
  avatar: string;
};

const initialBeneficiaries: Beneficiary[] = [
  {
    id: 'emma',
    name: 'Emma',
    account: '8790 1234 1234',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
  {
    id: 'justin',
    name: 'Justin',
    account: '4567 8877 2211',
    avatar: 'https://randomuser.me/api/portraits/men/51.jpg',
  },
];

export default function TransferFlow({ onClose }: TransferFlowProps) {
  const [view, setView] = React.useState<TransferView>('main');
  const [beneficiaries, setBeneficiaries] = React.useState(initialBeneficiaries);

  const handleAddBeneficiary = (payload: { name: string; account: string }) => {
    const newBeneficiary: Beneficiary = {
      id: String(Date.now()),
      name: payload.name,
      account: payload.account,
      avatar: 'https://randomuser.me/api/portraits/lego/2.jpg',
    };
    setBeneficiaries((prev) => [newBeneficiary, ...prev]);
    setView('main');
  };

  if (view === 'add') {
    return (
      <AddBeneficiaryScreen
        onBack={() => setView('main')}
        onSave={({ name, account }) => handleAddBeneficiary({ name, account })}
      />
    );
  }

  return (
    <TransferScreen
      onClose={onClose}
      beneficiaries={beneficiaries}
      onAddBeneficiary={() => setView('add')}
    />
  );
}
