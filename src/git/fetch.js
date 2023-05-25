import { spawnRunCommand } from '../utils.js';
import { cd, uncd } from '../shell/index.js';

export async function fetchRemoteTag(options) {
  // git fetch origin +refs/tags/1.0.0:refs/tags/1.0.0
  const { dir, ref, options: extraOpts = [], onProgress = () => {} } = options;

  cd(dir);

  await spawnRunCommand(
    'git',
    [
      'fetch',
      'origin',
      `+refs/tags/${ref}:refs/tags/${ref}`,
      '--depth',
      1,
      '--progress',
      ...extraOpts,
    ],
    onProgress
  );

  uncd();
}
