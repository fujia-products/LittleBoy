import {
  BrowserWindow,
  ipcMain,
  app,
  BrowserWindowConstructorOptions,
} from 'electron';

type AppGetPathName =
  | 'home'
  | 'appData'
  | 'userData'
  | 'sessionData'
  | 'temp'
  | 'exe'
  | 'module'
  | 'desktop'
  | 'documents'
  | 'downloads'
  | 'music'
  | 'pictures'
  | 'videos'
  | 'recent'
  | 'logs'
  | 'crashDumps';

export class CommonWindowEvent {
  private static getWin(event: any) {
    return BrowserWindow.fromWebContents(event.sender);
  }

  static listen() {
    ipcMain.handle('minimizeWindow', (e) => {
      this.getWin(e)?.minimize();
    });

    ipcMain.handle('maximizeWindow', (e) => {
      this.getWin(e)?.maximize();
    });

    ipcMain.handle('unmaximizeWindow', (e) => {
      this.getWin(e)?.unmaximize();
    });

    ipcMain.handle('hideWindow', (e) => {
      this.getWin(e)?.hide();
    });

    ipcMain.handle('showWindow', (e) => {
      this.getWin(e)?.show();
    });

    ipcMain.handle('closeWindow', (e) => {
      this.getWin(e)?.close();
    });

    ipcMain.handle('resizable', (e) => {
      return this.getWin(e)?.isResizable();
    });

    ipcMain.handle('getPath', (e, name: AppGetPathName) => {
      return app.getPath(name);
    });
  }

  /**
   * NOTE: The handler for common events in main process.
   */
  static registerWinEvent(win: BrowserWindow) {
    win.on('maximize', () => {
      win.webContents.send('windowMaximized');
    });

    win.on('unmaximize', () => {
      win.webContents.send('windowUnmaximized');
    });

    win.webContents.setWindowOpenHandler((params) => {
      const winBaseConfig: BrowserWindowConstructorOptions & {
        [index: string]: any;
        webPreferences: {
          [index: string]: any;
        };
      } = {
        frame: false,
        show: true,
        webPreferences: {
          nodeIntegration: true,
          webSecurity: false,
          allowRunningInsecureContent: true,
          contextIsolation: false,
          webviewTag: true,
          spellcheck: false,
          disableHtmlFullscreenWindowResize: true,
        },
      };

      // custom window configurations
      const features = JSON.parse(params.features);

      for (const p in features) {
        if (p === 'webPreferences') {
          for (let p2 in features.webPreferences) {
            winBaseConfig.webPreferences[p2] = features.webPreferences[p2];
          }
        } else {
          winBaseConfig[p] = features[p];
        }
      }

      if (winBaseConfig['modal'] === true) {
        winBaseConfig.parent = win;
      }

      return {
        action: 'allow',
        overrideBrowserWindowOptions: winBaseConfig,
      };
    });
  }
}
