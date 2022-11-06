import { ViteDevServer } from 'vite';

export const devPlugin = () => {
  return {
    name: 'dev-plugin',
    configureServer(server: ViteDevServer) {
      require('esbuild').buildSync({
        entryPoints: ['./src/main/mainEntry.ts'],
        bundle: true,
        platform: 'node',
        outfile: './dist/mainEntry.js',
        external: ['electron'],
      });

      server.httpServer.once('listening', () => {
        const { spawn } = require('child_process');

        const addressInfo = server.httpServer.address();

        if (addressInfo && typeof addressInfo !== 'string') {
          const httpAddress = `http://${addressInfo.address}:${addressInfo.port}`;

          const electronProcess = spawn(
            require('electron').toString(),
            ['./dist/mainEntry.js', httpAddress],
            {
              cwd: process.cwd(),
              stdio: 'inherit',
            }
          );

          electronProcess.on('close', () => {
            server.close();
            process.exit();
          });
        }
      });
    },
  };
};

export const getReplacer = () => {
  /**
   * NOTE: We can import the follow modules of node.js in the render process.
   */
  const externalModels = [
    'os',
    'fs',
    'events',
    'child_process',
    'crypto',
    'http',
    'buffer',
    'url',
    'better-sqlite3',
    'knex',
  ];
  const result = {};

  for (let item of externalModels) {
    result[item] = () => ({
      find: new RegExp(`^${item}$`),
      code: `const ${item} = require('${item}');export { ${item} as default }`,
    });
  }

  result['electron'] = () => {
    const electronModules = [
      'clipboard',
      'ipcRenderer',
      'nativeImage',
      'shell',
      'webFrame',
    ].join(',');

    return {
      find: new RegExp('^electron$'),
      code: `const {${electronModules}} = require('electron');export {${electronModules}}`,
    };
  };

  return result;
};
