import path from 'node:path';
import shell from 'shelljs';
import { isFileOrDirExisted } from '../file.js';
import { projectRoot } from '../constants.js';

export default function create(projectName) {
  try {
    const cwd = path.join(process.cwd(), projectName);
    if (isFileOrDirExisted(cwd)) {
      throw new Error(`Already has a directory or file named ${projectName}`);
    }
    shell.mkdir('-p', projectName);
    shell.cp(path.join(projectRoot, './templates/rsd.config.js'), cwd);
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  }
}
