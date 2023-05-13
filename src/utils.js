import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { URL, fileURLToPath } from 'node:url';
import shell from 'shelljs';
import git from 'isomorphic-git';
import { tagCommitCollection } from './data.js';
import { checkout } from './git/index.js';

export function createVscodeWorkspace(wsPath, projectPaths) {
  const config = {
    folders: projectPaths.map((p) => ({ path: p })),
    settings: {
      'workbench.iconTheme': 'vscode-icons',
    },
    launch: {
      version: '0.2.0',
      configurations: [
        {
          type: 'chrome',
          request: 'launch',
          name: 'Launch Chrome against localhost',
          url: 'http://localhost:3001',
          webRoot: '${workspaceFolder}',
          sourceMaps: true,
        },
      ],
    },
  };
  fs.writeFileSync(wsPath, JSON.stringify(config, null, 2));
}

export async function syncReactVersion(reactPath, projectPath) {
  // TODO: 没有安装react的情况
  const reactPackageJson = JSON.parse(
    fs.readFileSync(path.join(projectPath, './node_modules/react/package.json'))
  );
  const reactVersoin = reactPackageJson.version;

  const tags = await git.listTags({ fs, dir: reactPath });
  const matchedTag = tags.find((t) => t === `v${reactVersoin}`);
  if (matchedTag) {
    await git.checkout({
      fs,
      dir: reactPath,
      force: true,
      filepaths: ['.'],
    });
    await checkout({
      dir: reactPath,
      ref: matchedTag,
    });
    return matchedTag;
  }
  return '';
}

export function tag2Commit(tag) {
  const collect = tagCommitCollection.find((item) => item[0] === tag);
  if (collect) {
    return collect[1];
  }
  return '';
}

export function getDirName(p) {
  let file = p;
  if (p.includes('://')) {
    const url = new URL(p);
    file = url.protocol === 'file:' ? fileURLToPath(p) : url.href;
  }
  return path.dirname(file);
}
