import { dialog } from 'electron';
import { autoUpdater } from 'electron-updater';

export class Updater {
  static check() {
    autoUpdater.checkForUpdates();

    autoUpdater.on('update-downloaded', async () => {
      await dialog.showMessageBox({
        message: '有可用的版本升级',
      });

      autoUpdater.quitAndInstall();
    });
  }
}
