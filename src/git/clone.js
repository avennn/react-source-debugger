import { spawn } from 'node:child_process';

export default async function shallowClone(options) {
  const {
    repoUrl,
    branch,
    destDir,
    options: extraOpts,
    onProgress = () => {},
    onSuccess = () => {},
    onFail = () => {},
  } = options;

  const gitClone = spawn('git', [
    'clone',
    repoUrl,
    '--branch',
    branch,
    '--depth',
    1,
    '--progress',
    ...extraOpts,
    destDir,
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
