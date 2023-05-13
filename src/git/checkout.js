import util from 'node:util';
import { exec as execLegacy } from 'node:child_process';
import { cd } from '../shell/index.js';

const exec = util.promisify(execLegacy);

export default async function checkout({ dir, ref }) {
  const uncd = cd(dir);
  await exec(`git checkout ${ref}`);
  uncd();
}
