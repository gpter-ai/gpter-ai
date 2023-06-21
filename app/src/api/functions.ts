import { ChatCompletionFunctions } from 'openai';

type GetCurrencyConversionArgs = {
  base?: string;
};

type AvailableFunction = typeof getCurrencyConversion;

const getCurrencyConversion = async ({
  base = 'EUR',
}: GetCurrencyConversionArgs): Promise<object> => {
  const response = await fetch(
    `https://api.exchangerate.host/latest?base=${base}`,
  );
  const responseData = await response.json();

  return responseData;
};

export const functions: ChatCompletionFunctions[] = [
  {
    name: 'getCurrencyConversion',
    description: 'Get the actual currency conversion rates',
    parameters: {
      type: 'object',
      properties: {
        base: {
          type: 'string',
          description:
            'Three-letter currency code of your preferred base currency.',
          default: 'EUR',
        },
      },
    },
  },
];

export const functionMap = new Map<string, AvailableFunction>([
  ['getCurrencyConversion', getCurrencyConversion],
]);
