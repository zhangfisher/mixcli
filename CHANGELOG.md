# mixcli

## 3.2.9

### Patch Changes

- 4897498: feat: add initial(fn) support

## 3.2.8

### Patch Changes

- 6fb7504: 修复当提供无效 initial 时出错的问题

## 3.2.7

### Patch Changes

- b896ee5: update invalidate initial values
- ef9af6a: update initial values

## 3.2.6

### Patch Changes

- d526eea: feat: apply initial values

## 3.2.5

### Patch Changes

- fd288be: add command initial method

## 3.2.4

### Patch Changes

- 6fe3d85: fix release enery

## 3.2.3

### Patch Changes

- a0b8cf5: fix some error

## 3.2.2

### Patch Changes

- 9414b62: fix type error

## 3.2.1

### Patch Changes

- c9bf4f5: 优化 Option 传参

## 3.2.0

### Minor Changes

- 21dd638: 改进命令注册时的识别逻辑。
  之前如果不同包的`mixcli`版本不一致时会无法识别命令，现在改进了识别逻辑，可以让不同包所依赖的`mixcli`版本不一样时也可以识别。

  以快速入门为例，如果你的项目依赖的`mixcli`版本是`3.0.10`，
  而`vue`, `react`等框架依赖的`mixcli`版本是`3.0.9`时，就会出现无法识别命令的问题。
  现在这个问题已经解决了。

- 69ebb91: 优化 prompt 传参方式
