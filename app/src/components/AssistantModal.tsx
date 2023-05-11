import {
  Box,
  Button,
  FormField,
  Input,
  InputProps,
  Modal,
  SpaceBetween,
  Textarea,
} from '@cloudscape-design/components';
import { NonCancelableEventHandler } from '@cloudscape-design/components/internal/events';
import { FC, useEffect, useState } from 'react';
import DangerModal from './DangerModal';
import { AssistantFormFields } from '@/data/types';

export type Props = {
  visible: boolean;
  setVisible: (value: boolean) => void;
  onSubmit: (fields: AssistantFormFields) => void;
  initData: AssistantFormFields;
  mode: 'create' | 'edit';
};

const AssistantModal: FC<Props> = ({
  visible,
  setVisible,
  onSubmit,
  initData,
  mode,
}) => {
  const [name, setName] = useState<string>('');
  const [prompt, setPrompt] = useState<string>('');

  const [nameError, setNameError] = useState<string>('');
  const [promptError, setPromptError] = useState<string>('');

  const [dismissModalOpen, setDismissModalOpen] = useState<boolean>(false);

  useEffect(() => {
    setName(initData.name);
    setPrompt(initData.prompt);
  }, [initData]);

  const isDirty = (): boolean =>
    name !== initData.name || prompt !== initData.prompt;

  const nameValid = (): boolean => name.trim() !== '';
  const promptValid = (): boolean => true;

  // @TODO - come up with better validation rules
  const isValid = (): boolean => nameValid() && promptValid();

  const setErrorMessages = (): void => {
    if (nameValid() === false) {
      setNameError('Name must not be empty!');
    }

    if (promptValid() === false) {
      setPromptError('Prompt must not be empty!');
    }
  };

  const confirmDismiss = (): void => {
    if (isDirty()) {
      setDismissModalOpen(true);
    } else {
      dismiss();
    }
  };

  const dismiss = (): void => {
    setName('');
    setPrompt('');
    setNameError('');
    setPromptError('');
    setVisible(false);
  };

  const create = (): void => {
    if (isValid()) {
      onSubmit({ name, prompt });
      dismiss();
    } else {
      setErrorMessages();
    }
  };

  const onChangeName: NonCancelableEventHandler<InputProps.ChangeDetail> = (
    event,
  ) => {
    setName(event.detail.value);
    setNameError('');
  };

  const onChangePrompt: NonCancelableEventHandler<InputProps.ChangeDetail> = (
    event,
  ) => {
    setPrompt(event.detail.value);
    setPromptError('');
  };

  return (
    <Modal
      onDismiss={confirmDismiss}
      visible={visible}
      closeAriaLabel="Close"
      header={mode === 'create' ? 'New Assistant' : 'Edit Assistant'}
      footer={
        <Box float="right">
          <SpaceBetween direction="horizontal" size="xs">
            <Button onClick={confirmDismiss} variant="link">
              Cancel
            </Button>
            <Button variant="primary" onClick={create}>
              {mode === 'create' ? 'Create' : 'Save'}
            </Button>
          </SpaceBetween>
        </Box>
      }
    >
      <SpaceBetween direction="vertical" size="m">
        <FormField label="Name" errorText={nameError}>
          <Input value={name} onChange={onChangeName} />
        </FormField>
        <FormField
          label="Prompt"
          errorText={promptError}
          description="Enter 20 to 200 characters"
        >
          <Textarea value={prompt} onChange={onChangePrompt} />
        </FormField>
      </SpaceBetween>
      <DangerModal
        visible={dismissModalOpen}
        onCancel={(): void => setDismissModalOpen(false)}
        onConfirm={(): void => {
          setDismissModalOpen(false);
          dismiss();
        }}
        text="You are about to close the creator! All unsaved changes will be lost!"
        header="Attention!"
      />
    </Modal>
  );
};

export default AssistantModal;
