import path from 'node:path';
import chalk from 'chalk';
import BaseAdapter from './baseAdapter.js';

export default class ViteAdapter extends BaseAdapter {
  constructor(options) {
    super('vite', options);
  }

  afterAll() {
    const { projectDir } = this.options;
    const relativePath = path.relative(process.cwd(), projectDir);
    // TODO: optimize
    console.log(`Please run:\n${chalk.cyan('cd', relativePath)}\n${chalk.cyan('npm run dev')}\n`);
  }

  getScripts() {
    const { mode, devPort } = this.options;
    return {
      dev: `NODE_ENV=${mode} vite --port ${devPort}`,
    };
  }

  getAliasConfig() {
    const { projectDir, useTs } = this.options;
    return path.join(projectDir, `vite.config.${useTs ? 'ts' : 'js'}`);
  }
}
