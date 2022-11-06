import { BrowserWindow, ipcMain, app } from 'electron';

export class CommonWindowEvent {
  private static getWin(event: any) {
    return BrowserWindow.fromWebContents(event.sender);
  }

  static listen() {}
}
