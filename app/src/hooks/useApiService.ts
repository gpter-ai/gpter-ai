import { useContext } from 'react';
import { MockApiService } from '@/api/mockApiService';
import { OpenAiApiService } from '@/api/openaiApiService';
import { ApiService } from '@/api/types';
import { UserConfigContext } from '@/context/UserConfig';
import { USE_MOCK_API } from '@/api/constants';

type UseApiService = {
  apiService: ApiService;
};

export const useApiService = (apiKey?: string): UseApiService => {
  const { userConfig } = useContext(UserConfigContext);

  const key = apiKey ?? userConfig?.apiKey ?? '';

  const apiService = USE_MOCK_API
    ? new MockApiService()
    : new OpenAiApiService(key);

  return { apiService };
};
