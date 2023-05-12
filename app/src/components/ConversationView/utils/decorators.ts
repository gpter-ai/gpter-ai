import hljs from 'highlight.js';
import 'highlight.js/styles/base16/railscasts.css';
import { CODE_BLOCK_DELIMITER, FIRST_WORD_REGEX } from '@/components/constants';

export const withCodeHighlighting = (message: string): string => {
  const chunks = message.split(CODE_BLOCK_DELIMITER);

  return chunks
    .map((chunk, index) => {
      const language = chunk.match(FIRST_WORD_REGEX);

      if (index % 2 === 0 || !language) {
        return chunk;
      }

      return `
          <pre>
            <code class="hljs language-${language[0]}">
              ${
                hljs.highlight(chunk.replace(FIRST_WORD_REGEX, ''), {
                  language: language[0],
                }).value
              }
            </code>
          </pre>
      `;
    })
    .join('');
};
