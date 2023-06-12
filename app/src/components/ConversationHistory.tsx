import { FC, memo } from 'react';
import { Box, SpaceBetween } from '@cloudscape-design/components';
import { ConversationViewItem } from './ConversationView/ConversationViewItem';
import { ChatItem } from './ConversationView/types';

type Props = {
  history: ChatItem[];
};

export const ConversationHistory: FC<Props> = memo(
  ({ history }) => {
    return (
      <SpaceBetween size="m">
        {history.length === 0 && (
          <Box color="text-status-inactive" textAlign="center">
            No messages yet
          </Box>
        )}
        {history.map((content, idx) => (
          <ConversationViewItem key={idx} content={content} />
        ))}
      </SpaceBetween>
    );
  },
  (prevProps, nextProps) =>
    prevProps.history.length === nextProps.history.length,
);
