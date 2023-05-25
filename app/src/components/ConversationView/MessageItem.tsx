import React from 'react';
import {
  Box,
  BoxProps,
  Container,
  Icon,
  SpaceBetween,
} from '@cloudscape-design/components';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';
import { CodeComponent } from 'react-markdown/lib/ast-to-react';
import hljs from 'highlight.js';
import 'highlight.js/styles/base16/railscasts.css';
import { ChatMessage } from '@/components/types';
import './MessageItem.scss';
import { ChatGptRole } from '@/data/types';

const CodeHighlight: CodeComponent = (props) => {
  const { className, children, inline } = props;

  if (inline) return <span className="inline-code">{children}</span>;

  console.log({ className, children, inline });

  const languageFromClassName = /language-(\w+)/.exec(className || '');
  const highlight = hljs.highlightAuto(String(children));

  const language = languageFromClassName
    ? languageFromClassName[1]
    : highlight.language;

  const code = highlight.value;

  return (
    <pre>
      <div className="chat-message__code-language">
        <span>Language{language ? `: ${language}` : ' unknown'}</span>
        <button
          className="chat-message__code-copy"
          type="button"
          onClick={() => navigator.clipboard.writeText(code)}
        >
          <Box variant="span" color="inherit" margin={{ right: 'xs' }}>
            <Icon name="copy" />
          </Box>
          Copy code
        </button>
      </div>
      <code
        className={`chat-message__code hljs language-${language ?? 'auto'}}`}
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: code,
        }}
      />
    </pre>
  );
};

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
        <ReactMarkdown
          components={{
            code: CodeHighlight,
          }}
        >
          {content}
        </ReactMarkdown>
      </Container>
    </div>
  );
};
