import { protocol, Privileges } from 'electron';
import fs from 'fs';
import path from 'path';

// To provide privileges for custom app protocol
const schemeConfig: Privileges = {
  standard: true,
  supportFetchAPI: true,
  bypassCSP: true,
  corsEnabled: true,
  stream: true,
};
protocol.registerSchemesAsPrivileged([
  {
    scheme: 'app',
    privileges: schemeConfig,
  },
]);

export class CustomScheme {
  private static getMimeType(extension: string) {
    let mimeType = '';

    if (extension === '.js') {
      mimeType = 'text/javascript';
    } else if (extension === '.html') {
      mimeType = 'text/html';
    } else if (extension === '.css') {
      mimeType = 'text/css';
    } else if (extension === '.svg') {
      mimeType = 'image/svg+xml';
    } else if (extension === '.json') {
      mimeType = 'application/json';
    }
    return mimeType;
  }

  // To register custom app protocol
  static registerSchema() {
    protocol.registerStreamProtocol('app', (request, callback) => {
      let pathName = new URL(request.url).pathname;
      let extension = path.extname(pathName).toLowerCase();
      if (extension === '') {
        pathName = 'index.html';
        extension = '.html';
      }

      const tarFile = path.join(__dirname, pathName);
      callback({
        statusCode: 200,
        headers: {
          'content-type': this.getMimeType(extension),
        },
        data: fs.createReadStream(tarFile),
      });
    });
  }
}
