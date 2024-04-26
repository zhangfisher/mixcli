# 实用工具函数

`MixCli`提供了一个实用的工具函数.

## createFileByTemplate

基于模板[artTemplate](https://github.com/lhywork/artTemplate)创建文件.

```ts
async function createFileByTemplate(targetFile:string,tmplFile:string,vars:Record<string,any>={})
```

## mkDirs

创建一个或多个目录.

```ts
async function mkDirs(dirs:string[],{callback,base}:{callback?:Function,base?:string})
```

- 创建目录前会先检查目录是否存在,如果存在则不会创建.
- 创建目录前进行`callback`
- `base`为基础目录,如果`base`不为空,则会在`base`目录下创建目录.否则会在当前目录下创建目录.

## copyDirs

`copyDirs`是[FlexTools](https://zhangfisher.github.io/flex-tools)提供的非常实用的功能函数.

复制文件夹内的所有文件(包括子文件夹)到指定的目标文件夹，并且保持源文件夹结构不变。 不同于其他的复制文件夹的功能，`copyDirs`支持模板文件。 引入`art-template`模板引擎，当源文件是`.art`文件时会进行模板渲染，然后再复制到目标文件夹。

详见[这里](https://zhangfisher.github.io/flex-tools/#/guide/fs?id=copydirs)




