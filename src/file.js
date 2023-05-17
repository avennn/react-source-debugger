import fs from 'node:fs';

export function isFileOrDirExisted(path) {
  try {
    fs.accessSync(path);
    return true;
  } catch (e) {
    return false;
  }
}
