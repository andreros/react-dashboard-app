import type React from 'react';
import { useEffect, useRef, useState } from 'react';

import { ApplicationDashboardItem, type TApplicationDashboardItemProps } from '@/components/applicationDashboardItem';
import { DashboardController } from '@/lib/dashboardController';

export type TDashboardProps = {
  items?: TApplicationDashboardItemProps[];
};

export const ApplicationDashboard: React.FC<TDashboardProps> = ({ items = [] }) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const [controller, setController] = useState<DashboardController | null>(null);

  useEffect(() => {
    if (!rootRef.current) return;

    // initialized dashboard controller
    setController(
      new DashboardController({
        container: rootRef.current,
        insertLeftClass: 'application-dashboard-item-left',
        insertRightClass: 'application-dashboard-item-right',
        itemContentClass: 'dashboard-item-content',
        itemRootClass: 'application-dashboard-item'
      })
    );
  }, []);

  return (
    <div ref={rootRef} className='application-dashboard'>
      <div className='application-dashboard-ie-fallback'>
        {items.length > 0 ? (
          items.map((item, index) => <ApplicationDashboardItem key={`application-dashboard-item-${index}`} {...item} controller={controller} />)
        ) : (
          <>There are no items to be displayed.</>
        )}
      </div>
    </div>
  );
};
