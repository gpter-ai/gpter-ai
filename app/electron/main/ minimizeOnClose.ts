import { UserConfig } from '@/data/types';

export const enableMinimizeOnClose = (
  app: Electron.CrossProcessExports.App,
  window: Electron.CrossProcessExports.BrowserWindow,
): void => {
  let isQuitting = false;

  const registerEventHandlers = (): void => {
    window.on('close', (e) => {
      app.on('before-quit', () => {
        isQuitting = true;
      });
      if (isQuitting) return undefined;

      e.preventDefault();
      window.minimize();
      return true;
    });
  };

  window.webContents.on('did-finish-load', () => {
    window.webContents
      .executeJavaScript('window.getUserConfig()')
      .then((userConfig: UserConfig) => {
        if (userConfig.minimizeOnClose) {
          registerEventHandlers();
        }
      });
  });
};
