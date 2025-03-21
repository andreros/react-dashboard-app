import type React from 'react';
import type { ChangeEvent } from 'react';

import { type TItemPlacement, itemPlacement } from '@/lib/types';

import { useDashboardStore } from '../dashboard/store';
import { useSwapperStore } from './store';

export const Swapper: React.FC = () => {
  const container = useDashboardStore(store => store.container);

  const reorderItem = useSwapperStore(store => store.reorderItem);
  const setReorderItem = useSwapperStore(store => store.setReorderItem);
  const placement = useSwapperStore(store => store.placement);
  const setPlacement = useSwapperStore(store => store.setPlacement);
  const baseItem = useSwapperStore(store => store.baseItem);
  const setBaseItem = useSwapperStore(store => store.setBaseItem);

  const handleReorderItemOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    const reorderItem = Number(event.currentTarget.value);
    setReorderItem(reorderItem);
  };

  const handlePlacementOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    const placement = event.currentTarget.value as TItemPlacement;
    setPlacement(placement);
  };

  const handleBaseItemOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    const baseItem = Number(event.currentTarget.value);
    setBaseItem(baseItem);
  };

  const handleSwapButtonOnClick = () => {
    if (!container) return;
    //order(container, baseItem, reorderItem, placement);
  };

  return (
    <div className='swapper'>
      <div className='swapper__input-control'>
        <label htmlFor='reorderItem'>Put Item #</label>
        <input type='number' id='reorderItem' onChange={handleReorderItemOnChange} value={reorderItem} />
      </div>

      <div className='swapper__placement'>
        <input
          checked={placement === itemPlacement.before}
          id='placementBefore'
          name='placement'
          onChange={handlePlacementOnChange}
          type='radio'
          value={itemPlacement.before}
        />
        <label htmlFor='placementBefore'>Before</label>
      </div>

      <div className='swapper__placement'>
        <input
          checked={placement === itemPlacement.after}
          id='placementAfter'
          name='placement'
          onChange={handlePlacementOnChange}
          type='radio'
          value={itemPlacement.after}
        />
        <label htmlFor='placementAfter'>After</label>
      </div>

      <br />

      <div className='swapper__input-control'>
        <label htmlFor='baseItem'>(before / after) #</label>
        <input type='number' id='baseItem' onChange={handleBaseItemOnChange} value={baseItem} />
      </div>

      <br />

      <button type='button' onClick={handleSwapButtonOnClick}>
        Swap
      </button>
    </div>
  );
};
