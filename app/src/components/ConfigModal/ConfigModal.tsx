import {
  Box,
  Button,
  FormField,
  Input,
  Modal,
  SpaceBetween,
} from '@cloudscape-design/components';
import { FC, useEffect, useState } from 'react';
import { UserConfig } from '@/data/types';
import {
  DEFAULT_MAX_TOKENS,
  OPENAI_API_KEY_PATTERN,
  TOKENS_HARD_LIMIT,
} from '../constants';

type Props = {
  initValues: Partial<UserConfig>;
  visible: boolean;
  onConfirm: (values: Partial<UserConfig>) => void;
};

const ConfigModal: FC<Props> = ({ visible, onConfirm, initValues }) => {
  const [apiKey, setApiKey] = useState<string>('');
  const [maxTokens, setMaxTokens] = useState<string>(`${DEFAULT_MAX_TOKENS}`);

  const [apiKeyError, setApiKeyError] = useState<string>('');
  const [maxTokensError, setMaxTokensError] = useState<string>('');

  useEffect(() => {
    setApiKey(initValues?.apiKey || '');
    setMaxTokens(`${initValues?.maxTokens || DEFAULT_MAX_TOKENS}`);
  }, [initValues]);

  // @TODO - think about a better validation
  const validateApiKey = (): boolean => {
    if (apiKey.trim() === '') {
      setApiKeyError('Api Key is requried!');
      return false;
    }

    const match = apiKey.match(OPENAI_API_KEY_PATTERN);

    if (!match || match[0] !== apiKey) {
      setApiKeyError(
        'Api Key is wrong! Example of a correct key: sk-alsmdlad98d32dj0239i1209e120pokd12p0osk0p12ksm192',
      );
      return false;
    }

    return true;
  };

  const validateMaxTokens = (): boolean => {
    const value = Number(maxTokens);

    if (value < 1) {
      setMaxTokensError('Number of tokens must be greater than 0!');
      return false;
    }

    if (value > TOKENS_HARD_LIMIT) {
      setMaxTokensError(
        `Number of tokens must be less than ${TOKENS_HARD_LIMIT}!`,
      );
      return false;
    }

    return true;
  };

  const validate = (): boolean => {
    return validateApiKey() && validateMaxTokens();
  };

  const onSubmit = (): void => {
    if (validate() === false) {
      return;
    }

    onConfirm({ apiKey, maxTokens: parseInt(maxTokens, 10) });
  };

  return (
    <Modal
      visible={visible}
      closeAriaLabel="Close modal"
      size="medium"
      onDismiss={onSubmit}
      footer={
        <Box float="right">
          <SpaceBetween direction="horizontal" size="xs">
            <Button onClick={onSubmit} variant="primary">
              Save
            </Button>
          </SpaceBetween>
        </Box>
      }
      header="You need an API Key to use the app!"
    >
      <FormField
        errorText={apiKeyError}
        label="Put your API key here."
        description="More info on API key here..."
      >
        <Input
          value={apiKey}
          onChange={(event): void => {
            setApiKeyError('');
            setApiKey(event.detail.value);
          }}
        />
      </FormField>
      <FormField
        errorText={maxTokensError}
        label="Select the max amount of response tokens."
        description="One token ~ 4 characters."
      >
        <Input
          value={maxTokens}
          type="number"
          step={1}
          onChange={(event): void => {
            setMaxTokensError('');
            setMaxTokens(event.detail.value);
          }}
        />
      </FormField>
    </Modal>
  );
};

export default ConfigModal;
