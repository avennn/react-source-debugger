import fsLegacy from 'node:fs';
import fs from 'node:fs/promises';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { safeJsonParse } = require('tori');

export function isFileOrDirExisted(path) {
  try {
    fsLegacy.accessSync(path);
    return true;
  } catch {
    return false;
  }
}

export async function readFileAsJson(path) {
  const str = await fs.readFile(path, { encoding: 'utf-8' });
  return safeJsonParse(str, {});
}

export async function writeFileAsJson(path, obj) {
  await fs.writeFile(path, JSON.stringify(obj, null, 2));
}

export async function replaceFileContent(path, fn) {
  const content = await fs.readFile(path, { encoding: 'utf-8' });
  const newContent = fn(content);
  await fs.writeFile(path, newContent);
}
