import type React from 'react';
import { useEffect, useMemo, useRef } from 'react';

import type { DashboardController } from '@/lib/dashboardController';

export type TDashboardItemProps = {
  children?: string | React.ReactElement | React.ReactElement[];
  className?: string;
  controller?: DashboardController | null;
};

export const DashboardItem: React.FC<TDashboardItemProps> = ({ children, className, controller }) => {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!rootRef.current) return;
    // add this item to controller
    controller?.addItem(rootRef.current);
  }, [controller]);

  const rootClasses = useMemo(() => {
    let result = 'dashboard-item';
    if (className) result = `${result} ${className}`;
    return result;
  }, [className]);

  return (
    <div ref={rootRef} className={rootClasses}>
      <div className='dashboard-item-content'>{children}</div>
    </div>
  );
};
