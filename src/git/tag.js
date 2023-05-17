import util from 'node:util';
import { exec as execLegacy } from 'node:child_process';
import shell from 'shelljs';

const exec = util.promisify(execLegacy);

export async function listTags({ dir }) {
  shell.cd(dir);
  const { stdout } = await exec('git tag --list');
  return stdout
    .split(/\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}
