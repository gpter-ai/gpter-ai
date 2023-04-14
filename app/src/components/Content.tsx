import * as React from 'react';
import { useState } from 'react';
import ContentLayout from '@cloudscape-design/components/content-layout';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Textarea from '@cloudscape-design/components/textarea';
import { Box, Button, NonCancelableCustomEvent } from '@cloudscape-design/components';
import { InputProps } from '@cloudscape-design/components/input/interfaces';
import { useAutoGrowTextArea } from '@/hooks/useAutoGrowTextArea';

export function Content() {
  const [text, setText] = useState('');
  const {
    containerRef,
    updateTextAreaHeight,
  } = useAutoGrowTextArea();

  const onValueChange = (e: NonCancelableCustomEvent<InputProps.ChangeDetail>) => {
    setText(e.detail.value);
    updateTextAreaHeight();
  };

  return (
    <ContentLayout
      header={(
        <SpaceBetween size="m">
          <Header variant="h1">GTPer</Header>
        </SpaceBetween>
            )}
    >
      <Container
        header={(
          <Header variant="h2" description="Please input your text">
            Generic assistant
          </Header>
                )}
      >
        <div ref={containerRef}>
          <SpaceBetween size="m" direction="vertical">
            <Textarea value={text} onChange={onValueChange} rows={1} autoFocus />
            <Box textAlign="right">
              <Button variant="primary">Submit</Button>
            </Box>
          </SpaceBetween>
        </div>
      </Container>
    </ContentLayout>
  );
}
