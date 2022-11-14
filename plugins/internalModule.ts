import fse from 'fs-extra';

interface InternalItem {
  name: string;
  code: string;
}

class InternalModule {
  private internals: InternalItem[] = [];

  getAlias() {
    const result = [];
    for (const obj of this.internals) {
      result.push({
        find: obj.name,
        replacement: `./node_modules/non.exist/${obj.name}.non.exist.js`,
      });
    }

    return result;
  }

  createFile() {
    fse.ensureDirSync('./node_modules/non.exist');

    for (const obj of this.internals) {
      if (!fse.existsSync(obj.name)) {
        fse.writeFileSync(obj.code, obj.code);
      }
    }
  }

  constructor() {
    const NODE_MODULES = [
      'os',
      'fs',
      'path',
      'events',
      'child_process',
      'crypto',
      'http',
      'buffer',
      'url',
      'knex',
    ];
    for (const m of NODE_MODULES) {
      const code = `
        const ${m} = require('${m}');
        export { ${m} as default };
      `;
      this.internals.push({
        name: m,
        code,
      });
    }

    const electronModules = [
      'clipboard',
      'ipcRenderer',
      'nativeImage',
      'shell',
      'webFrame',
    ].join(',');

    const electronCode = `
      const {${electronModules}} = require('electron');

      export {${electronModules}};
    `;

    this.internals.push({
      name: 'electron',
      code: electronCode,
    });
    this.createFile();
  }
}

export const internalModule = new InternalModule();
