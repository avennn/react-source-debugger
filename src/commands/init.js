import fs from 'node:fs/promises';
import path, { resolve } from 'node:path';
import { createRequire } from 'node:module';
import {
  createVscodeWorkspace,
  syncReactVersion,
  getDirName,
} from '../utils.js';
import shell from 'shelljs';
import chalk from 'chalk';
import { isFileOrDirExisted } from '../file.js';
import {
  shallowClone,
  checkout,
  listTags,
  fetchRemoteTag,
} from '../git/index.js';
import { projectRoot } from '../constants.js';

const require = createRequire(import.meta.url);

function installDeps() {
  const childProc = shell.exec('yarn install --frozen-lockfile', {
    async: true,
  });
  child.stdout.on('data', (data) => {
    /* ... do something with data ... */
  });
}

function lookupConfigFile(target) {
  const cwd = process.cwd();

  if (target) {
    let configFile = '';
    if (path.isAbsolute(target)) {
      configFile = target;
    } else {
      configFile = path.join(cwd, target);
    }

    if (!isFileOrDirExisted(configFile)) {
      throw new Error('Config file not existed!');
    }
    return configFile;
  }

  const exts = ['js', 'cjs', 'mjs', 'json'];
  const configFile = exts
    .map((ext) => path.join(cwd, `rsd.config.${ext}`))
    .find((p) => isFileOrDirExisted(p));

  if (!configFile) {
    throw new Error(
      `Make sure you have a rsd config file under directory: ${cwd}`
    );
  }

  return configFile;
}

async function loadConfig(target) {
  function loadWithCjs(p) {
    return require(p);
  }
  async function loadWithEsm(p) {
    const { default: config } = await import(p);
    return config;
  }

  const configFile = lookupConfigFile(target);

  if (configFile.endsWith('.json') || configFile.endsWith('.cjs')) {
    return loadWithCjs(configFile);
  }
  if (configFile.endsWith('.mjs')) {
    return loadWithEsm(configFile);
  }
  if (configFile.endsWith('.js')) {
    // duck type check
    const config = await fs.readFile(configFile, { encoding: 'utf-8' });
    if (config.indexOf('module.exports') > -1) {
      return loadWithCjs(configFile);
    }
    return loadWithEsm(configFile);
  }
  return {};
}

async function finalizeConfig(target) {
  const config = await loadConfig(target);
  // const cwd = process.cwd();
  const defaultConfig = {
    // reactDir: path.join(cwd, 'react'),
    // projectDir: path.join(cwd, 'my-react-app'),
    // TODO: auto set as the newest version
    reactVersion: '18.2.0',
  };
  return Object.assign(defaultConfig, config);
}

function gitCloneReact({ dir, ref }) {
  // git@github.com:facebook/react.git
  // https://github.com/facebook/react.git
  return new Promise((resolve, reject) => {
    shallowClone({
      repoUrl: 'git@github.com:facebook/react.git',
      ref,
      dir,
      // close detached head advice
      options: ['-c', 'advice.detachedHead=false'],
      onProgress(data) {
        console.log(data);
      },
      onSuccess() {
        resolve();
      },
      onFail(code, signal) {
        reject(
          new Error(
            `Fail to clone React, exit code: ${code}, exit signal: ${signal}.`
          )
        );
      },
    });
  });
}

function fetchReactRemoteTag({ dir, ref }) {
  return new Promise((resolve, reject) => {
    fetchRemoteTag({
      dir,
      ref,
      onProgress(data) {
        console.log(data);
      },
      onSuccess() {
        resolve();
      },
      onFail() {
        reject(new Error(`Fail to fetch react tag ${ref} from remote.`));
      },
    });
  });
}

async function copyReactBuildResult(reactDir, reactVersion) {
  const dir = path.join(projectRoot, `data/react/${reactVersion}`);
  if (!isFileOrDirExisted(dir)) {
    throw new Error(
      `No built result of version ${reactVersion}. Please contace author.`
    );
  }
  const files = await fs.readdir(dir, { withFileTypes: true });
  files
    .filter((item) => item.isDirectory())
    .forEach((item) => {
      // Be careful
      shell.rm('-rf', path.join(reactDir, path.basename(item.name)));
    });
  shell.cp('-R', `${dir}/*`, reactDir);
}

async function prepareReact(reactDir, reactVersion) {
  const tag = `v${reactVersion}`;

  if (!reactDir) {
    console.log(chalk.bgYellow('Cloning react...'));

    reactDir = path.join(process.cwd(), 'react');
    await gitCloneReact({ dir: reactDir, ref: tag });

    console.log(chalk.bgGreen('Clone react finished!'));
  } else {
    console.log(chalk.bgYellow('Checking out...'));

    const tags = await listTags({ dir: reactDir });
    if (!tags.includes(tag)) {
      await fetchReactRemoteTag({ dir: reactDir, ref: tag });
    }
    await checkout({ dir: reactDir, ref: tag });

    console.log(chalk.bgGreen('Check out finished!'));
  }

  console.log(chalk.bgYellow('Coping react build...'));
  copyReactBuildResult(reactDir, reactVersion);
  console.log(chalk.bgGreen('Copy react build finished'));

  return reactDir;
}

// reactPath: /Users/liangjianwen/Desktop/workspace/test/react
// projectPath: /Users/liangjianwen/Desktop/workspace/test/react-debug-demo2
export default async function init(options) {
  try {
    const { config: targetConfig } = options;

    // allow rsd.config.{json,js,cjs,mjs}
    const config = await finalizeConfig(targetConfig);
    // TODO: check validation of config
    console.log('Running with config: ', config);

    const reactDir = await prepareReact(config.reactDir, config.reactVersion);
  } catch (e) {
    console.error(chalk.redBright(e.message));
    process.exit(1);
  }

  // const workspacePath = path.join(process.cwd(), `${name}.code-workspace`);

  // shell.rm(workspacePath);

  // // TODO: code命令行工具自动打开
  // createVscodeWorkspace(workspacePath, [reactPath, projectPath]);

  // // 同步react版本
  // const version = await syncReactVersion(reactPath, projectPath);

  // cd(reactPath);
  // // 安装依赖
  // // shell.exec('yarn install --frozen-lockfile');
  // // 修改文件
  // // TODO: 小心文件路径的变化
  // const curFileDir = getDirName(import.meta.url);
  // const templatePath = path.join(
  //   curFileDir,
  //   `../templates/react/${version}/build.js`
  // );

  // shell.cp(templatePath, `${reactPath}/scripts/rollup`);
  // // 构建
  // shell.exec('yarn build');

  // uncd();
}
