import {
  aggregateIntervals,
  daysToMs,
  minutesToMs,
} from '@/utils/dateTimeUtils';

const HISTORY_STEPS = aggregateIntervals([
  daysToMs(1),
  minutesToMs(60),
  minutesToMs(30),
  minutesToMs(15),
  minutesToMs(5),
  minutesToMs(2),
  minutesToMs(1),
  minutesToMs(1),
  minutesToMs(1),
  minutesToMs(1),
]);

export const getHistoryStartDateFromDiffs = (msDiffs: number[]): number => {
  if (msDiffs.length === 0) return 0;

  for (let i = 0; i < msDiffs.length; i++) {
    const prevDiff = msDiffs[i - 1] ?? 0;
    if (i > HISTORY_STEPS.length) return prevDiff;
    const currentDiff = msDiffs[i];
    const maxDiff = HISTORY_STEPS[i];
    if (currentDiff > maxDiff) return prevDiff;
    const diffDelta = currentDiff - prevDiff;
    const historyDiff = maxDiff - HISTORY_STEPS[i - 1];
    if (diffDelta > historyDiff) return prevDiff;
  }

  return msDiffs[msDiffs.length - 1];
};
