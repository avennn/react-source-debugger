import util from 'node:util';
import { exec as execLegacy } from 'node:child_process';
import { version } from '../package.json';

const exec = util.promisify(execLegacy);

const ver = `v${version}`;
await exec(`git tag -a ${ver} -m "release ${ver}"`);
console.log(`Taged with ${ver}.\n`);
await exec('git push origin --tags');
