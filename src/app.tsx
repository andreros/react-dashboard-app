import type React from 'react';

import { ApplicationDashboard } from '@/components/applicationDashboard';
import { Breakpoint } from '@/components/breakpoint';
import { Dashboard } from '@/components/dashboard';
import { ModeSelector } from '@/components/modeSelector';
import { Swapper } from '@/components/swapper';

import './sass/index.scss';

import { applicationDashboardItems, dashboardItems } from './data';

export const App: React.FC = () => {
  return (
    <div className='dashboard-app'>
      <Breakpoint />
      <ModeSelector />
      <Swapper />
      <h1 className='dashboard-app__title'>Application Dashboard</h1>
      <ApplicationDashboard items={applicationDashboardItems} />
      <Dashboard items={dashboardItems} />
    </div>
  );
};
