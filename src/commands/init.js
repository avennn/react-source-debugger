import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
import shell from 'shelljs';
import chalk from 'chalk';
import deepMerge from 'deepmerge';
import { isFileOrDirExisted } from '../file.js';
import { cd, uncd } from '../shell/index.js';
import { shallowClone, checkout, listTags, fetchRemoteTag } from '../git/index.js';
import { reactDataDir, defaultProjectName, defaultConfig } from '../constants.js';
import { spawnRunCommand, getAvailablePort, compareVersion } from '../utils.js';
import hint from '../hint.js';
import { ScaffoldVite, ScaffoldCRA } from '../scaffold-adapters/index.js';

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
    hint.error(e);
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

async function matchNearestVersion(target) {
  const files = await fs.readdir(reactDataDir, { withFileTypes: true });
  const versions = files
    .filter((item) => item.isDirectory())
    .map((item) => path.basename(item.name))
    .filter((item) => item.split('.')[0] === target.split('.')[0])
    .sort((a, b) => compareVersion(a, b) === -1);
  // find equal or larger one, fallback the largest one in version list.
  let j = versions.length - 1;
  for (let i = 0; i < versions.length; i++) {
    if (compareVersion(versions[i], target) >= 0) {
      j = i;
      break;
    }
  }
  return versions[j];
}

async function copyReactBuildResult(reactDir, reactVersion) {
  const dir = path.join(reactDataDir, reactVersion);
  const files = await fs.readdir(dir, { withFileTypes: true });
  files
    .filter((item) => item.isDirectory())
    .forEach((item) => {
      // Be careful
      shell.rm('-rf', path.join(reactDir, path.basename(item.name)));
    });
  shell.cp('-R', `${dir}/*`, reactDir);
}

async function gitCheckoutReact(dir, ref) {
  hint.doing('Checking out...');

  const tags = await listTags({ dir });
  if (!tags.includes(ref)) {
    await gitFetchReactRemoteTag({ dir, ref });
  }
  await checkout({ dir, ref });

  hint.success('Checked out successfully!');
}

async function prepareReact({ dir: reactDir, version: reactVersion, mode }) {
  const matchedVersion = await matchNearestVersion(reactVersion);

  if (matchedVersion !== reactVersion) {
    hint.warn(
      `Not support react ${chalk.bold('v', reactVersion)}. Using ${chalk.bold(
        'v',
        matchedVersion
      )} instead.`
    );
  }

  const tag = `v${matchedVersion}`;

  if (!reactDir) {
    reactDir = path.join(process.cwd(), 'react');
    if (!isFileOrDirExisted(reactDir)) {
      hint.doing('Cloning react...');
      await gitCloneReact({ dir: reactDir, ref: tag });
      hint.success('Cloned react successfully!');
    } else {
      hint.warn('Already has react. Skip clone phase.');
      await gitCheckoutReact(reactDir, tag);
    }
  } else {
    await gitCheckoutReact(reactDir, tag);
  }

  // since react17 react16 production reguire "object-assign", we need to install deps
  if (['16', '17'].includes(matchedVersion.split('.')[0]) && mode === 'production') {
    hint.doing(`Installing react v${matchedVersion} deps.`);
    cd(reactDir);
    await spawnRunCommand(
      'yarn',
      ['--frozen-lockfile', '--ignore-scripts', '--production=true'],
      (data) => {
        console.log(data);
      }
    );
    hint.success(`Installed react v${matchedVersion} deps successfully!`);
    uncd();
  }

  hint.doing('Coping react build...');
  await copyReactBuildResult(reactDir, matchedVersion);
  hint.success('Copied react build successfully!');

  return reactDir;
}

async function prepareTestProject({
  scaffold,
  dir: projectDir,
  useTs,
  mode,
  reactVersion,
  devPort,
  reactDir,
  cwd,
}) {
  const port = await getAvailablePort(devPort);
  if (!projectDir) {
    projectDir = path.join(cwd, defaultProjectName);

    if (isFileOrDirExisted(projectDir)) {
      throw new Error(`Already has ${defaultProjectName}. Please remove it and re-init.`);
    }

    const info = {
      reactDir,
      reactVersion,
      projectDir,
      useTs,
      mode,
      devPort: port,
    };

    let instance;
    switch (scaffold) {
      case 'create-react-app':
        instance = new ScaffoldCRA(info);
        break;
      default:
        instance = new ScaffoldVite(info);
        break;
    }
    instance.initProject();
  }

  return { testProjectDir: projectDir, devPort: port };
}

async function createVscodeWorkspace(wsDir, { reactDir, testProjectDir, devPort, scaffold, mode }) {
  // With vscode multi root workspace, projects show in stack as folders array order.
  // We want to keep react at the top since it is helpful for debugging react source code.
  // And ${workspaceFolder} equals to first folder path, so is react.
  // We need to change it to testProject.
  const testProjectName = defaultProjectName;
  const configItem = {
    type: 'chrome',
    request: 'launch',
    name: 'Launch Chrome against localhost',
    url: `http://localhost:${devPort}`,
    // https://code.visualstudio.com/docs/editor/variables-reference#_variables-scoped-per-workspace-folder
    webRoot: '${workspaceFolder:' + testProjectName + '}',
    sourceMaps: true,
  };
  if (scaffold === 'create-react-app' && mode === 'production') {
    Object.assign(configItem, {
      sourceMapPathOverrides: {
        '*': '${webRoot}/src/*',
      },
    });
  }
  const config = {
    folders: [
      { name: 'react', path: reactDir },
      { name: testProjectName, path: testProjectDir },
    ],
    launch: {
      version: '0.2.0',
      configurations: [configItem],
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
    // TODO: check react version, only support 16, 17, 18
    console.log('Running with config: ', config);

    const { react, testProject } = config;
    const reactDir = await prepareReact({ ...react, mode: testProject.mode });
    const { testProjectDir, devPort } = await prepareTestProject({
      ...testProject,
      reactVersion: react.version,
      reactDir,
      cwd,
    });
    await createVscodeWorkspace(cwd, {
      reactDir,
      testProjectDir,
      devPort,
      scaffold: testProject.scaffold,
      mode: testProject.mode,
    });
  } catch (e) {
    hint.error(e);
    process.exit(1);
  }
}
