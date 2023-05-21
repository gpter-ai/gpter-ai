import { FC, useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { Box, Button, Icon } from '@cloudscape-design/components';
import { Assistant } from '@/data/types';
import { useAssistantsProvider } from '@/hooks/useAssistantsProvider';

type Props = {
  assistant: Assistant;
};

// inspired by - https://codesandbox.io/s/xenodochial-clarke-fxb9rt?file=/src/index.js:222-263
const DraggableAssistant: FC<Props> = ({ assistant }) => {
  const DRAG_TYPE = 'assistant';
  const ref = useRef(null);

  const { selectedAssistant, selectAssistantById, reorderAssistants } =
    useAssistantsProvider();

  const [{ handlerId }, drop] = useDrop({
    accept: DRAG_TYPE,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    drop(item) {
      if (!ref.current) {
        return;
      }

      const draggedAssistant = item as Assistant;

      const dragId = draggedAssistant.id;
      const hoverId = assistant.id;

      if (dragId === hoverId) {
        return;
      }

      reorderAssistants(dragId, hoverId);
    },
  });

  const [, drag] = useDrag({
    type: DRAG_TYPE,
    item: assistant,
  });

  drag(drop(ref));

  const iconVariant =
    selectedAssistant?.id === assistant.id ? 'inverted' : 'link';

  return (
    <div
      ref={ref}
      data-handler-id={handlerId}
      key={assistant.id}
      className="assistantsPaneButtonWrapper"
    >
      <Button
        onClick={() => selectAssistantById(assistant.id)}
        variant={assistant.id === selectedAssistant?.id ? 'primary' : 'normal'}
      >
        <Box textAlign="center" color="inherit">
          {assistant.name}
          <Box float="right">
            <Icon name="drag-indicator" variant={iconVariant} />
          </Box>
        </Box>
      </Button>
    </div>
  );
};

export default DraggableAssistant;
