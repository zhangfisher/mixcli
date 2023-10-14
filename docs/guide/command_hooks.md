# 命令钩子

`MixedCommand`继承自`Commander`的`Command`对象,其提供了`preAction`和`postAction`两个钩子函数，用来在执行命令前后执行一些操作。

在其基础上,`MixedCli`增加了`before`和`after`两个钩子,用来实现在`action`命令函数前后执行一些操作。

其与`preAction`和`postAction`两个钩子函数的差别在于执行时机的不同和功能的不同,主要区别在于:

- `before`和`after`钩子函数可以读取到最终的`args`和`options`参数。
- 支持子命令的`before`和`after`钩子函数。即在执行子命令前后执行一些操作。

## 基本用法


```ts

const { MixedCommand } = require('mixed-cli');
const path = require("node:path")
const DbProviders = ["sqlite","mysql","sqlserver","postgresql"]

/**
 * @param {import('mixed-cli').MixedCli} cli
 */
module.exports = (cli)=>{    
    const command = new MixedCommand();
    command
        .name('init')
        .description('初始化应用') 
        .option("--entry","指定入口",{prompt:false})     
        .before(async ({command,args,options})=>{
            console.log("before init",options)
        })
        .after(async ({value,command,args,options})=>{
            // 此处的value是action命令函数的返回值,即100
        })
        .action((options)=>{
            return 100
        })

```

- `before`钩子在执行`action`命令函数之前执行，可以用来做一些准备工作。在此钩子函数中可以读取到`options`参数。
- `after`钩子在执行`action`命令函数之后执行，可以用来做一些清理工作。 
- `before`钩子函数的签名为`({command,args,options})=>Promise<void>`。传入的`command`指的是触发的命令对象.
- `after`钩子函数的签名为`({command,args,options,value})=>Promise<void>`。传入的`value`指的是`action`命令函数的返回值。


## 子命令的钩子函数

当定义了子命令时,`before`和`after`钩子函数默认情况下,在执行子命令时也会执行其父命令的`before`和`after`钩子函数.

利用此特性,我们就可以在父命令中执行一些所有子命令都需要执行的公共操作和公共配置.

```ts
    const command = new MixedCommand();
    command
        .name('init')  
        // 适用于本命令和所有子命令的选项
        .option("--entry","指定入口")
        .option("--template","模板")
        .before(async ({command,args,options})=>{
            console.log("before init")
        })
        .action((options)=>{
            return 1
        })
        .after(async ({value,command,args,options})=>{
            // 此处的value是action命令函数的返回值,即1
            console.log("after init:",value)
        })
    // 定义子命令
    const initVueCommand = new MixedCommand();
    initVueCommand
        .name('vue')  
        .option("--port","端口")
        .before(async ({command,args,options})=>{
            console.log("before init vue")
        })
        .action((options)=>{
            return 100
        })
        .after(async ({value,command,args,options})=>{
             console.log("after init vue:",value)
        })

    command.addCommand(initVueCommand) 
```

当执行`init vue`命令时,会依次执行:

```shell
before init
    before init vue
    after init vue
after init
```

也就是说,执行命令时,**所有祖先的`before`和`after`钩子函数都会被执行.**

如果您想禁止这种行为,则需要在声明`before`和`after`钩子函数传入`false`即可.


```ts{9,15}
    const command = new MixedCommand();
    command
        .name('init')  
        // 适用于本命令和所有子命令的选项
        .option("--entry","指定入口")
        .option("--template","模板")
        .before(async ({command,args,options})=>{
            console.log("before init")
        },false)
        .action((options)=>{
            return 1
        })
        .after(async ({value,command,args,options})=>{
            // 此处的value是action命令函数的返回值,即1
            console.log("after init:",value)
        },false)

```        






