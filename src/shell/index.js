import process from 'node:process';
import shell from 'shelljs';

let cwd;

// 恢复cd前的目录
export function uncd() {
  if (cwd) {
    shell.cd(cwd);
    cwd = undefined;
  }
}

// cd进某个目录
export function cd(dir) {
  cwd = process.cwd();
  shell.cd(dir);
  return uncd;
}
