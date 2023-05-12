import { Box, Icon } from '@cloudscape-design/components';
import hljs from 'highlight.js';
import 'highlight.js/styles/base16/railscasts.css';
import { CODE_BLOCK_DELIMITER, FIRST_WORD_REGEX } from '@/components/constants';

export const withCodeHighlighting = (message: string): JSX.Element => {
  const chunks = message.split(CODE_BLOCK_DELIMITER);

  return (
    <>
      {chunks.map((chunk, index) => {
        const language = chunk.match(FIRST_WORD_REGEX);

        if (index % 2 === 0 || !language) {
          return chunk;
        }

        const code = chunk.replace(FIRST_WORD_REGEX, '').slice(1);

        const codeHtml = hljs.highlight(code, {
          language: language[0],
        }).value;

        return (
          <pre key={chunk}>
            <div className="chat-message__code-language">
              <span>Language: {language[0]}</span>
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
              className={`chat-message__code hljs language-${language[0]}`}
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{ __html: codeHtml }}
            />
          </pre>
        );
      })}
    </>
  );
};
