import { create } from 'zustand';

import { type TItemPlacement, itemPlacement } from '@/lib/types';

export type TSwapperStore = {
  baseItem: number;
  setBaseItem: (baseItem: number) => void;
  placement: TItemPlacement;
  setPlacement: (placement: TItemPlacement) => void;
  reorderItem: number;
  setReorderItem: (reorderItem: number) => void;
  /* Reset store */
  resetStore: () => void;
};

export const useSwapperStore = create<TSwapperStore>(set => ({
  baseItem: 0,
  setBaseItem: baseItem => set({ baseItem }),
  placement: itemPlacement.after,
  setPlacement: placement => set({ placement }),
  reorderItem: 0,
  setReorderItem: reorderItem => set({ reorderItem }),
  resetStore: () => {
    set({ baseItem: 0 });
    set({ placement: itemPlacement.after });
    set({ reorderItem: 0 });
  }
}));
