import UAParser from 'ua-parser-js';
import { SupportedAgents } from './types';

const browserName = new UAParser().getResult().browser.name;

export const getUserAgent = (): SupportedAgents => {
  if (!browserName || browserName.toLowerCase() !== SupportedAgents.Electron) {
    return SupportedAgents.Browser;
  }

  return SupportedAgents.Electron;
};
