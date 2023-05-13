import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import {
  createVscodeWorkspace,
  syncReactVersion,
  getDirName,
} from './utils.js';
import shell from 'shelljs';
import { cd, uncd } from './shell/index.js';

function installDeps() {
  const childProc = shell.exec('yarn install --frozen-lockfile', {
    async: true,
  });
  child.stdout.on('data', (data) => {
    /* ... do something with data ... */
  });
}

// reactPath: /Users/liangjianwen/Desktop/workspace/test/react
// projectPath: /Users/liangjianwen/Desktop/workspace/test/react-debug-demo2
export async function start(name, reactPath, projectPath) {
  const workspacePath = path.join(process.cwd(), `${name}.code-workspace`);

  shell.rm(workspacePath);

  // TODO: name可以使用uuid自动生成
  // TODO: code命令行工具自动打开
  createVscodeWorkspace(workspacePath, [reactPath, projectPath]);

  // 同步react版本
  const version = await syncReactVersion(reactPath, projectPath);

  cd(reactPath);
  // 安装依赖
  // shell.exec('yarn install --frozen-lockfile');
  // 修改文件
  // TODO: 小心文件路径的变化
  const curFileDir = getDirName(import.meta.url);
  const templatePath = path.join(
    curFileDir,
    `../templates/react/${version}/build.js`
  );

  shell.cp(templatePath, `${reactPath}/scripts/rollup`);
  // 构建
  shell.exec('yarn build');

  uncd();
}
