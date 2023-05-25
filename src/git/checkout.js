import util from 'node:util';
import { exec as execLegacy } from 'node:child_process';
import { cd, uncd } from '../shell/index.js';

const exec = util.promisify(execLegacy);

export async function checkout({ dir, ref }) {
  cd(dir);
  await exec(`git checkout ${ref}`);
  uncd(dir);
}
