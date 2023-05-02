import React, { CSSProperties } from 'react';
import { Box, Container } from '@cloudscape-design/components';
import { ChatMessage } from '@/components/types';
import './MessageItem.scss';

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
          <Box fontWeight="bold" color={fontColor}>
            {header}
          </Box>
        }
      >
        <Box>{content}</Box>
      </Container>
    </div>
  );
};
