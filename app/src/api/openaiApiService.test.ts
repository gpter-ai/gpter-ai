import { IndexedStorageProvider } from '@/data/indexedDB/IndexedStorageProvider';
import OpenAiApiService from './openaiApiService';
import { API_TIMEOUT } from './constants';
import TimeoutError from './error/TimeoutError';
jest.mock('@/data/indexedDB/IndexedStorageProvider', () => ({
  IndexedStorageProvider: jest.fn().mockImplementation(() => {
    return {
      getUserConfig: jest.fn().mockResolvedValue({ apiKey: 'test' }),
    };
  }),
}));

jest.mock('./constants', () => ({
  API_TIMEOUT: 1,
}));

jest.mock('@microsoft/fetch-event-source', () => ({
  fetchEventSource: () => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(''), API_TIMEOUT * 100);
    });
  },
}));

describe('timeout', () => {
  const instance = new OpenAiApiService(new IndexedStorageProvider());

  test('throws TimeoutError if onopen is not called before API_TIMEOUT elapses', async () => {
    await expect(() => instance.sendMessages([], () => {})).rejects.toThrow(
      TimeoutError,
    );
  });
});

// @TODO implement these tests
describe('abort', () => {});

describe('onmessage', () => {});
