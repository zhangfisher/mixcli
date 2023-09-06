# 创建命令行应用

创建命令行应用，需要安装 `flexcli` 

## 创建命令行实例

```js{6}
const { FlexCli } = require("flexcli");
const cli = new FlexCli({
    // 此处是配置参数
});

cli.run();      // 执行命令行应用

```

## 配置参数

`FlexCli`支持以下配置参数：

```ts
export interface FlexCliOptions{
    // 命令行应用的名称,一般应该与package.json中的bin:{<name>:"...."}中的名称一致
    name:string,
    // 命令行应用的标题，在help中显示，支持logsets风格的着色显示
    title?:string | (string | number | boolean)[],
    // 简要描述方，在help中显示
    description?:string,
    // 命令行应用的版本号，在help中显示
    version?:string
    // 命令行应用的logo，在help中显示在最前面
    logo?:string,
    // 在根命令执行前执行==commander的preAction
    before?:(thisCommand:Command,actionCommand:Command)=>void,
    // 在根命令执行后执行==commander的postAction
    after?:(thisCommand:Command,actionCommand:Command)=>void, 
    // 在工程的package.json的依赖中查找匹配的include的包名称，然后自动加载其cliDir目录下的命令
    // 例如：include="^myapp"，则会自动加载包名以myapp开头的包中的cli目录下的命令
    include?:string | RegExp | string[] | RegExp[],
    // 排除一些包名称
    exclude?:string | RegExp | string[] | RegExp[],
    // 指定命令声明在包的哪一个目录，cli所在的目录,默认值是cli,要遍历该目录下的所有js文件作为命令导出
    cliDir?:string            
}

```


## 注册命令

在创建`FlexCli`实例时，通过`register`方法注册命令。

::: code-group


```js [cli.js]

const { FlexCli } = require("flexcli");
const myCommand = require("./myCommand");   // [!code ++]
const cli = new FlexCli({
    // 此处是配置参数
});
cli.register(myCommand)               // [!code ++]
cli.run();      // 执行命令行应用


```

```js [myCommand.js]


const {FlexCommand} = require("flexcli");

/**
 * @param {import('flexcli').FlexCli} cli
 */
module.exports = (cli)=>{
    // 在此创建FlexCommand实例并返回
    // 详见下一节创建命令介绍
}

```

:::

- 通过`register`方法注册的命令相当于是该命令行的公共命令。

## 动态注册命令

除了在创建`FlexCli`实例时显式注册命令外，还可以将命令声明在其他包中，这些包中声明的命令被安装后会自动合并到命令行应用。

- **第1步：声明搜索命令的规则**

在创建`FlexCli`实例时通过`include`和`exclude`参数指定命令搜索规则。

```js{4,5}
const { FlexCli } = require("flexcli");
const myCommand = require("./myCommand");   // [!code ++]
const cli = new FlexCli({
    name:"flexcli",
    include: /^\@flex\//,           
    cliDir:"cli"           // 此为默认值，可以不写
});
cli.register(myCommand)               // [!code ++]
cli.run();      // 执行命令行应用

```
- 以上`include: /^\@flex\// `的意思是，运行`flexcli`时，会在当前所在的工程的依赖中查找包名以`@flex/`开头的包，然后自动加载其`cli`目录下的命令并进行合并注册。

- **第2步：声明命令**

接下来，在你的其他包中创建一个`cli`目录，然后在里面创建命令文件。

例如，你的是一个`npm`包，包名是`@flex/core`，那么你的目录结构如下：

```shell{4,5,6}
myapp
    packages 
        core
            cli
                dev.js
                test.js
                ...
            index.js
            package.json

```

按照配置，应在`core/cli`下创建命令`dev.js`和`test.js`，当运行`flexcli`时，这两个命令会自动合并到命令行应用中。


## 示例

::: code-group

```js [cli.js]
const { FlexCli } = require("flexcli") 

const cli = new FlexCli({
    name: "flexcli",
    title: ["Flexcli commandline tool      Version: {}","1.0.1"],
    version: "1.0.0",
    description: "flexcli is a cli tool for creating cli tools",
    include: /^\@flex\//, 
    // 显示logo
    logo: String.raw`
        ____   ____                  __            
        \   \ /   /___   ___________|  | _______   
         \   Y   /  _ \_/ __ \_  __ \  |/ /\__  \  
          \     (  <_> )  ___/|  | \/    <  / __ \_
           \___/ \____/ \___  >__|  |__|_ \(____  /
                            \/           \/     \/`, 
})
```

```json [package.json]
{
    "name":"flexcli",
    "main":"src/cli.js",
    "bin":{
        "flexcli":"src/cli.js"
    }

}
```
:::

执行`flexcli`命令，显示如下：
 
![图片](/cli_demo.png)
