# react-source-debugger

A debugger for learning React source code

## React 版本

18.2.0

## 如何实现

1. demo 项目中 webpack devtool 不能为 false，这样才有 source-map，才能 debug
2. demo 项目中使用 vscode debug，配置 type 为 chrome，url 端口为 webpack dev-server 端口，sourceMaps 为 true（默认的）；
3. react 源码项目 build 打出 react.development.js 和 source map
