import knex, { Knex } from 'knex';
import fs from 'fs';
import path from 'path';

let dbInstance: Knex;
console.log('process.execPath', process.execPath);

// @ts-ignore-next-line
if (!dbInstance) {
  console.log('dbInstance', dbInstance);
  let dbPath;

  if (location.href.startsWith('http')) {
    dbPath = path.join(process.execPath, '../../../../src/common/db.db');
  } else {
    dbPath = path.join(process.execPath, '../../../../src/common/db.db');
    process.env.APP_DATA_PATH ||
      (process.platform === 'darwin'
        ? process.env.HOME + '/Library/Application Support'
        : process.env.HOME + '/.local/share');
    dbPath = path.join(dbPath, 'LittleBoy/db.db');

    let dbIsExist = fs.existsSync(dbPath);

    console.log('process.execPath', process.execPath);

    if (!dbIsExist) {
      const resourceDBPath = path.join(process.execPath, '../resources/db.db');

      fs.copyFileSync(resourceDBPath, dbPath);
    }
  }

  dbInstance = knex({
    client: 'better-sqlite3',
    connection: {
      filename: dbPath,
    },
    useNullAsDefault: true,
  });
}

export const db = dbInstance;
