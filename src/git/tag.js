import util from 'node:util';
import { exec as execLegacy } from 'node:child_process';
import { cd, uncd } from '../shell/index.js';

const exec = util.promisify(execLegacy);

export async function listTags({ dir }) {
  cd(dir);
  const { stdout } = await exec('git tag --list');
  uncd();
  return stdout
    .split(/\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}
