import React from 'react';

import InvestmentsOverviewScreen from './InvestmentsOverviewScreen';
import CetesInvestmentScreen from './CetesInvestmentScreen';

type InvestmentsView = 'overview' | 'cetes';

export default function InvestmentsFlow() {
  const [view, setView] = React.useState<InvestmentsView>('overview');

  if (view === 'cetes') {
    return <CetesInvestmentScreen onBack={() => setView('overview')} />;
  }

  return <InvestmentsOverviewScreen onOpenCetes={() => setView('cetes')} />;
}
