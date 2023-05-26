import path from 'node:path';
import { getDirName } from './utils.js';

export const projectRoot = path.join(getDirName(import.meta.url), '../');

export const reactDataDir = path.join(projectRoot, 'data/react');

export const defaultProjectName = 'test-demo';

// Sync with `templates/rsd.config.js`
export const defaultConfig = {
  react: {
    version: '18.2.0',
  },
  testProject: {
    scaffold: 'vite',
    useTs: true,
    mode: 'development',
    devPort: 3000,
  },
};
