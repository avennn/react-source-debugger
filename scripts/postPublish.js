import util from 'node:util';
import { createRequire } from 'node:module';
import { exec as execLegacy } from 'node:child_process';

const exec = util.promisify(execLegacy);
const require = createRequire(import.meta.url);
const { version } = require('../package.json');

const ver = `v${version}`;
console.log(await exec(`git tag -a ${ver} -m "release ${ver}"`));
console.log(await exec('git push origin --tags'));
