<a href="README.md">English</a>｜<a href="README.zh_CN.md">简体中文</a>

# react-source-debugger

A tool for quickly setting up the environment of debugging React source code.

## Install

```sh
npm i -g react-source-debugger
# or
yarn global add react-source-debugger
# or
pnpm add -g react-source-debugger
```

## Usage

Simplest usage, only 3 steps:

```sh
rsd create my-react-debug-app
cd my-react-debug-app
rsd init
```

## Configuration

`rsd init` automatically finds configuartion file(`rsd.config.{js,mjs,cjs,json}`) from current directory. If not found, will use default configuration.

You can manually specify configuration:

```sh
rsd init --config /path/to/rsd.config.js
```

### Options

```js
export default {
  react: {
    dir: '/path/to/react/source/code/',
    version: '18.2.0',
  },
  testProject: {
    dir: '/path/to/test/project/',
    scaffold: 'vite',
    useTs: true,
    mode: 'development',
    devPort: 3000,
  },
};
```

### react.dir

source code directory of React, default where `rsd init` runs.

### react.version

version of React, default `18.2.0`. Only supports partial versions, will automatically match version with same major.

supports：

- 16.14.0
- 17.0.2
- 18.2.0

### testProject.dir

directory of test project, default directory where `rsd init` runs。If manually specify this option, other options under `testProject` are ineffective, maybe yiou should adjust your code to ensure you can debug correctly.

### testProject.scaffold

scaffold of test project, default `vite`. Supports:

- vite
- create-react-app

### testProject.useTs

use `ts` or not, default `true`.

### testProject.mode

development mode, decides whether the logic of React `__Dev__` executes or not，default `development`. Supports:

- development
- production

### testProject.devPort

port of dev server and vscode debug attaches to, default `3000`。

## Build React source

If versions of React that `react-source-debugger` provides can't satisfy you, you can build it manually.

### Install dependencies

```sh
yarn install --frozen-lockfile
```

Installation in Apple M1 machine would throw error, solution see [here](https://github.com/imagemin/optipng-bin/issues/118#issuecomment-1019838562).

### Build

```sh
yarn build
```

## Author

[Javen Leung](https://github.com/avennn)

## License

[MIT](./LICENSE)
