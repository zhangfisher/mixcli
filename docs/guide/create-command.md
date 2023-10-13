# 创建命令

`MixedCli`基于`commander`，因此可以使用`commander`的所有功能，在`commander`的基础上作了增强，提供了更加友好的命令行开发体验。


## 创建命令

每一个`MixedCli`命令原则上建议一个命令对应一个`js`文件,且该`js`文件导出一个返回`MixedCommand`或`MixedCommand[]`的函数，如下所示：

```js

const {MixedCommand} = require("mixed-cli");

/**
 * @param {import('mixed-cli').MixedCli} cli
 */
module.exports = (cli)=>{
    const devCommand = new MixedCommand();
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

- **注意:** `MixedCommand`继承自`commander.Command`，因此可以使用`commander`的所有功能,`MixedCommand.option`用来声明命令选项，其参数与`commander.Command.option`基本一致，并做了少量扩展。


## 命令选项

`MixedCommand`继承自`commander.Command`，声明命令选项的方式与`commander`一致。

为命令增加选项的方法，在`commander`中提供了两种方式：

```js
program 
    // 无choices 
    .option('-d, --drink <size>', 'drink size')    
    // 需要使用choices时     
    .addOption(new Option('-d, --drink <size>', 'drink size').choices(['small', 'medium', 'large']))
```

以上两种方式同样支持，详见[commander](https://github.com/tj/commander.js)介绍。

而在`MixedCli`中，可以简化为直接这样定义：

```js
const { MixedCommand } = require("mixed-cli");
const devCommand = new MixedCommand();
    devCommand.option("-m,--mode <mode>","指定模式",{choices:["development","production","test","debug"]})
```

`MixedCommand`继承自`commander.Command`，因此可以使用`commander`的所有功能,`MixedCommand.option`用来声明命令选项，其参数与`commander.Command.option`一致，但是`MixedCommand.option`提供了更加友好的方式来定义命令选项。

```ts
class MixedCommand extends Command{
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
    //交互提示信息配置  
    prompt?:InputPromptParam                    //  [!code ++]    
    validate?:(value: any) => boolean           //  [!code ++]
    defaultDescription?:string          // 默认值的描述    
    conflicts?:string | string[]
    env?:string
    argParser?:<T>(value: string, previous: T) => T 
    hideHelp?:boolean
    mandatory?: boolean 
    implies?:{[key:string]:any}  
}

```

**`MixedCommand`的增强体现在：**

- 增加了参数`prompt`，用来**控制命令选项使用哪一种交互提示信息。**
- 重载了`Command`的`option`方法，通过`FlexOptionParams`参数来声明所有命令选项的配置参数。


## 命令函数

`MixedCommand`继承自`commander.Command`，因此可以使用`commander`的所有功能,`MixedCommand.action`用来声明命令函数，其参数与`commander.Command.action`一致，但是`MixedCommand.action`扩展支持多个命令函数。

### 基本使用

可以像`commander/Command.action`一样通过`action`方法来声明命令函数，即支持同步函数，也支持异步函数。

```ts

const {MixedCommand} = require("mixed-cli");
module.exports = (cli)=>{    
    const myCommand = new MixedCommand("init");
    myCommand
        .option("-t,--template <value>","指定模板",
            {choices:["react","vue","angular"]}
        )
        // 声明一个同步命令函数
        .action((options)=>{
            console.log("同步命令函数")
        })
        // 声明一个异步命令函数
        .action(async (options)=>{
            console.log("异步命令函数")
        })    
    })
}
```

### 命令链路

`MixedCommand.action`最大的增强在于，支持**声明多个命令函数**，形成执行链。

- **命令列表**

**`MixedCommand`内部维护了一个`action`函数数组(通过`MixedCommand.actions`可以访问)。**

当每次执行`MixedCommand.action`时，会将`action`函数添加到数组中。然后当运行命令时，会按照数组中的顺序依次执行。

这是`MixedCommand`与`commander.Command`最大的不同。

因此基于此特性，在上面的`init`命令中，事实上是定义了两个`action`函数，当执行`mycli init`时分别执行了两个`action`函数。
 
- **中断执行命令**

多次执行`MixedCommand.action`时，会创建一个`action`函数数组,这些`action`会依次顺序执行。

`action`函数可以显式返回`BREAK`来中断后续`action`的执行。

```ts
const {MixedCommand,BREAK} = require("mixed-cli");
module.exports = (cli)=>{    
    const myCommand = new MixedCommand("init");
    myCommand
        .option("-t,--template <value>","指定模板",
            {choices:["react","vue","angular"]
        }).action((options)=>{
            return BREAK        // [!code ++]
        })  
        .action((options)=>{
            // 此函数永远也会不得到执行，因此上一个action返回了BREAK
        })  
    })
}
```

- **增强模式**

除了`.action(async (arg1,arg2,options)=>{...})`的常规签名方式外，当也可以采用`增强模式`。

```ts
const { MixedCommand,BREAK } = require("mixed-cli");
module.exports = (cli)=>{    
    const myCommand = new MixedCommand("init");
    myCommand
        .option("-t,--template <value>","指定模板",
            {choices:["react","vue","angular"]
        })
        .action(async ({args,options,value,command})=>{
            // args: 命令行参数
            // options: 命令选项
            // value: 上一个命令执行的值
            // command: 当前命令对象
        })            
        },{
            at:'append' //'replace' | 'preappend' | 'append' | number  
            enhance:true
        })  
    })
}
```

- 当在`action`方法的第二个参数中传入`enhance=true`，此时代表采用增强方式来定义命令函数。
- 增强模式下，命令函数签名为`({args,options,value,command})`,其中`args`是命令行参数数组，`options`为命令选项，`value`为上一个命令的返回值，`command`指向当前命令对象。
- 启用增强模式后，可以通过`at`参数来指定创建的`action`函数在`actions`函数数组中的位置，这可以决定所声明的`action`函数的执行时机。`at`取值可以是：
    - `append`: 默认值,追加到最后面
    - `replace`: 替换所有已经注册的`action`函数
    - `preappend`: 添加到数组最前面，这意味着该`action`函数会先执行。
    - `number`: 代表该`action`函数注册到`actions`数组中的位置。

## 扩展命令

在开发命令行应用，除了可以新增加命令外，还可以**扩展已存有的命令**。

### 查找命令

在进行命令扩展时，道德需要查找存在的命令，`MixedCli`提供了两种方式来查找命令：

- `MixedCli.find(命令名称)`：以异步的方式来获取命令。
- `MixedCli.get(命令名称)`：以同步命令名称来获取命令，如果命令不存在，则抛出`undefined`。

`MixedCli.find(命令名称)`或`MixedCli.get(命令名称)`中的支持获取到子命令。

比如，有如下命令：

```js
const {MixedCommand} = require("mixed-cli");
module.exports = (cli)=>{    
    cli.get("dev")      // 获取dev命令对象
    cli.get("dev.app")  // 获取dev命令的子命令app对象
}
```

`find`和`get`方法的区别在于：

- `find`是异步方法，返回一个`Promise`,而`get`是同步方法
- 当`MixedCli`在检索`include`参数指定的扩展包并加裁时，由于扩展包加载顺序的问题，`get`方法获取命令时要求命令必须是已经前置加载的。而`find`方法则不受此限制。所以大部份情况下，建议采用`find`方法来获取命令。



### 修改命令选项

可以修改已存在的命令选项。

```js{5}
const {MixedCommand} = require("mixed-cli");
module.exports = (cli)=>{    
    cli.find("dev").then((devCommand)=>{   
        // 获取到当前命令的选项
        const option = devCommand.options.find((option)=>option.name() === "mode");
        // 修改命令选项
        option.required = true;
        // 新选取
        option.choices(["development","production","test","debug"])
        option.choices([
            { title:"开发",value:"development"},
            { title:"生产",value:"production"},
            { title:"测试",value:"test"},
            { title:"调试",value:"debug"}])
        option.addChoice("development")
        option.addChoice({title:'测试',value:"test"})
        option.clearChoice()
        option.removeChoice("test")
    }) 
}
```

更多说明见[这里](./change-option.md)

### 增加命令选项

为已存在的命令增加命令选项。

```js{4}
const {MixedCommand} = require("mixed-cli");
module.exports = (cli)=>{    
    cli.find("dev").then((devCommand)=>{   
       devCommand.option("-p,--port <port>","指定端口号",3000)         
    }) 
}

```

### 增加子命令

为已存在的命令增加子命令。

```js

const {MixedCommand} = require("mixed-cli");
module.exports = (cli)=>{    
    // 1. 获取已经存在的命令
    cli.find("dev").then((devCommand)=>{ 
        const appCommand = new MixedCommand();
        appCommand
            .name("app")
            .arguments("<name>","项目名称")
            .option("-p,--port <port>","指定端口号",3000)
            .option("-t,--template <value>","开发模板"})  
            .action(async (name,options)=>{
                // 此处是命令的具体实现
            })        
        devCommand.addCommand(appCommand);
    })
 
}

```

### 命令处理函数

当为已经存在的命令增加了选项时，一般需要增加相应的处理函数。

如果是新增加最子命令，比较简单，只需要指定`.action(fn)`即可。

如果是新增加了**命令选项**,则一般会涉及要对已有的命令的`action`进行扩展。

比如上例中，我们为`dev`增加了一个选项`-p,--port <port>`，一般情况下，我们需要为原有的`dev`命令增加相应的处理逻辑。


- **方法1：增加`before/after`函数**

在`dev`命令中增加`before`和`after`两个`hook`函数，分别在执行`dev`的`action`函数之前和之后执行。

```js
const {MixedCommand} = require("mixed-cli");
module.exports = (cli)=>{    
    cli.find("dev").then((devCommand)=>{   
       devCommand
        .option("-p,--port <port>","指定端口号",3000)   
        .before((options)=>{
            // ...
        })
        .after(()=>{
            // ...
        })
    }) 
}



```


- **方法2：扩展`action`函数**

可以利用`命令链路`的特性实现同一个命令下的多个`action`函数的执行。












