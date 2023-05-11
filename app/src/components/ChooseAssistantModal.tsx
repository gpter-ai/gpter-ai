import { FC } from 'react';
import { Box, Button, Cards, Grid, Modal } from '@cloudscape-design/components';
import {
  DefaultAssistant,
  defaultAssistants,
} from '@/data/prefill/defaultAssistants';
import { useAssistantModal } from '@/context/AssistantModal';
import { useStorageProvider } from '@/hooks/useStorageProvider';
import { AssistantFormFields } from '@/data/types';

type AssistantsCardsProps = {
  onChooseAssistant: (item: DefaultAssistant) => void;
};

const AssistantsCards: FC<AssistantsCardsProps> = ({ onChooseAssistant }) => {
  return (
    <Cards
      cardDefinition={{
        header: (item) =>
          item.title.charAt(0).toUpperCase() + item.title.slice(1),
        sections: [
          {
            id: 'description',
            // eslint-disable-next-line react/no-unstable-nested-components
            content: (item) => (
              <Grid gridDefinition={[{ colspan: 8 }, { colspan: 4 }]}>
                {item.description}
                <Box textAlign="right">
                  <Button onClick={() => onChooseAssistant(item)}>
                    Create
                  </Button>
                </Box>
              </Grid>
            ),
          },
        ],
      }}
      cardsPerRow={[{ cards: 1 }]}
      items={defaultAssistants}
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

  const onChooseAssistant = (item: DefaultAssistant): void =>
    assistantModal.openModal({
      onSubmit: onAssistantModalSubmit,
      mode: 'create',
      initData: { name: item.name, prompt: item.prompt },
    });

  return (
    <Modal
      onDismiss={() => setVisible(false)}
      visible={visible}
      closeAriaLabel="Close modal"
      header="Choose an assistant"
    >
      <AssistantsCards onChooseAssistant={onChooseAssistant} />
    </Modal>
  );
};

export default ChooseAssistantModal;
