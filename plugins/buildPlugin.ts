import path from 'path';
import fs from 'fs';
import fse from 'fs-extra';
import { CliOptions } from 'electron-builder';

export const buildPlugin = () => {
  return {
    name: 'build-plugin',
    closeBundle: () => {
      const buildObj = new BuildObj();

      buildObj.buildMain();
      buildObj.prepareSqlite();
      buildObj.prepareKnexJs();
      buildObj.preparePackageJson();
      buildObj.buildInstaller();
    },
  };
};

class BuildObj {
  cwd: string;
  constructor() {
    this.cwd = process.cwd();
  }

  async prepareSqlite() {
    // NOTE: to copy better-sqlite3
    const srcDir = path.join(this.cwd, 'node_modules/better-sqlite3');
    const destDir = path.join(this.cwd, 'dist/node_modules/better-sqlite3');

    fse.ensureDirSync(destDir);
    fse.copySync(srcDir, destDir, {
      filter: (src, dest) => {
        if (
          src.endsWith('better-sqlite3') ||
          src.endsWith('build') ||
          src.endsWith('Release') ||
          src.endsWith('better_sqlite3.node')
        ) {
          return true;
        } else if (src.includes('node_modules\\better-sqlite3\\lib')) {
          return true;
        }

        return false;
      },
    });

    let pkgJson = `
      {
        "name": "better-sqlite3",
        "main": "lib/index.js"
      }
    `;
    let pkgJsonPath = path.join(
      this.cwd,
      'dist/node_modules/better-sqlite3/package.json'
    );
    fse.writeFileSync(pkgJsonPath, pkgJson);

    // NOTE: to make "bindings" module
    const bindingPath = path.join(
      this.cwd,
      'dist/node_modules/bindings/index.js'
    );

    fse.ensureFileSync(bindingPath);
    const bindingsContent = `
      module.exports = () => {
        const addonPath = require("path").join(__dirname, '../better-sqlite3/build/Release/better_sqlite3.node');
        return require(addonPath);
      };
    `;
    fse.writeFileSync(bindingPath, bindingsContent);

    pkgJson = `{"name": "bindings","main": "index.js"}`;
    pkgJsonPath = path.join(
      this.cwd,
      'dist/node_modules/bindings/package.json'
    );
    fse.writeFileSync(pkgJsonPath, pkgJson);
  }

  prepareKnexJs() {
    const knexPath = path.join(this.cwd, 'dist/node_modules/knex');

    fse.ensureDirSync(knexPath);

    require('esbuild').buildSync({
      entryPoints: ['./node_modules/knex/knex.js'],
      bundle: true,
      platform: 'node',
      format: 'cjs',
      minify: true,
      outfile: './dist/node_modules/knex/index.js',
      external: [
        'oracledb',
        'pg-query-stream',
        'pg',
        'sqlite3',
        'tedious',
        'mysql',
        'mysql2',
        'better-sqlite3',
      ],
    });

    const pkgJson = `{
      "name": "bindings",
      "main": "index.js"
    }`;
    const pkgJsonPath = path.join(
      this.cwd,
      'dist/node_modules/knex/package.json'
    );
    fse.writeFileSync(pkgJsonPath, pkgJson);
  }

  /**
   * NOTE: build main process
   *
   * The vite will clear dist folder before compiling, so we need to compile
   * main process code again.
   */
  buildMain() {
    require('esbuild').buildSync({
      entryPoints: ['./src/main/mainEntry.ts'],
      bundle: true,
      platform: 'node',
      minify: true,
      outfile: './dist/mainEntry.js',
      external: ['electron'],
    });
  }

  /**
   * NOTE: In fact, when we launch the app, electron will launch a node.js project.
   */
  preparePackageJson() {
    const pkgJsonPath = path.join(this.cwd, 'package.json');
    const localPkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf-8'));
    const electronConfig = localPkgJson.devDependencies.electron.replace(
      '^',
      ''
    );
    localPkgJson.main = 'mainEntry.js';
    delete localPkgJson.scripts;
    delete localPkgJson.devDependencies;

    localPkgJson.devDependencies = {
      electron: electronConfig,
    };

    /**
     * NOTE: Don't care the version
     * 1. If added below configs, the electron-builder will not automatically install these modules.
     */
    localPkgJson.dependencies['better-sqlite3'] = '*';
    localPkgJson.dependencies['bindings'] = '*';

    const tarJsonPath = path.join(this.cwd, 'dist', 'package.json');
    fs.writeFileSync(tarJsonPath, JSON.stringify(localPkgJson));
    fs.mkdirSync(path.join(this.cwd, 'dist/node_modules'));
  }

  // To build install package by electron-builder
  buildInstaller() {
    const options: CliOptions = {
      config: {
        directories: {
          output: path.join(this.cwd, 'release'),
          app: path.join(this.cwd, 'dist'),
        },
        extraResources: [
          {
            from: './src/common/db.db',
            to: './',
          },
        ],
        files: ['**'],
        extends: null,
        productName: 'LittleBoy',
        appId: 'site.fujia.littleboy',
        asar: true,
        nsis: {
          oneClick: true,
          perMachine: true,
          allowToChangeInstallationDirectory: false,
          createDesktopShortcut: true,
          createStartMenuShortcut: true,
          shortcutName: 'LittleBoy',
        },
        dmg: {
          background: '',
          icon: '',
          iconSize: 80,
          sign: false,
          contents: [
            {
              x: 380,
              y: 280,
              type: 'link',
              path: '/Applications',
            },
            {
              x: 110,
              y: 280,
              type: 'file',
            },
          ],
        },
        deb: {},
        publish: [
          {
            provider: 'generic',
            url: 'http://localhost:5500/',
          },
        ],
      },
      projectDir: this.cwd,
    };

    return require('electron-builder').build(options);
  }
}
