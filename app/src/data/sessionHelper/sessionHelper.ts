import { orderBy } from 'lodash';
import { daysToMs, minutesToMs } from '@/utils/dateTimeUtils';

const SESSION_STEPS = [
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
];

export const getSessionStartDate = (timeStamps: number[]): number => {
  const sortedTimeStamps = orderBy(timeStamps, (x) => x, 'desc');
  let currentTimeStamp = Date.now();
  for (let i = 0; i < sortedTimeStamps.length; i++) {
    const timeStamp = sortedTimeStamps[i];
    const deltaMS = currentTimeStamp - timeStamp;
    const isValid = deltaMS < SESSION_STEPS[i];

    if (!isValid) {
      return currentTimeStamp;
    }

    currentTimeStamp = timeStamp;
  }

  return currentTimeStamp;
};
