import UAParser from 'ua-parser-js';
import { SupportedAgents } from './types';

const result = new UAParser().getResult();

const getUserAgent = (): SupportedAgents => {
  const browserName = result.browser.name;

  if (!browserName || browserName.toLowerCase() !== SupportedAgents.Electron) {
    return SupportedAgents.Browser;
  }

  return SupportedAgents.Electron;
};

export const isElectron = (): boolean => {
  return getUserAgent() === SupportedAgents.Electron;
};

export const isBrowser = (): boolean => {
  return !isElectron();
};
