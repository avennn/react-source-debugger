import { spawn } from 'node:child_process';

export async function shallowClone(options) {
  const {
    repoUrl,
    ref,
    dir,
    options: extraOpts = [],
    onProgress = () => {},
    onSuccess = () => {},
    onFail = () => {},
  } = options;

  const gitClone = spawn('git', [
    'clone',
    repoUrl,
    '--branch',
    ref,
    '--depth',
    1,
    '--progress',
    ...extraOpts,
    dir,
  ]);
  gitClone.stdout.on('data', (data) => {
    onProgress(data.toString());
  });

  gitClone.stderr.on('data', (data) => {
    onProgress(data.toString());
  });

  gitClone.on('close', (code, signal) => {
    if (code === 0) {
      onSuccess();
    } else {
      onFail(code, signal);
    }
  });
}
