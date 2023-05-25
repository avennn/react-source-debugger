import process from 'node:process';
import shell from 'shelljs';

let prevDir;

// 恢复cd前的目录
export function uncd() {
  if (prevDir) {
    shell.cd(prevDir);
    prevDir = undefined;
  }
}

// cd进某个目录
export function cd(dir) {
  prevDir = process.cwd();
  shell.cd(dir);
  return uncd;
}
