import { app, BrowserWindow, BrowserWindowConstructorOptions } from 'electron';

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

  mainWindow.loadURL(process.argv[2]);
});
