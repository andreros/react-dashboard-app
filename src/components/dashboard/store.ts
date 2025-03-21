import { create } from 'zustand';

import { type TDashboardMode, dashboardMode } from './types';

export type TDashboardStore = {
  container: HTMLElement | null;
  setContainer: (container: HTMLElement) => void;
  mode: TDashboardMode;
  setMode: (mode: TDashboardMode) => void;
  /* Reset store */
  resetStore: () => void;
};

export const useDashboardStore = create<TDashboardStore>(set => ({
  container: null,
  setContainer: container => set({ container }),
  mode: dashboardMode.condensed,
  setMode: mode => set({ mode }),
  resetStore: () => {
    set({ container: null });
    set({ mode: dashboardMode.condensed });
  }
}));
