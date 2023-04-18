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

const Chat = () => {
  const [text, setText] = useState('');
  const { containerRef, updateTextAreaHeight } = useAutoGrowTextArea();

  const dataProvider = useDataProvider();

  const queries = dataProvider.getQueriesByAssistant(
    '6137a621-f3dc-410d-bb7f-6f8fa14fea27',
  );

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

  return (
    <Container
      header={
        <Header variant="h2" description="Please input your text">
          Generic assistant
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
