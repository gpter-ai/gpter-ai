import React, { CSSProperties } from 'react';
import { Box, Container, SpaceBetween } from '@cloudscape-design/components';
import { ChatMessage } from '@/components/types';
import './MessageItem.scss';
import { withCodeHighlighting } from './utils/decorators';

interface Props {
  message: ChatMessage;
}

export const MessageItem: React.FC<Props> = ({ message }) => {
  const { role, content } = message;

  const alignRight = role !== 'user';
  const header = role === 'user' ? 'You' : 'Assistant';
  const fontColor = role === 'user' ? 'inherit' : 'text-status-info';
  const alignRightStyle: CSSProperties = alignRight ? { float: 'right' } : {};

  return (
    <div className="messageItemContent" style={alignRightStyle}>
      <Container
        header={
          <SpaceBetween size="m" direction="horizontal">
            <Box fontWeight="bold" color={fontColor}>
              {header}
            </Box>
            <Box color="text-status-inactive">
              {new Date(message.timestamp).toLocaleString()}
            </Box>
          </SpaceBetween>
        }
      >
        {withCodeHighlighting(content)}
      </Container>
    </div>
  );
};
