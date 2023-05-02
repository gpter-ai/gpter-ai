import {
  getSessionStartDateFromTimeStamps,
  getSessionStartDeltaFromDiffs,
} from './sessionHelper';
import {
  aggregateIntervals,
  daysToMs,
  minutesToMs,
} from '@/utils/dateTimeUtils';

interface TestCase {
  input: number[];
  expected: number;
}

describe('Session Helper', () => {
  const testCases: TestCase[] = [
    {
      input: [daysToMs(2), minutesToMs(5), minutesToMs(25)],
      expected: 0, // do not fetch history if the prev event was more than 1 days ago
    },
    {
      input: [daysToMs(1), minutesToMs(5), minutesToMs(25)],
      expected: daysToMs(1) + minutesToMs(30),
    },
    {
      input: [daysToMs(1), minutesToMs(5), minutesToMs(45)],
      expected: daysToMs(1) + minutesToMs(5),
    },
    {
      input: [
        minutesToMs(10),
        minutesToMs(20),
        minutesToMs(30),
        minutesToMs(40),
      ],
      expected: minutesToMs(10 + 20 + 30),
    },
    {
      input: [
        minutesToMs(2),
        minutesToMs(2),
        minutesToMs(2),
        minutesToMs(2),
        minutesToMs(2),
        minutesToMs(2),
        minutesToMs(2),
        minutesToMs(2),
      ],
      expected: minutesToMs(12),
    },
  ];

  testCases.forEach(({ input, expected }) => {
    it(`should return expected value for: ${JSON.stringify(input)}`, () => {
      const historyStartDate = getSessionStartDeltaFromDiffs(
        aggregateIntervals(input),
      );
      expect(historyStartDate).toEqual(expected);
    });
  });

  describe('getHistoryStartDateFromTimeStamps', () => {
    it('should return expected value', () => {
      const testDate = Date.now();
      const historyStartDate = getSessionStartDateFromTimeStamps([
        testDate - daysToMs(1),
        testDate - daysToMs(1) - minutesToMs(60),
        testDate - daysToMs(1) - minutesToMs(60) - minutesToMs(60),
      ]);

      const expectedStartDate = testDate - daysToMs(1) - minutesToMs(60);

      expect(historyStartDate).toEqual(expectedStartDate);
    });
  });
});
