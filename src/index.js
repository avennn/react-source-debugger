#! /usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { Command } from 'commander';
import chalk from 'chalk';
import { getDirName } from './utils.js';
import { create, init } from './commands/index.js';

const require = createRequire(import.meta.url);
const { safeJsonParse } = require('tori');

try {
  const pkgJsonText = fs.readFileSync(
    path.join(getDirName(import.meta.url), '../package.json'),
    {
      encoding: 'utf8',
    }
  );
  const { version } = safeJsonParse(pkgJsonText, {});

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
  console.error(chalk.redBright(e.message));
}
