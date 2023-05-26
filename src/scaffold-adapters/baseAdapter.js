import path from 'node:path';
import shell from 'shelljs';
import { cd, uncd } from '../shell/index.js';
import { projectRoot } from '../constants.js';
import {
  isFileOrDirExisted,
  readFileAsJson,
  writeFileAsJson,
  replaceFileContent,
} from '../file.js';
import { spawnRunCommand } from '../utils.js';
import hint from '../hint.js';

export default class BaseAdapter {
  constructor(scaffold, options) {
    /**
     * const info = {
        projectDir,
        useTs,
        mode,
        reactDir,
        reactVersion,
        devPort: port,
      };
     */
    this.options = options;
    this.scaffold = scaffold;
  }

  // @abstract
  async afterAll() {}

  async copyTemplateProject() {
    const { projectDir, reactVersion, useTs } = this.options;
    const [majorVersion] = reactVersion.split('.');
    const dirName = `react${majorVersion}${useTs ? '-ts' : ''}`;
    if (!isFileOrDirExisted(projectDir)) {
      shell.mkdir('-p', projectDir);
    }
    shell.cp('-R', path.join(projectRoot, `templates/${this.scaffold}/${dirName}/*`), projectDir);
  }

  // @abstract
  async getScripts() {
    return {};
  }

  async modifyNpmScripts() {
    const { projectDir } = this.options;
    const pkgJsonPath = path.join(projectDir, 'package.json');
    const pkgJson = await readFileAsJson(pkgJsonPath);

    if (!pkgJson.scripts) {
      pkgJson.scripts = {};
    }
    Object.assign(pkgJson.scripts, await this.getScripts());

    await writeFileAsJson(pkgJsonPath, pkgJson);
  }

  async createAlias() {
    const { reactDir } = this.options;
    const baseDir = path.join(reactDir, 'build/node_modules');
    return [
      'react/jsx-dev-runtime.js',
      'react/jsx-runtime.js',
      'react-dom/client.js',
      'react-dom/index.js',
      'react/index.js',
    ].map((item) => path.join(baseDir, item));
  }

  // @abstract
  async getAliasConfig() {
    return '';
  }

  async modifyAlias() {
    const alias = await this.createAlias();
    const configPath = await this.getAliasConfig();
    await replaceFileContent(configPath, (content) => {
      alias.forEach((item, i) => {
        content = content.replaceAll(`$${i}`, item);
      });
      return content;
    });
  }

  // @abstract
  async modifyDevConfig() {
    await this.modifyAlias();
  }

  async installDeps() {
    const { projectDir } = this.options;

    cd(projectDir);

    await spawnRunCommand('npm', ['install'], (data) => {
      console.log(data);
    });

    uncd();
  }

  async initProject() {
    hint.doing(`Creating project with ${this.scaffold}...`);

    await this.copyTemplateProject();
    await this.modifyNpmScripts();
    await this.modifyDevConfig();
    await this.installDeps();

    hint.success(`Created project with ${this.scaffold} successfully!`);

    await this.afterAll();
  }
}
