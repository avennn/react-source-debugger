import util from 'node:util';
import { exec as execLegacy } from 'node:child_process';
import shell from 'shelljs';

const exec = util.promisify(execLegacy);

export async function checkout({ dir, ref }) {
  shell.cd(dir);
  await exec(`git checkout ${ref}`);
}
