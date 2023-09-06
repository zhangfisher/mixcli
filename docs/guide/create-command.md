# 创建命令

`FlexCli`基于`commander`，因此可以使用`commander`的所有功能，在`commander`的基础上作了增强，提供了更加友好的命令行开发体验。


## 编写命令


每一个`FlexCli`命令原则上建议一个命令对应一个`js`文件,且该`js`文件导出一个返回`FlexCommand`或`FlexCommand[]`的函数，如下所示：

```js

const {FlexCommand} = require("flexcli");

/**
 * @param {import('flexcli').FlexCli} cli
 */
module.exports = (cli)=>{
    const devCommand = new FlexCommand();
    devCommand
        .name("dev")
        .arguments("<name>","项目名称")
        .option("-p,--port <port>","指定端口号",3000)                      
        .option("-d,--debug" ,"调试模式",{ default:true,prompt:true })      
        .option("-h,--host <host>","指定主机名",{default:"localhost",prompt:true})                         
        .action(async (name,options){
            // 此处是命令的具体实现
        })

    // 返回要创建的命令
    return devCommand;
}

```

- **注意:** `FlexCommand`继承自`commander.Command`，因此可以使用`commander`的所有功能,`FlexCommand.option`用来声明命令选项，其参数与`commander.Command.option`基本一致，并做了少量扩展。


## 命令选项

`FlexCommand`继承自`commander.Command`，声明命令选项的方式与`commander`一致。

为命令增加选项的方法，在`commander`中提供了两种方式：

```js
program 
    // 无choices 
    .option('-d, --drink <size>', 'drink size')    
    // 需要使用choices时     
    .addOption(new Option('-d, --drink <size>', 'drink size').choices(['small', 'medium', 'large']))
```

以上两种方式同样支持，详见[commander](https://github.com/tj/commander.js)介绍。

而在`FlexCli`中，可以简化为直接这样定义：

```js
const { FlexCommand } = require("flexcli");
const devCommand = new FlexCommand();
    devCommand.option("-m,--mode <mode>","指定模式",{choices:["development","production","test","debug"]})
```

`FlexCommand`继承自`commander.Command`，因此可以使用`commander`的所有功能,`FlexCommand.option`用来声明命令选项，其参数与`commander.Command.option`一致，但是`FlexCommand.option`提供了更加友好的方式来定义命令选项。

```ts
class FlexCommand extends Command{
    option(flags: string, description?: string | undefined,defaultValue?:any ): this
    option(flags: string, description?: string | undefined,options?:FlexOptionParams ): this{
}

```

`FlexOptionParams`定义如下：

```ts
export interface FlexOptionParams extends IPromptableOptions{
    required?: boolean;                         // A value must be supplied when the option is specified.
    optional?: boolean;                         // A value is optional when the option is specified.
    default?:PromptParamDefaultValue            // 默认值
    choices?:string[]                           // 选项值的可选值
    prompt?:InputPromptParam                    // 交互提示信息配置
    validate?:(value: any) => boolean
    defaultDescription?:string          // 默认值的描述    
    conflicts?:string | string[]
    env?:string
    argParser?:<T>(value: string, previous: T) => T 
    hideHelp?:boolean
    mandatory?: boolean 
    implies?:{[key:string]:any}  
}

```

**`FlexCommand`的增强体现在：**

- 增加了参数`prompt`，用来**控制命令选项使用哪一种交互提示信息。**
- 重载了`Command`的`option`方法，通过`FlexOptionParams`参数来声明所有命令选项的配置参数。

## 扩展命令

在开发命令行应用，除了可以新增加命令外，还可以扩展已有的命令，比如：

### 修改命令选项

```js{5}
const {FlexCommand} = require("flexcli");
module.exports = (cli)=>{    
    cli.find("dev").then((devCommand)=>{   
        // 获取到当前命令的选项
        const option = devCommand.options.find((option)=>option.name() === "mode");
        // 修改命令选项
        option.required = true;
        option.choices = ["development","production","test","debug"];
    }) 
}

```



### 增加命令选项


```js{4}
const {FlexCommand} = require("flexcli");
module.exports = (cli)=>{    
    cli.find("dev").then((devCommand)=>{   
       devCommand.option("-p,--port <port>","指定端口号",3000)         
    }) 
}

```

### 增加子命令

```js

const {FlexCommand} = require("flexcli");
module.exports = (cli)=>{    
    // 1. 获取已经存在的命令
    cli.find("dev").then((devCommand)=>{ 
        const appCommand = new FlexCommand();
        appCommand
            .name("app")
            .arguments("<name>","项目名称")
            .option("-p,--port <port>","指定端口号",3000)
            .action(async (name,options)=>{
                // 此处是命令的具体实现
            })        
        devCommand.addCommand(appCommand);
    })
 
}

```

## 获取命令

在进行命令扩展时，需要获取已经存在的命令，`FlexCli`提供了两种方式来获取命令：

- `FlexCli.find(命令名称)`：以异步的方式来获取命令。
- `FlexCli.get(命令名称)`：以同步命令名称来获取命令，如果命令不存在，则抛出`undefined`。


### 命令名称

`FlexCli.find(命令名称)`或`FlexCli.get(命令名称)`中的命令名称支持获取到子命令。

比如，有如下命令：

```js
const {FlexCommand} = require("flexcli");
module.exports = (cli)=>{    
    cli.get("dev")      // 获取dev命令对象
    cli.get("dev.app")  // 获取dev命令的子命令app对象
}
```

`find`和`get`方法的区别在于：

- `find`是异步方法，返回一个`Promise`,而`get`是同步方法
- 当`FlexCli`在检索`include`参数指定的扩展包并加裁时，由于扩展包加载顺序的问题，`get`方法获取命令时要求命令必须是已经前置加载的。而`find`方法则不受此限制。所以大部份情况下，建议采用`find`方法来获取命令。









