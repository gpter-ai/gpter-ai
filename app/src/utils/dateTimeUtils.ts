export const secondsToMs = (seconds: number): number => seconds * 1000;

export const minutesToMs = (minutes: number): number =>
  secondsToMs(minutes * 60);

export const hoursToMs = (hours: number): number => minutesToMs(hours * 60);

export const daysToMs = (days: number): number => hoursToMs(days * 24);

export const aggregateIntervals = (timestamps: number[]): number[] =>
  timestamps.reduce((acc, curr) => {
    acc.push(curr + (acc[acc.length - 1] ?? 0));
    return acc;
  }, [] as number[]);
