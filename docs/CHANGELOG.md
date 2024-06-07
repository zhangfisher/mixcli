# mixcli

## 3.0.6

### Patch Changes

- f38e1ec: 修复在某此情况下显示`只能在nodejs环境下运行`的错误提示

## 3.0.5

### Patch Changes

- 1369cff: 修复在某些情况下扫描不到命令的问题

## 3.0.4

### Patch Changes

- 67e94b1: 修复当运行在非 node 包下时出错的 path undefined 错误

## 3.0.3

### Patch Changes

- 4505f11: 优化命令导入机制,解决当 type:module 时的导入问题

## 3.0.2

### Patch Changes

- cc8803c: 更新发布

## 3.0.1

### Patch Changes

- 46c9833: update dependencies

## 3.0.0

### Major Changes

- f5c09db: rename package name

## 2.0.12

### Patch Changes

- 60bb80b: 新增加对 type:module 的包支持

## 2.0.11

### Patch Changes

- c708517: 修复了搜索命令时存在循环引用依赖时的命令重复注册问题

## 2.0.10

### Patch Changes

- 27df7b2: 修复当 required=true 时不生效的问题

## 2.0.9

### Patch Changes

- 4e6ca50: 增强 after 钩子函数的执行,确保在执行出错还可以得到执行,即调整到 finally 中执行

## 2.0.8

### Patch Changes

- 97b4021: 增强`before`和`after`钩子函数的执行逻辑,现在默认情况下钩子函数会在所有子命令执行时也会得到执行,这样我们就可以为所有子命令执行一些公共逻辑

## 2.0.7

### Patch Changes

- b33c7d7: 更新示例包名

## 2.0.6

### Patch Changes

- 修复当指定`prompt=false`时无法禁用交互提示的问题

## 2.0.5

### Patch Changes

- 7f509eb: 增加`disablePrompts()`方法实现禁用指定命令的交互提示
- 修复 find 命令时如果命令已存在时没有马上返回的问题

## 2.0.0

### Major Changes

- 修复当指定 choices 时默认值无效的问题
