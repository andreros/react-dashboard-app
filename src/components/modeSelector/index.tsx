import type React from 'react';
import type { ChangeEvent } from 'react';

import { useDashboardStore } from '@/components/dashboard/store';
import { type TDashboardMode, dashboardMode } from '@/components/dashboard/types';

export const ModeSelector: React.FC = () => {
  const mode = useDashboardStore(store => store.mode);
  const setMode = useDashboardStore(store => store.setMode);

  const handleModeOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    const mode = event.currentTarget.value as TDashboardMode;
    setMode(mode);
  };

  return (
    <div className='mode-selector'>
      <div className='mode-selector__title'>Dashboard Mode</div>

      <div className='mode-selector__option'>
        <input
          checked={mode === dashboardMode.condensed}
          id='modeCondensed'
          name='dashboardMode'
          onChange={handleModeOnChange}
          type='radio'
          value={dashboardMode.condensed}
        />
        <label htmlFor='modeCondensed'>Condensed</label>
      </div>

      <div className='mode-selector__option'>
        <input
          checked={mode === dashboardMode['full-screen']}
          id='modeFullScreen'
          name='dashboardMode'
          onChange={handleModeOnChange}
          type='radio'
          value={dashboardMode['full-screen']}
        />
        <label htmlFor='modeFullScreen'>Full Screen</label>
      </div>
    </div>
  );
};
