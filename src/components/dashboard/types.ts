export const dashboardMode = {
  condensed: 'condensed',
  expanded: 'expanded',
  'full-screen': 'full-screen'
} as const;

export type TDashboardMode = keyof typeof dashboardMode;
