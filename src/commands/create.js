import path from 'node:path';
import shell from 'shelljs';
import { isFileOrDirExisted } from '../file.js';
import { projectRoot } from '../constants.js';
import hint from '../hint.js';

export default function create(projectName) {
  try {
    const dir = path.join(process.cwd(), projectName);
    if (isFileOrDirExisted(dir)) {
      throw new Error(`Already has a directory or file named ${projectName}`);
    }
    shell.mkdir('-p', projectName);
    shell.cp(path.join(projectRoot, './templates/rsd.config.js'), dir);
  } catch (e) {
    hint.error(e);
    process.exit(1);
  }
}
