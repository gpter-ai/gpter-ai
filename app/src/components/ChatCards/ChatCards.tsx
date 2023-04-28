import {
  Box,
  Container,
  SpaceBetween,
  Spinner,
} from '@cloudscape-design/components';
import React, { FC, useEffect, useRef } from 'react';
import { ChatMessage } from '../types';

// @TODO - if we have more custom styles - think about using styled-components
import './ChatCards.scss';

type Props = {
  messages: ChatMessage[];
  loading: boolean;
  historyStartTs: number;
  // sessionTimestamp?: number;
};

type ChatCardProps = Pick<ChatMessage, 'role' | 'content'>;

const ChatCard: FC<ChatCardProps> = ({ role, content }) => {
  const textAlign = role === 'user' ? 'left' : 'right';
  const fontColor = role === 'user' ? 'text-status-error' : 'text-status-info';

  const messagePrefix = role === 'user' ? 'You | ' : '';
  const messageSuffix = role === 'user' ? '' : ' | Assistant';

  return (
    <Container>
      <Box textAlign={textAlign} color={fontColor} fontWeight="bold">
        <Box
          variant="span"
          color="text-label"
          fontSize="heading-s"
          fontWeight="heavy"
        >
          {messagePrefix}
        </Box>
        {content}
        <Box
          variant="span"
          color="text-label"
          fontSize="heading-s"
          fontWeight="heavy"
        >
          {messageSuffix}
        </Box>
      </Box>
    </Container>
  );
};

const ChatCards: FC<Props> = ({ messages, loading, historyStartTs }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    ref.current.scrollTop = ref.current.scrollHeight;
  }, [messages.length]);

  if (messages.length === 0) {
    return loading ? (
      <div className="chat-cards" ref={ref}>
        <Box textAlign="center">
          <Spinner size="large" />;
        </Box>
      </div>
    ) : (
      <div className="chat-cards" ref={ref}>
        <Box textAlign="center">
          <b>Your chat history is empty.</b>
        </Box>
      </div>
    );
  }

  const messagesOutsideSession = messages.filter(
    (message) => message.timestamp < historyStartTs,
  );

  const messagesInSession = messages.filter(
    (message) => message.timestamp >= historyStartTs,
  );

  return (
    <div className="chat-cards" ref={ref}>
      <Box
        padding={{ left: 'm', right: 'm' }}
        margin={{ top: 'm', bottom: 'm' }}
      >
        <SpaceBetween size="l">
          {messagesOutsideSession.map((message) => (
            <ChatCard
              key={message.timestamp}
              role={message.role}
              content={message.content}
            />
          ))}
        </SpaceBetween>
        {messagesOutsideSession.length > 0 && (
          <Box
            margin={{ top: 'm', bottom: 'm' }}
            fontWeight="bold"
            fontSize="heading-m"
          >
            ~~~~~~ Current Session ~~~~~~
          </Box>
        )}
        <SpaceBetween size="l">
          {messagesInSession.map((message) => (
            <ChatCard
              key={message.timestamp}
              role={message.role}
              content={message.content}
            />
          ))}
        </SpaceBetween>
      </Box>
    </div>
  );
};

export default ChatCards;
