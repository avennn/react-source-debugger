<a href="README.md">English</a>｜<a href="README.zh_CN.md">简体中文</a>

# react-source-debugger

一个快速搭建 React 源码调试环境的工具。

## 安装

```sh
npm i -g react-source-debugger
# 或者
yarn global add react-source-debugger
# 或者
pnpm add -g react-source-debugger
```

## 使用

最简单的使用方式，只需三步：

```sh
rsd create my-react-debug-app
cd my-react-debug-app
rsd init
```

## 配置

`rsd init`会从当前目录查找配置文件（`rsd.config.{js,mjs,cjs,json}`）。如果没有，会使用默认配置。

你也可以手动指定配置：

```sh
rsd init --config /path/to/rsd.config.js
```

### 配置项

```js
export default {
  react: {
    dir: '/path/to/react/source/code/',
    version: '18.2.0',
  },
  testProject: {
    dir: '/path/to/test/project/',
    scaffold: 'vite',
    useTs: true, // 测试项目是否使用ts，默认为true
    mode: 'development', // production
    devPort: 3000,
  },
};
```

### react.dir

React 源码目录，默认`rsd init`所在目录。

### react.version

React 版本，默认`18.2.0`。目前只支持部分版本，找不到指定版本会自动匹配相同 major 的版本。

支持：

- 16.14.0
- 17.0.2
- 18.2.0

### testProject.dir

测试项目所在目录，默认`rsd init`所在目录。如果手动指定，`testProject`其他选项无效，可能需要手动调整测试项目代码才能调试。

### testProject.scaffold

测试项目的脚手架，默认`vite`，支持：

- vite
- create-react-app

### testProject.useTs

是否使用 ts，默认为`true`。

### testProject.mode

开发模式，可以控制 React 是否会走`__Dev__`相关逻辑，默认`development`，支持：

- development
- production

### testProject.devPort

指定 dev server 使用的端口，也是 vscode debug 关联的端口，默认`3000`。

## React 源码构建

如果`react-source-debugger`提供的 React 版本不满足你的要求，你可以自己构建 React 产物。

### 依赖安装

```sh
yarn install --frozen-lockfile
```

Apple M1 机器安装依赖时会报错，解决办法看[这里](https://github.com/imagemin/optipng-bin/issues/118#issuecomment-1019838562)。

### 构建

```sh
yarn build
```
