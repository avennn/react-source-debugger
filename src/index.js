#! /usr/bin/env node

import path from 'node:path';
import { Command } from 'commander';
import chalk from 'chalk';
import { create, init } from './commands/index.js';
import { projectRoot } from './constants.js';
import { readFileAsJson } from './file.js';

try {
  const { version } = await readFileAsJson(path.join(projectRoot, 'package.json'));

  const program = new Command();
  program.version(version, '-v, --version');
  program
    .command('create')
    .description('Create a react source debug project.')
    .argument('<project name>', 'project name')
    .action((name) => {
      create(name);
    });
  program
    .command('init')
    .description('Initialize react and demo project based on react.')
    .option('--config', 'config file path')
    .action((options) => {
      init(options);
    });

  program.parse();
} catch (e) {
  console.error(chalk.red(e.message));
}
