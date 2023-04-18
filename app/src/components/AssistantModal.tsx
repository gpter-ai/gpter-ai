import {
  Box,
  Button,
  FormField,
  Input,
  Modal,
  SpaceBetween,
  Textarea,
} from '@cloudscape-design/components';
import { useState } from 'react';
import DismissModal from './DismissModal';
import { AssistantFormFields } from '@/data/types';

export type Props = {
  visible: boolean;
  setVisible: (value: boolean) => void;
  onSubmit: (fields: AssistantFormFields) => void;
};

// @TODO - convert to AssistantModal allowing also edit
const AssistantModal = ({ visible, setVisible, onSubmit }: Props) => {
  const [name, setName] = useState<string>('');
  const [prompt, setPrompt] = useState<string>('');

  const [nameError, setNameError] = useState<string>('');
  const [promptError, setPromptError] = useState<string>('');

  const [dismissModalOpen, setDismissModalOpen] = useState<boolean>(false);

  const isDirty = () => name !== '' || prompt !== '';

  const nameValid = () => name.trim() !== '';
  const promptValid = () => prompt.trim() !== '';

  // @TODO - come up with better validation rules
  const isValid = () => nameValid() && promptValid();

  const setErrorMessages = () => {
    if (nameValid() === false) {
      setNameError('Name must not be empty!');
    }

    if (promptValid() === false) {
      setPromptError('Prompt must not be empty!');
    }
  };

  const confirmDismiss = () => {
    if (isDirty()) {
      setDismissModalOpen(true);
    } else {
      dismiss();
    }
  };

  const dismiss = () => {
    setName('');
    setPrompt('');
    setNameError('');
    setPromptError('');
    setVisible(false);
  };

  const create = () => {
    if (isValid()) {
      onSubmit({ name, prompt });
      dismiss();
    } else {
      setErrorMessages();
    }
  };

  return (
    <Modal
      onDismiss={confirmDismiss}
      visible={visible}
      closeAriaLabel="Close"
      header="New Assistant"
      footer={
        <Box float="right">
          <SpaceBetween direction="horizontal" size="xs">
            <Button onClick={confirmDismiss} variant="link">
              Cancel
            </Button>
            <Button variant="primary" onClick={create}>
              Create
            </Button>
          </SpaceBetween>
        </Box>
      }
    >
      <SpaceBetween direction="vertical" size="m">
        <FormField label="Name" errorText={nameError}>
          <Input
            value={name}
            onChange={(e) => {
              setName(e.detail.value);
              setNameError('');
            }}
          />
        </FormField>
        <FormField
          label="Prompt"
          errorText={promptError}
          description="Enter 20 to 200 characters"
        >
          <Textarea
            value={prompt}
            onChange={(e) => {
              setPrompt(e.detail.value);
              setPromptError('');
            }}
          />
        </FormField>
      </SpaceBetween>
      <DismissModal
        visible={dismissModalOpen}
        onCancel={() => setDismissModalOpen(false)}
        onConfirm={() => {
          setDismissModalOpen(false);
          dismiss();
        }}
      />
    </Modal>
  );
};

export default AssistantModal;
