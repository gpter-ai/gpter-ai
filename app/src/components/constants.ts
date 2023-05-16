export const OPENAI_API_KEY_PATTERN = /sk-\w{40,50}/;

export const MAX_MESSAGES_PER_CHAT_PAGE = 5;

export const CODE_BLOCK_DELIMITER = '\n```';

export const FIRST_WORD_REGEX = /^([\w-]+)/;

// if you want to have following groups after split: text -> lang -> code ...
// this doesn't work with formatted messages though due to line breaks
// export const CODE_LANGUAGE_REGEX = /```(?<language>[^\\ ]+)(?<code>.*?)```/;
