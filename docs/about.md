# 关于

开发`nodejs`命令行应用一般会涉及到以下几个方面：

- 使用[commander](https://github.com/tj/commander.js)进行命令行参数解析
- 使用[prompts](https://github.com/terkelg/prompts)、[inquirer](https://github.com/SBoudrias/Inquirer.js),[enquirer](https://github.com/enquirer/enquirer)等库来提供交互输入提示。
- 使用[chalk](https://github.com/chalk/chalk)来进行命令行输出的颜色控制。

`MixCli`基于`commander`、`prompts`和`logsets`，提供命令行解析、自动交互提示以及终端界面增强等功能。

**主要特性：**

- 由[commander](https://github.com/tj/commander.js)提供命令行解析
- 由[prompts](https://github.com/terkelg/prompts)提供交互提示
- [logsets](https://github.com/terkelg/prompts)提供终端输出增强组件
- 自动为命令行选项推断生成交互提示
- 自动搜索当前依赖下符合条件的命令进行合并，适合于`monorepo`项目开发

## 自动生成交互提示

**为命令行命令选项推断生成交互提示**

当我们使用`commander`开始命令行时，一般会这样写：

```js
const { program } = require('commander');
program 
    .option("-p,--port <port>","指定端口号",3000)                      
    .option("-d,--debug" ,"调试模式",false)      
    .option("-h,--host <host>","指定主机名")      
    .option("-m,--mode <mode>","指定模式") // 可选值"development","production","test","debug"
    .action((options)=>{
      console.log(options)
    })
program.parse();
```

以上代码中`--host`和`--mode`是必填项，而`--port`和`--debug`是可选项。
正常情况下，如果用户没有指定`--host`和`--mode`，则只会简单地提示出错退出。

- 我们希望在用户没有指定`--host`和`--mode`时，能够自动交互提示用户输入`--host`和`--mode`的值。
- 如果选择指定了`choices`，则希望能够自动提示用户选择`choices`中的值。
- 如果是`boolean`值，则希望能够自动提示用户选择`yes`或`no`。

总之，我们希望交互体验更加友好！

而`MixCli`的作用就是为**命令行应用的选项自动推断生成交互提示**，当用户没有指定`--host`和`--mode`选项时,按照一定的推断规则(根据选项的值、choices等)，会自动使用`prompts`提供的交互提示，提示引导用户输入`--host`和`--mode`选项的值。

##  多包命令混合

**搜索当前依赖下符合条件包的命令进行混合**

在开发基于`monorepo`的应用时，我们需要配套开发一个`cli`应用，一般我们会单独创建一个包位于`packages/cli`，然后在`package.json`中配置`bin`字段，然后在`bin`目录下创建一个`cli.js`文件，然后在`cli.js`中使用`commander`来编写命令行应用。

```json
{
  "name": "@myapp/cli",
  "version": "1.0.0",
  "bin": {
    "myapp": "bin/cli.js"
  }
}
```

然后，当安装了`@myapp/cli`后，就可以在命令行中使用`myapp`命令了。

现在问题来，假设我们在`@myapp`这个`monorepo`工程中，还存在`@myapp/core`、`@myapp/app`、`@myapp/vue`、`@myapp/react`等包，
并且每个包均提供了相应的命令行命令,我们想实现：

- 只安装`@myapp/cli`就可以启用所有`@myapp/*`包提供的命令行。
- 各个包的命令声明在各自的包中，而不是在`@myapp/cli`中。比如`@myapp/vue`包的命令声明在`@myapp/vue`包中，而不是在`@myapp/cli`中。
- 能按安装的`@myapp/*`依赖自动扩充`@myapp/cli`的命令。

**举例：**

- `packages/vue/cli/x.js`中声明了一个`x`命令，
- `packages/react/cli/y.js`中声明了一个`y`命令，

当一个应用安装了`@myapp/vue`后，就可以在命令行中使用`myapp x`命令了。
当一个应用安装了`@myapp/react`后，就可以在命令行中使用`myapp y`命令了。

`MixCli`可以让您开发一个`cli`应用，当安装了`@myapp/cli`后，启动时可以自动搜索当前工程下符合条件的依赖下的命令进行混合，提供完整动态的命令行。












 