export const itemPlacement = {
  after: 'after',
  before: 'before'
} as const;

export type TItemPlacement = keyof typeof itemPlacement;
