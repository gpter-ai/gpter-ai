import {
  Box,
  Button,
  FormField,
  Input,
  Modal,
  SpaceBetween,
} from '@cloudscape-design/components';
import { FC, useState } from 'react';
import { OPENAI_API_KEY_PATTERN } from './constants';

type Props = {
  visible: boolean;
  onConfirm: (apiKeyValue: string) => void;
};

// @TODO - allow it to be dismissible ? and give an option to set the api key in a different way
// or hide the cross icon =)
const ApiKeyModal: FC<Props> = ({ visible, onConfirm }) => {
  const [apiKey, setApiKey] = useState<string>('');
  const [apiKeyError, setApiKeyError] = useState<string>('');

  const onSubmit = (): void => {
    if (apiKey.trim() === '') {
      setApiKeyError('Api Key is requried!');
      return;
    }

    const match = apiKey.match(OPENAI_API_KEY_PATTERN);

    if (!match || match[0] !== apiKey) {
      setApiKeyError(
        'Api Key is wrong! Example of a correct key: sk-alsmdlad98d32dj0239i1209e120pokd12p0osk0p12ksm192',
      );
      return;
    }

    onConfirm(apiKey);
  };

  return (
    <Modal
      visible={visible}
      closeAriaLabel="Close modal"
      size="medium"
      onDismiss={(): void => {}}
      footer={
        <Box float="right">
          <SpaceBetween direction="horizontal" size="xs">
            <Button onClick={onSubmit} variant="primary">
              Submit
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
    </Modal>
  );
};

export default ApiKeyModal;
