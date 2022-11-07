import { BrowserWindow, ipcMain, app } from 'electron';

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

  static registerWinEvent(win: BrowserWindow) {
    win.on('maximize', () => {
      win.webContents.send('windowMaximized');
    });

    win.on('unmaximize', () => {
      win.webContents.send('windowUnmaximized');
    });
  }
}
