import {
  Box,
  Button,
  FormField,
  Input,
  Modal,
  SpaceBetween,
  Toggle,
} from '@cloudscape-design/components';
import { FC, useEffect, useState } from 'react';
import { UserConfig } from '@/data/types';
import { useApiService } from '@/hooks/useApiService';
import { OPENAI_API_KEY_PATTERN } from '../constants';
import HelpModal from '../HelpModal';

type Props = {
  initValues: Partial<UserConfig>;
  visible: boolean;
  onConfirm: (values: UserConfig) => void;
};

const ConfigModal: FC<Props> = ({ visible, onConfirm, initValues }) => {
  const [apiKey, setApiKey] = useState<string>('');
  const [minimizeOnClose, setMinimizeOnClose] = useState(false);
  const [validatedApiKey, setValidatedApiKey] = useState<string>('');
  const [apiKeyError, setApiKeyError] = useState<string>('');

  const [helpModalVisible, setHelpModalVisible] = useState<boolean>(false);

  useEffect(() => {
    setApiKey(initValues?.apiKey || '');
    setValidatedApiKey(initValues?.apiKey || '');
    setMinimizeOnClose(initValues.minimizeOnClose || false);
  }, [initValues]);

  const { checkApiKey } = useApiService();

  const apiKeyNeedsValidation = validatedApiKey !== apiKey;

  const validateFormat = (newKey?: string): string => {
    const value = newKey ?? apiKey;

    if (value.trim() === '') {
      return 'Api Key is requried!';
    }

    const match = value.match(OPENAI_API_KEY_PATTERN);

    if (!match || match[0] !== value) {
      return 'Api Key is wrong! Example of a correct key: sk-alsmdlad98d32dj0239i1209e120pokd12p0osk0p12ksm192';
    }

    return '';
  };

  const apiKeyValid = validateFormat() === '';

  const onSubmit = (): void => {
    const error = validateFormat();

    if (error) {
      setApiKeyError(error);
      return;
    }

    if (apiKeyNeedsValidation) {
      return;
    }

    onConfirm({ apiKey, minimizeOnClose });
  };

  const onValidateApiKey = (): void => {
    checkApiKey(apiKey).then((result) => {
      switch (result) {
        case 'valid':
          setValidatedApiKey(apiKey);
          break;
        case 'invalid':
          setApiKeyError('This API key is invalid! Try a different one!');
          break;
        case 'error':
          setApiKeyError('Something went wrong! Try again later!');
          break;
      }
    });
  };

  return (
    <Modal
      visible={visible}
      closeAriaLabel="Close modal"
      size="medium"
      onDismiss={() => {
        if (initValues.apiKey) {
          onConfirm({ apiKey: initValues.apiKey, minimizeOnClose });
        } else {
          onSubmit();
        }
      }}
      footer={
        <Box float="right">
          <SpaceBetween direction="horizontal" size="xs">
            <Button onClick={() => setHelpModalVisible(true)}>Help</Button>
            {apiKeyNeedsValidation && apiKeyValid && (
              <Button onClick={onValidateApiKey}>Validate API Key</Button>
            )}
            <Button
              disabled={!apiKeyValid || apiKeyNeedsValidation}
              onClick={onSubmit}
              variant="primary"
            >
              Save
            </Button>
          </SpaceBetween>
        </Box>
      }
      header="Configuration"
    >
      <SpaceBetween size="m">
        <FormField
          errorText={apiKeyError}
          label="Put your API key here."
          description="You need the API key in order to be able to connect to the AI"
        >
          <Input
            value={apiKey}
            onChange={(event): void => {
              setApiKeyError(validateFormat(event.detail.value));
              setApiKey(event.detail.value);
            }}
          />
        </FormField>
        <FormField>
          <Toggle
            checked={minimizeOnClose}
            onChange={(e) => setMinimizeOnClose(e.detail.checked)}
          >
            Minimize on close
          </Toggle>
        </FormField>
      </SpaceBetween>
      <HelpModal visible={helpModalVisible} setVisible={setHelpModalVisible} />
    </Modal>
  );
};

export default ConfigModal;
