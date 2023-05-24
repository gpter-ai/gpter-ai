import React from 'react';
import {
  Box,
  BoxProps,
  Container,
  SpaceBetween,
} from '@cloudscape-design/components';
import { ChatMessage } from '@/components/types';
import './MessageItem.scss';
import { withCodeHighlighting } from './utils/decorators';
import { ChatGptRole } from '@/data/types';

interface Props {
  message: ChatMessage;
}

export const MessageItem: React.FC<Props> = ({ message }) => {
  const { role, content } = message;

  const roleToHeader = {
    user: 'You',
    assistant: 'Assistant',
    system: 'Prompt',
  };

  const roleToColor: Record<ChatGptRole, BoxProps.Color> = {
    user: 'inherit',
    assistant: 'text-status-info',
    system: 'text-status-success',
  };

  return (
    <div className={`message-item__content--${role}`}>
      <Container
        header={
          <SpaceBetween size="m" direction="horizontal">
            <Box fontWeight="bold" color={roleToColor[role]}>
              {roleToHeader[role]}
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
