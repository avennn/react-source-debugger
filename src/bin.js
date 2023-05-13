#! /usr/bin/env node

import { start } from './index.js';

console.log('You are using react-source-debugger cli.');

// console.log('pwd, dirname ', process.cwd(), '\n', __dirname);

start(
  'react-debug',
  '/Users/liangjianwen/Desktop/workspace/test/react',
  '/Users/liangjianwen/Desktop/workspace/test/react-debug-demo2'
);
