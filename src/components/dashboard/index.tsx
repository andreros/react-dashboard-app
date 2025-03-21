import type React from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';

import { DashboardItem, type TDashboardItemProps } from '@/components/dashboardItem';
import { animation } from '@/lib/constants';
import { DashboardController } from '@/lib/dashboardController';

import { useDashboardStore } from './store';
import { dashboardMode } from './types';

export type TDashboardProps = {
  items?: TDashboardItemProps[];
};

export const Dashboard: React.FC<TDashboardProps> = ({ items = [] }) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const mode = useDashboardStore(store => store.mode);
  const setMode = useDashboardStore(store => store.setMode);
  //const setContainer = useDashboardStore(store => store.setContainer);

  const [controller, setController] = useState<DashboardController | null>(null);

  const updateItemsPosition = (controller: DashboardController) => {
    const t = setTimeout(() => {
      controller.setElementsPosition();
      clearTimeout(t);
    }, animation.updateTimeout);
  };

  useEffect(() => {
    if (!controller) return;
    updateItemsPosition(controller);
  }, [controller, mode]);

  useEffect(() => {
    if (!rootRef.current) return;

    // initialized dashboard controller
    const controller = new DashboardController({
      container: rootRef.current,
      insertLeftClass: 'dashboard-item-left',
      insertRightClass: 'dashboard-item-right',
      itemContentClass: 'dashboard-item-content',
      itemRootClass: 'dashboard-item'
    });

    setController(controller);

    const onResize = () => {
      updateItemsPosition(controller);
    };

    const onMouseMove = (e: MouseEvent) => {
      e.preventDefault();
      if (!rootRef.current?.classList.contains('dashboard--full-screen')) {
        if (controller.isMouseHovering(rootRef.current!, e.clientX, e.clientY)) {
          if (!rootRef.current?.classList.contains('dashboard--expanded')) setMode(dashboardMode.expanded);
        } else {
          if (!rootRef.current?.classList.contains('dashboard--condensed')) setMode(dashboardMode.condensed);
        }
      }
    };

    window.addEventListener('resize', onResize);
    document.addEventListener('mousemove', onMouseMove);

    return () => {
      window.removeEventListener('resize', onResize);
      document.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  const rootClasses = useMemo(() => {
    let result = 'dashboard';
    if (mode) result = `${result} dashboard--${mode}`;
    return result;
  }, [mode]);

  return (
    <div ref={rootRef} className={rootClasses}>
      <div className='dashboard-ie-fallback'>
        {items.length > 0 ? (
          items.map((item, index) => <DashboardItem key={`dashboard-item-${index}`} {...item} controller={controller} />)
        ) : (
          <>There are no items to be displayed.</>
        )}
      </div>
    </div>
  );
};
