import { Box, Icon } from '@cloudscape-design/components';
import hljs from 'highlight.js';
import 'highlight.js/styles/base16/railscasts.css';
import { CODE_BLOCK_DELIMITER, FIRST_WORD_REGEX } from '@/components/constants';

export const withCodeHighlighting = (message: string): JSX.Element => {
  const chunks = message.split(CODE_BLOCK_DELIMITER);

  return (
    <>
      {chunks.map((chunk, index) => {
        const languageMatch = chunk.match(FIRST_WORD_REGEX);

        if (index % 2 === 0) {
          return (
            <pre key={chunk} className="chat-message__text">
              {chunk.trim()}
            </pre>
          );
        }

        const code = chunk.replace(FIRST_WORD_REGEX, '').trim();

        const highlightResult = languageMatch
          ? hljs.highlight(code, {
              language: languageMatch[0],
            })
          : hljs.highlightAuto(code);

        const language = highlightResult.language ?? 'auto';
        const html = highlightResult.value;

        return (
          <pre key={chunk}>
            <div className="chat-message__code-language">
              <span>Language: {language}</span>
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
              className={`chat-message__code hljs language-${language}`}
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </pre>
        );
      })}
    </>
  );
};

// export const withCodeHighlightingSmart = (message: string): JSX.Element => {
//   const groups = message.split(CODE_REGEX).map((element) => element.trim());

//   return (
//     <>
//       {groups.map((group, index) => {
//         if (index % 2 === 0) {
//           return (
//             <pre key={group} className="chat-message__text">
//               {group}
//             </pre>
//           );
//         }

//         const langCode = group
//           .split(CODE_LANGUAGE_REGEX)
//           .map((element) => element.trim());

//         const codeHtml = hljs.highlight(langCode[1], {
//           language: langCode[0],
//         }).value;

//         return (
//           <pre key={group}>
//             <div className="chat-message__code-language">
//               <span>Language: {langCode[0]}</span>
//               <button
//                 className="chat-message__code-copy"
//                 type="button"
//                 onClick={() => navigator.clipboard.writeText(langCode[1])}
//               >
//                 <Box variant="span" color="inherit" margin={{ right: 'xs' }}>
//                   <Icon name="copy" />
//                 </Box>
//                 Copy code
//               </button>
//             </div>
//             <code
//               className={`chat-message__code hljs language-${langCode[0]}`}
//               // eslint-disable-next-line react/no-danger
//               dangerouslySetInnerHTML={{ __html: codeHtml }}
//             />
//           </pre>
//         );
//       })}
//     </>
//   );
// };
