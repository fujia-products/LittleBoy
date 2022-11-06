import { app, BrowserWindow, BrowserWindowConstructorOptions } from 'electron';
import { CustomScheme } from './CustomScheme';

/**
 * NOTE: It'll don't display any warnings in render process devtool console if the value is true.
 */
process.env.ELECTRON_DISABLE_SECURITY_WARNING = 'true';

let mainWindow: BrowserWindow;

app.whenReady().then(() => {
  const config: BrowserWindowConstructorOptions = {
    webPreferences: {
      /**
       * NOTE: If the app never import third party package, it doesn't consider the security issues.
       */
      nodeIntegration: true,
      webSecurity: false,
      allowRunningInsecureContent: true,
      contextIsolation: false,
      webviewTag: true,
      spellcheck: false,
      disableHtmlFullscreenWindowResize: true,
    },
  };
  mainWindow = new BrowserWindow(config);
  mainWindow.webContents.openDevTools({ mode: 'undocked' });

  /**
   * NOTE: Distinguishing different environments
   *
   * If the param of process.argv[2] is existed, we think it's development env, otherwise is production env.
   */
  if (process.argv[2]) {
    mainWindow.loadURL(process.argv[2]);
  } else {
    CustomScheme.registerSchema();
    mainWindow.loadURL(`app://index.html`);
  }
});
