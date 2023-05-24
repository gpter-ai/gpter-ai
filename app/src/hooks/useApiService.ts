import { MockApiService } from '@/api/mockApiService';
import { ApiService } from '@/api/types';
import { USE_MOCK_API } from '@/api/constants';
import OpenAiApiService from '@/api/openaiApiService';
import { useStorageProvider } from './useStorageProvider';

type UseApiService = {
  apiService: ApiService;
  checkApiKey: (apiKey: string) => Promise<'valid' | 'invalid' | 'error'>;
};

export const useApiService = (): UseApiService => {
  const storageProvider = useStorageProvider();

  const apiService = USE_MOCK_API
    ? new MockApiService(storageProvider)
    : new OpenAiApiService(storageProvider);

  const checkApiKey = USE_MOCK_API
    ? MockApiService.checkApiKey
    : OpenAiApiService.checkApiKey;

  return { apiService, checkApiKey };
};
