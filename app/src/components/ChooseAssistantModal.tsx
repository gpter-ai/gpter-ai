import { FC, useState } from 'react';
import {
  Button,
  Cards,
  Modal,
  SpaceBetween,
  TextFilter,
} from '@cloudscape-design/components';

import { useAssistantModal } from '@/context/AssistantModal';
import { useStorageProvider } from '@/hooks/useStorageProvider';
import { Assistant, AssistantFormFields } from '@/data/types';
import { Prompt, prompts } from '@/data/prompts';
import { useAssistantsProvider } from '@/hooks/useAssistantsProvider';
import { useChatService } from '@/data/ChatService';

type AssistantsCardsProps = {
  onChooseAssistant: (item: Prompt) => void;
  filterText: string;
  setFilterText: (filterText: string) => void;
};

const AssistantsCards: FC<AssistantsCardsProps> = ({
  onChooseAssistant,
  filterText,
  setFilterText,
}) => (
  <Cards
    trackBy="prompt"
    filter={
      <TextFilter
        filteringPlaceholder="Find assistants"
        filteringText={filterText}
        onChange={(e) => setFilterText(e.detail.filteringText.toLowerCase())}
      />
    }
    cardDefinition={{
      header: (item) => item.act,
      sections: [
        {
          id: 'description',
          // eslint-disable-next-line react/no-unstable-nested-components
          content: (item) => (
            <SpaceBetween size="m">
              <div key={item.act}>{item.prompt}</div>
              <Button onClick={() => onChooseAssistant(item)}>Add</Button>
            </SpaceBetween>
          ),
        },
      ],
    }}
    cardsPerRow={[{ cards: 1 }]}
    items={prompts.filter((p) => p.act.toLowerCase().includes(filterText))}
  />
);

type Props = {
  visible: boolean;
  setVisible: (visible: boolean) => void;
};

const ChooseAssistantModal: FC<Props> = ({ visible, setVisible }) => {
  const assistantModal = useAssistantModal();

  const storageProvider = useStorageProvider();

  const { chatService } = useChatService();

  const { setSelectedAssistant } = useAssistantsProvider();
  const [filterText, setFilterText] = useState('');

  const onAssistantModalSubmit = (props: AssistantFormFields): void => {
    storageProvider
      .createAssistant(props)
      .then((assistant: Assistant) => {
        setSelectedAssistant(assistant);
        setFilterText('');
        chatService.submitMessage(assistant.prompt, assistant.id, 'system');
      })
      .then(() => setVisible(false));
  };

  const onChooseAssistant = (item: Prompt): void =>
    assistantModal.openModal({
      onSubmit: onAssistantModalSubmit,
      mode: 'create',
      initData: { name: item.act, prompt: item.prompt },
    });

  return (
    <Modal
      size="large"
      onDismiss={() => {
        setVisible(false);
        setFilterText('');
      }}
      visible={visible}
      closeAriaLabel="Close modal"
      header="Add an assistant"
    >
      <AssistantsCards
        onChooseAssistant={onChooseAssistant}
        filterText={filterText}
        setFilterText={setFilterText}
      />
    </Modal>
  );
};

export default ChooseAssistantModal;
