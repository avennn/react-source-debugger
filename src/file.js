import fs from 'node:fs';
import promiseFs from 'node:fs/promises';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { safeJsonParse } = require('tori');

export function isFileOrDirExisted(path) {
  try {
    fs.accessSync(path);
    return true;
  } catch {
    return false;
  }
}

export async function readFileAsJson(path) {
  const str = await promiseFs.readFile(path, { encoding: 'utf-8' });
  return safeJsonParse(str, {});
}

export async function writeFileAsJson(path, obj) {
  await promiseFs.writeFile(path, JSON.stringify(obj, null, 2));
}
