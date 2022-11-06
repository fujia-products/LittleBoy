import path from 'path';
import fs from 'fs';
import { CliOptions } from 'electron-builder';

export const buildPlugin = () => {
  return {
    name: 'build-plugin',
    closeBundle: () => {
      const buildObj = new BuildObj();

      buildObj.buildMain();
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
