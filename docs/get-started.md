# 快速入门

`MixedCli`是一个命令行应用开发框架，其主要是对`commander`和`prompts`的封装，提供了更加友好的命令行开发体验。


## 第1步：创建工程

以一个典型的`monorepo`为例开始：

```shell

flexapp
  packages
     cli     
     core
     vue
     react
```

示例工程名为`flexapp`，工程中的包名分别是`@flexapp/core`、`@flexapp/cli`、`@flexapp/vue`、`@flexapp/react`。



## 第2步：创建命令行应用

`@flexapp/cli`是命令行应用，对外提供`flexapp`的命令行工具。


### 1. 安装依赖

::: code-group

```bash [npm]
npm install mixed-cli
```

```bash [pnpm]
pnpm add mixed-cli
```

```bash [yarn]
yarn add mixed-cli
```
:::

### 2. 创建`cli.js`

在`@flexapp/cli`包中创建`cli.js`文件，内容如下：

```
flexapp
  pacakges
    cli
      cli.js
      init.js
      package.json

```

主要内容如下：


::: code-group

```ts [cli.js]
const { outputStr,MixedCli } = require("mixed-cli") 
const initCommand = require("./init")

const cli = new MixedCli({
    name: "flexapp",
    version: "1.0.0",
    include: /^\@flexapp\//, 
    // 显示logo
    logo: String.raw`
        ____   ____                  __            
        \   \ /   /___   ___________|  | _______   
         \   Y   /  _ \_/ __ \_  __ \  |/ /\__  \  
          \     (  <_> )  ___/|  | \/    <  / __ \_
           \___/ \____/ \___  >__|  |__|_ \(____  /
                            \/           \/     \/`, 
})
cli.register(initCommand)
cli.run()

```

```json [package.json]
{
  "name": "@flexapp/cli",
  "version": "1.0.0",
  "bin": {
    "flexapp": "cli.js"
  }
}
```

:::

`@flexapp/cli`仅仅是一个命令行的入口：

- **重点：**`include: /^\@flexapp\// `的意思是告诉`mixed-cli`,当执行`flexapp`命令时，会在当前工程中搜索以`@flexapp/`开头的包，然后包中声明在`cli`文件夹下的所有命令被合并到`flexapp`命令中。
- `@flexapp/cli`中使用`cli.register(iniCommand)`，注册一个通用的`init`命令，该命令的实现在`init.js`中。 一般可以在此工程提供一些通用命令,而其他的命令声明逻辑在分别在`@flexapp/*/cli/*.js`等包中实现。


## 第3步: 创建命令

从上面可以看到`@flexapp/cli`非常简单，主要是一些通用的命令和命令行的入口。而真正的命令声明在其他的包中，比如`@flexapp/vue`、`@flexapp/react`等包中。

然后接下来，我们在`@flexapp/vue`中创建一个`dev`命令，用于启用`vue`项目。

```bash{11}
flexapp
  pacakges
    cli
        cli.js
        dev.js
        package.json
    vue
        src
            index.ts
            cli
                dev.js      // dev命令的实现
        pacakge.json

```

接下来我们编写`dev.js`文件，内容如下：

::: code-group

```js [vue/src/cli/dev.js]

const { MixedCommand } = require('mixed-cli');

/**
 * @param {import('mixed-cli').MixedCli} cli
 */
module.exports = (cli)=>{                

    const devCommand = new MixedCommand();
    devCommand
        .name('dev')
        .description("以开发模式启动应用")      // 未指定默认值,自动使用text类型提供                       
        .option("-p,--port <port>","指定端口号",3000)                      
        .option("-d,--debug" ,"调试模式",{ default:true,prompt:true })      
        .option("-h,--host <host>","指定主机名",{default:"localhost",prompt:true})                         
        .option("-e,--env [value]","环境变量",{ prompt:false })                                   
        .option("-m,--mode <mode>","指定模式",{choices:["development","production","test","debug"]})
        .option("-f,--framework [value]","开发框架",{choices:[
            {title:"vue",value:1},
            {title:"react",value:2,description:"默认"},
            {title:"angular",value:3}
        ]})
        .option("-o,--open","自动打开浏览器",{prompt:{          // 自定义提示
            type:"toggle",
            message:"是否自动打开浏览器？",
        }})
        .action((options)=>{            
            console.log("run dev")
        })

    return devCommand
} 
    
   
```

```json [vue/package.json]

{
  "name": "@flexapp/vue",
  "version": "1.0.0",
  "main": "index.js",
  "dependencies": {
    "mixed-cli": "^1.0.0"
  }
}
```
:::


- 在`src/cli`目录下创建`dev.js`文件，用于声明`dev`命令。`cli`目录下的所有`js`文件会被自动加载,每个文件均导出一个函数，该函数需要返回一个或多个`MixedCommand`实例。`cli`目录是一个默认的约定目录，可以通过`cli.cliDir`参数修改。
- 创建`MixedCommand`实例，用于声明命令。`MixedCommand`继承自`commander`的`Command`类，因此可以使用`commander`的所有特性。
- `package.json`只需要将`mixed-cli`添加为依赖即可。
- 同样地，我们可以在`@flexapp/react`,`@flexapp/app`等包中创建其他的命令。

## 第4步: 使用命令

 我们在`flexapp`应用中开发。

- **安装`@flexapp/cli`包**

::: code-group

```shell [npm]
npm install @flexapp/cli @flexapp/vue
```

```shell [pnpm]
pnpm add @flexapp/cli @flexapp/vue
```

```shell [yarn]
yarn add @flexapp/cli @flexapp/vue
```
:::

安装`@flexapp/cli`包后，就可以在命令行中使用`flexapp`和`flexapp init`命令了。

此时执行一下`flexapp`命令，会看到如下输出：

```shell{15}
____   ____                  __
\   \ /   /___   ___________|  | _______
 \   Y   /  _ \_/ __ \_  __ \  |/ /\__  \
  \     (  <_> )  ___/|  | \/    <  / __ \_
   \___/ \____/ \___  >__|  |__|_ \(____  /
                    \/           \/     \/
版本号:1.0.0 
Usage: flexapp [options] [command]

Options:
  -v, --version      当前版本号
  -h, --help         显示帮助

Commands:
  init [options]    初始化应用  // 只有这个命令 
```


- **接下来我们安装`@flexapp/vue`**

::: code-group

```shell [npm]
npm install @flexapp/vue @flexapp/vue
```

```shell [pnpm]
pnpm add @flexapp/vue @flexapp/vue
```

```shell [yarn]
yarn add @flexapp/vue @flexapp/vue
```
:::
 
此时再执行一下`flexapp`命令，会看到如下输出：

```bash
____   ____                  __
\   \ /   /___   ___________|  | _______
 \   Y   /  _ \_/ __ \_  __ \  |/ /\__  \
  \     (  <_> )  ___/|  | \/    <  / __ \_
   \___/ \____/ \___  >__|  |__|_ \(____  /
                    \/           \/     \/
版本号:1.0.0 
Usage: flexapp [options] [command]

Options:
  -v, --version      当前版本号
  -h, --help         显示帮助

Commands:
  init [options]    初始化应用  
  # dev命令是由@flexapp/vue包提供的
  dev [options]     以开发模式启动应用  //   [!code ++]
```


## 第5步: 自动推断交互提示

在上面`dev`命令中，共指定了`6`个选项，当执行`flexapp dev`命令时, 会根据配置自动交互引导用户输入选项，如下：

![图片](/images/dev_cmd.png)

- 命令行的交互体验与使用`commander`时完全一样
- 仅当选项未指定默认值或满足一定条件时，才会根据一定的规则自动推断交互提示类型。详见[自动推断交互提示](./guide/infer-prompt.md)
- `MixedCli`使用`prompts`来实现交互提示，因此支持`prompts`的所有交互类型特性。详见[prompts](https://github.com/terkelg/prompts)


## 小结

- `MixedCli`是一个基于`commander`的命令行工具开发框架，提供了一套命令行开发的最佳实践。
- `MixedCli`能对所有命令行选项自动推断交互提示类型，当用户没有输入选项时，会自动引导用户输入选项，提供友好的用户体验。
- `MixedCli`可以在当前工程自动搜索满足条件的包下声明的命令进行合并，从而实现扩展命令的目的。此特性可以保持@flexapp/cli包的精简和稳定，给用户一致的体验。
