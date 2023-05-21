import path from 'node:path';
import { spawn } from 'child_process';
import { URL, fileURLToPath } from 'node:url';
import detectPort from 'detect-port';

export function getDirName(p) {
  let file = p;
  if (p.includes('://')) {
    const url = new URL(p);
    file = url.protocol === 'file:' ? fileURLToPath(p) : url.href;
  }
  return path.dirname(file);
}

export function spawnRunCommand(cmd, options = [], onProgress = () => {}) {
  return new Promise((resolve, reject) => {
    const subProcess = spawn(cmd, options);

    subProcess.stdout.on('data', (data) => {
      onProgress(data.toString());
    });

    subProcess.stderr.on('data', (data) => {
      onProgress(data.toString());
    });

    subProcess.on('close', (code, signal) => {
      if (code === 0) {
        resolve();
      } else {
        reject({
          code,
          signal,
          message: `Spawn run command failed with code ${code} and signal ${signal}`,
        });
      }
    });
  });
}

export async function getAvailablePort(defaultPort) {
  try {
    return await detectPort(defaultPort);
  } catch (e) {
    console.error(e);
    return defaultPort;
  }
}
