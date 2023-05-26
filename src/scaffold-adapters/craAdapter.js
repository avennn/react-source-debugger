import path from 'node:path';
import chalk from 'chalk';
import BaseAdapter from './baseAdapter.js';
import { replaceFileContent } from '../file.js';

export default class CraAdapter extends BaseAdapter {
  constructor(options) {
    super('create-react-app', options);
  }

  afterAll() {
    const { projectDir } = this.options;
    const relativePath = path.relative(process.cwd(), projectDir);
    console.log(`Please run:\n${chalk.cyan('cd', relativePath)}\n${chalk.cyan('npm start')}\n`);
  }

  getScripts() {
    const { devPort } = this.options;
    return {
      start: `GENERATE_SOURCEMAP=true PORT=${devPort} node scripts/start.js`,
    };
  }

  getAliasConfig() {
    const { projectDir } = this.options;
    return path.join(projectDir, 'config/webpack.config.js');
  }

  async modifyMode() {
    // start script
    const { projectDir, mode } = this.options;
    await replaceFileContent(path.join(projectDir, 'scripts/start.js'), (content) =>
      content.replaceAll('$mode', mode)
    );
  }

  async modifyDevConfig() {
    await this.modifyAlias();
    await this.modifyMode();
  }
}
