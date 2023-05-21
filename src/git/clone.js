import { spawnRunCommand } from '../utils.js';

export async function shallowClone(options) {
  const {
    repoUrl,
    ref,
    dir,
    options: extraOpts = [],
    onProgress = () => {},
  } = options;

  await spawnRunCommand(
    'git',
    [
      'clone',
      repoUrl,
      '--branch',
      ref,
      '--depth',
      1,
      '--progress',
      ...extraOpts,
      dir,
    ],
    onProgress
  );
}
