# react-source-debugger

A debugger for learning React source code

## React 版本

18.2.0

## 如何实现

1. demo 项目中 webpack devtool 不能为 false，这样才有 source-map，才能 debug
2. demo 项目中使用 vscode debug，配置 type 为 chrome，url 端口为 webpack dev-server 端口，sourceMaps 为 true（默认的）；
3. react 源码项目 build 打出 react.development.js 和 source map

## React 源码构建

### 依赖安装

Apple M1 芯片环境的不同，安装依赖时 optpng-bin 会报错，解决办法：https://github.com/imagemin/optipng-bin/issues/118#issuecomment-1019838562

```sh
CPPFLAGS="-DPNG_ARM_NEON_OPT=0" yarn install --frozen-lockfile
```

## TODO

- [ ] CRA react18-ts
- [ ] CRA react18
- [ ] CRA react17-ts
- [ ] CRA react17
- [ ] CRA react16-ts
- [ ] CRA react16
- [x] vite react18-ts
- [x] vite react18
- [x] vite react17-ts
- [x] vite react17
- [ ] vite react16-ts
- [ ] vite react16
