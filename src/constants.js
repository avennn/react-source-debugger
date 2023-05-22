import path from 'node:path';
import { getDirName } from './utils.js';

export const projectRoot = path.join(getDirName(import.meta.url), '../');
export const reactDataDir = path.join(projectRoot, 'data/react');
