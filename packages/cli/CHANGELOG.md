# mixcli

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
