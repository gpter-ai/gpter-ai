import {
  Box,
  Button,
  Container,
  Header,
  InputProps,
  NonCancelableCustomEvent,
  SpaceBetween,
  Textarea,
} from '@cloudscape-design/components';
import { useState } from 'react';
import { useAutoGrowTextArea } from '@/hooks/useAutoGrowTextArea';
import { useDataProvider } from '@/hooks/useDataProvider';
import { Assistant } from '@/data/types';

type Props = {
  assistant: Assistant;
};

const Chat = ({ assistant }: Props) => {
  const [text, setText] = useState('');
  const { containerRef, updateTextAreaHeight } = useAutoGrowTextArea();

  const dataProvider = useDataProvider();
  const queries = dataProvider.getQueriesByAssistant(assistant.id);

  const historyText = queries
    .map(
      (query) => `Question: ${query.content} ~~~ Response: ${query.response}`,
    )
    .join('\n');

  const onValueChange = (
    e: NonCancelableCustomEvent<InputProps.ChangeDetail>,
  ) => {
    setText(e.detail.value);
    updateTextAreaHeight();
  };

  const headerActions = (
    <SpaceBetween direction="horizontal" size="xs">
      <Button iconName="edit">Edit</Button>
      <Button iconName="remove">Delete</Button>
    </SpaceBetween>
  );

  return (
    <Container
      header={
        <Header
          actions={headerActions}
          variant="h2"
          description="Please input your text"
        >
          {assistant.name}
        </Header>
      }
    >
      <div ref={containerRef}>
        <SpaceBetween size="m" direction="vertical">
          <Textarea value={historyText} rows={10} disabled />
          <Textarea value={text} onChange={onValueChange} rows={1} autoFocus />
          <Box textAlign="right">
            <Button variant="primary">Submit</Button>
          </Box>
        </SpaceBetween>
      </div>
    </Container>
  );
};

export default Chat;
