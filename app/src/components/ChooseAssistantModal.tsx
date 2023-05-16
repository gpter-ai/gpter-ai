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
import { AssistantFormFields } from '@/data/types';
import { Prompt, prompts } from '@/data/prompts';

type AssistantsCardsProps = {
  onChooseAssistant: (item: Prompt) => void;
};

const AssistantsCards: FC<AssistantsCardsProps> = ({ onChooseAssistant }) => {
  const [filterText, setFilterText] = useState('');
  return (
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
};

type Props = {
  visible: boolean;
  setVisible: (visible: boolean) => void;
};

const ChooseAssistantModal: FC<Props> = ({ visible, setVisible }) => {
  const assistantModal = useAssistantModal();

  const storageProvider = useStorageProvider();

  const onAssistantModalSubmit = (props: AssistantFormFields): void => {
    storageProvider.createAssistant(props);
    setVisible(false);
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
      onDismiss={() => setVisible(false)}
      visible={visible}
      closeAriaLabel="Close modal"
      header="Add an assistant"
    >
      <AssistantsCards onChooseAssistant={onChooseAssistant} />
    </Modal>
  );
};

export default ChooseAssistantModal;