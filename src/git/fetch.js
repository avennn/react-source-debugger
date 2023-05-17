import { spawn } from 'node:child_process';
import shell from 'shelljs';

export function fetchRemoteTag(options) {
  // git fetch origin +refs/tags/1.0.0:refs/tags/1.0.0
  const {
    dir,
    ref,
    options: extraOpts = [],
    onProgress = () => {},
    onSuccess = () => {},
    onFail = () => {},
  } = options;

  shell.cd(dir);

  const gitFetch = spawn('git', [
    'fetch',
    'origin',
    `+refs/tags/${ref}:refs/tags/${ref}`,
    '--depth',
    1,
    '--progress',
    ...extraOpts,
  ]);
  gitFetch.stdout.on('data', (data) => {
    onProgress(data.toString());
  });

  gitFetch.stderr.on('data', (data) => {
    onProgress(data.toString());
  });

  gitFetch.on('close', (code, signal) => {
    if (code === 0) {
      onSuccess();
    } else {
      onFail(code, signal);
    }
  });
}
