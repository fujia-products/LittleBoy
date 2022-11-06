import path from 'path';
import fs from 'fs';

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
  // build main process
  buildMain() {
    require('esbuild').buildSync({
      entryPoints: ['./src/main/mainEntry.ts'],
      bundle: true,
      platform: 'node',
      minify: true,
      outfile: './dist/mainEntry.js',
      external: 'electron',
    });
  }

  preparePackageJson() {
    const pkgJsonPath = path.join(this.cwd, 'package.json');
    const localPkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf-8'));
    const electronConfig = localPkgJson.devDependencies.electron.replace(
      '^',
      ''
    );
    localPkgJson.main = 'mainEntry.js';
  }

  buildInstaller() {}
}
