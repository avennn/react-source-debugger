import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
import shell from 'shelljs';
import chalk from 'chalk';
import deepMerge from 'deepmerge';
import { isFileOrDirExisted, readFileAsJson, writeFileAsJson } from '../file.js';
import { cd, uncd } from '../shell/index.js';
import { shallowClone, checkout, listTags, fetchRemoteTag } from '../git/index.js';
import { projectRoot } from '../constants.js';
import { spawnRunCommand, getAvailablePort } from '../utils.js';

const require = createRequire(import.meta.url);

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
    throw new Error(`Make sure you have a rsd config file under directory: ${cwd}`);
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
  const defaultConfig = {
    // TODO: auto set as the newest version
    react: {
      version: '18.2.0',
    },
    testProject: {
      scaffold: 'vite',
      reactMode: 'development', // development | production
      useTs: true,
      devPort: 3000,
    },
  };
  return deepMerge(defaultConfig, {
    react: config.react || {},
    testProject: config.testProject || {},
  });
}

async function gitCloneReact({ dir, ref }) {
  // git@github.com:facebook/react.git
  // https://github.com/facebook/react.git
  try {
    await shallowClone({
      repoUrl: 'git@github.com:facebook/react.git',
      ref,
      dir,
      // close detached head advice
      options: ['-c', 'advice.detachedHead=false'],
      onProgress(data) {
        console.log(data);
      },
    });
  } catch (e) {
    console.error(e);
    throw new Error(`Fail to clone React. code: ${e.code}, signal: ${e.signal}.`);
  }
}

async function gitFetchReactRemoteTag({ dir, ref }) {
  try {
    await fetchRemoteTag({
      dir,
      ref,
      onProgress(data) {
        console.log(data);
      },
    });
  } catch (e) {
    throw new Error(
      `Fail to fetch react tag ${ref} from remote. code: ${e.code}, signal: ${e.signal}.`
    );
  }
}

async function copyReactBuildResult(reactDir, reactVersion) {
  const dir = path.join(projectRoot, `data/react/${reactVersion}`);
  if (!isFileOrDirExisted(dir)) {
    throw new Error(`No built result of version ${reactVersion}. Please contace author.`);
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

async function prepareReact({ dir: reactDir, version: reactVersion }) {
  const tag = `v${reactVersion}`;

  if (!reactDir) {
    console.log(chalk.bgYellow('Cloning react...'));

    reactDir = path.join(process.cwd(), 'react');
    if (!isFileOrDirExisted(reactDir)) {
      await gitCloneReact({ dir: reactDir, ref: tag });
    } else {
      console.log(chalk.yellowBright('Warning: aleady has react.'));
    }

    console.log(chalk.bgGreen('Clone react finished!'));
  } else {
    console.log(chalk.bgYellow('Checking out...'));

    const tags = await listTags({ dir: reactDir });
    if (!tags.includes(tag)) {
      await gitFetchReactRemoteTag({ dir: reactDir, ref: tag });
    }
    await checkout({ dir: reactDir, ref: tag });

    console.log(chalk.bgGreen('Check out finished!'));
  }

  console.log(chalk.bgYellow('Coping react build...'));
  copyReactBuildResult(reactDir, reactVersion);
  console.log(chalk.bgGreen('Copy react build finished'));

  return reactDir;
}

async function initProjectWithCRA({
  projectDir,
  useTs,
  reactMode,
  reactDir,
  reactVersion,
  devPort,
}) {
  const [majorVersion] = reactVersion.split('.');
  const dirName = `react${majorVersion}${useTs ? '-ts' : ''}`;
  if (!isFileOrDirExisted(projectDir)) {
    shell.mkdir('-p', projectDir);
  }
  shell.cp('-R', path.join(projectRoot, `templates/create-react-app/${dirName}/*`), projectDir);

  // install deps
  cd(projectDir);
  await spawnRunCommand('npm', ['install'], (data) => {
    console.log(data);
  });
  console.log(`Please cd ${projectDir} and run "npm run start"`);
  uncd();
}

async function initProjectWithVite({
  projectDir,
  useTs,
  reactMode,
  reactDir,
  reactVersion,
  devPort,
}) {
  function createAlias() {
    const baseDir = path.join(reactDir, 'build/node_modules');
    const isDev = reactMode === 'development';
    return {
      'react/jsx-dev-runtime': path.join(baseDir, 'react/jsx-dev-runtime.js'),
      'react-dom/client': path.join(baseDir, 'react-dom/client.js'),
      'react-dom': path.join(
        baseDir,
        `react-dom/cjs/react-dom.${isDev ? 'development' : 'production.min'}.js`
      ),
      react: path.join(baseDir, `react/cjs/react.${isDev ? 'development' : 'production.min'}.js`),
    };
  }

  const [majorVersion] = reactVersion.split('.');
  const dirName = `react${majorVersion}${useTs ? '-ts' : ''}`;
  if (!isFileOrDirExisted(projectDir)) {
    shell.mkdir('-p', projectDir);
  }
  shell.cp('-R', path.join(projectRoot, `templates/vite/${dirName}/*`), projectDir);

  // change files
  const pkgJsonPath = path.join(projectDir, 'package.json');
  const pkgJson = await readFileAsJson(pkgJsonPath);
  Object.assign(pkgJson.scripts, { dev: `vite --port ${devPort}` });
  await writeFileAsJson(pkgJsonPath, pkgJson);

  const alias = createAlias();
  const viteConfigPath = path.join(projectDir, `vite.config.${useTs ? 'ts' : 'js'}`);
  let viteConfig = await fs.readFile(viteConfigPath, { encoding: 'utf-8' });
  Object.keys(alias).forEach((key, i) => {
    viteConfig = viteConfig.replace(`'$${i}'`, `'${alias[key]}'`);
  });
  await fs.writeFile(viteConfigPath, viteConfig);

  // install deps
  cd(projectDir);
  await spawnRunCommand('npm', ['install'], (data) => {
    console.log(data);
  });
  console.log(`Please cd ${projectDir} and run "npm run dev"`);
  uncd();
}

async function prepareTestProject({
  scaffold,
  dir,
  useTs,
  reactMode,
  reactVersion,
  devPort,
  reactDir,
}) {
  const port = await getAvailablePort(devPort);

  if (!dir) {
    const baseDir = process.cwd();
    const defaultProjectName = 'test-project';
    dir = path.join(baseDir, defaultProjectName);

    switch (scaffold) {
      case 'create-react-app':
        await initProjectWithCRA({
          projectDir: dir,
          useTs,
          reactMode,
          reactDir,
          reactVersion,
          devPort: port,
        });
        break;
      default:
        await initProjectWithVite({
          projectDir: dir,
          useTs,
          reactMode,
          reactDir,
          reactVersion,
          devPort: port,
        });
        break;
    }
  }

  return { testProjectDir: dir, devPort: port };
}

async function createVscodeWorkspace(wsDir, { reactDir, testProjectDir, devPort }) {
  const config = {
    folders: [{ path: reactDir }, { path: testProjectDir }],
    launch: {
      version: '0.2.0',
      configurations: [
        {
          type: 'chrome',
          request: 'launch',
          name: 'Launch Chrome against localhost',
          url: `http://localhost:${devPort}`,
          webRoot: '${workspaceFolder}',
          sourceMaps: true,
        },
      ],
    },
  };
  await fs.writeFile(path.join(wsDir, 'rsd.code-workspace'), JSON.stringify(config, null, 2));
}

// reactPath: /Users/liangjianwen/Desktop/workspace/test/react
// projectPath: /Users/liangjianwen/Desktop/workspace/test/react-debug-demo2
export default async function init(options) {
  try {
    const { config: targetConfig } = options;
    const cwd = process.cwd();

    // allow rsd.config.{json,js,cjs,mjs}
    const config = await finalizeConfig(targetConfig);
    // TODO: check validation of config
    console.log('Running with config: ', config);

    const { react, testProject } = config;
    const reactDir = await prepareReact(react);
    const { testProjectDir, devPort } = await prepareTestProject({
      ...testProject,
      reactVersion: react.version,
      reactDir,
    });
    await createVscodeWorkspace(cwd, {
      reactDir,
      testProjectDir,
      devPort,
    });
  } catch (e) {
    console.error(chalk.redBright(e.message));
    process.exit(1);
  }
}
