import { orderBy } from 'lodash';
import {
  aggregateIntervals,
  daysToMs,
  minutesToMs,
} from '@/utils/dateTimeUtils';

const SESSION_STEPS = aggregateIntervals([
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

export const getSessionStartDeltaFromDiffs = (msDiffs: number[]): number => {
  if (msDiffs.length === 0) return 0;

  for (let i = 0; i < msDiffs.length; i++) {
    const prevDiff = msDiffs[i - 1] ?? 0;
    if (i > SESSION_STEPS.length) return prevDiff;
    const currentDiff = msDiffs[i];
    const maxDiff = SESSION_STEPS[i];
    if (currentDiff > maxDiff) return prevDiff;
    const diffDelta = currentDiff - prevDiff;
    const historyDiff = maxDiff - SESSION_STEPS[i - 1];
    if (diffDelta > historyDiff) return prevDiff;
  }

  return msDiffs[msDiffs.length - 1];
};

export const getSessionStartDateFromTimeStamps = (
  timeStamps: number[],
): number => {
  const sortedTimeStamps = orderBy(timeStamps);
  const msDiffs = [];
  for (let i = 1; i < sortedTimeStamps.length; i++) {
    msDiffs.push(sortedTimeStamps[i] - sortedTimeStamps[i - 1]);
  }
  const startTimeStamp = sortedTimeStamps[sortedTimeStamps.length - 1];

  return startTimeStamp - getSessionStartDeltaFromDiffs(msDiffs);
};

export const getSessionStartDate = (timeStamps: number[]): number => {
  return Date.now() - getSessionStartDateFromTimeStamps(timeStamps);
};
