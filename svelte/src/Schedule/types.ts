export const M = 1;
export const T = 2;
export const W = 3;
export const R = 4;
export const F = 5;

export type ScheduleBlock = {
  day?: 1 | 2 | 3 | 4 | 5;
  start?: string;
  end?: string;
  name: string;
};
