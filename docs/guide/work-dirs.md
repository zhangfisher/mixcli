# 工作目录

一般执行命令时均是以`当前目录`作为执行起点。

`MixedCli`允许在命令行通过`--work-dirs`来指定命令的执行时的当前目录。

- 当指定`--work-dirs`时，会切换到`--work-dirs`指定的目录，然后执行命令。
- `--work-dirs`允许指定多个值，多个值之间用`,`分隔，然后依次执行。
- `--work-dirs`的值可以是相对路径，也可以是绝对路径。
- 执行完成后会切换回原来的目录。


**示例:**

开发了一个`init`命令执行一些初始化操作。

::: code-group

```js [cli.js]

const { MixedCli } = require("mixed-cli");
const cli = new MixedCli({
    name:"mycli"
    // 此处是配置参数
});

cli.run();      // 执行命令行应用

```

```js [init.js]

const {MixedCommand} = require("mixed-cli");
module.exports = (cli)=>{    
    const initCommand = new MixedCommand({
        name:"init",
        description:"初始化项目", 
        action:async (options)=>{
            console.log("init")
            console.log("cwd=",process.cwd());
        }
    })
   return initCommand
}

```

:::

上面的`ini`会在当前目录执行初始化操作，我们可以通过指定`--work-dirs`来让该命令在其他多个目录执行。

```bash

> mycli init --work-dirs ./dir1,./dir2,./dir3

```

执行以上命令相当于在`./dir1`、`./dir2`、`./dir3`三个目录下执行`init`命令,显示如下：

```bash

init 
cwd= D:\dir1
init
cwd= D:\dir2
init
cwd= D:\dir3

```

**说明**

- `--work-dirs`的值可以是相对路径，也可以是绝对路径。
- 执行完成后会切换回原来的目录。
- `--work-dirs`指定的目录必须存在，否则会忽略该目录。
- 本功能用在当某个命令需要在多个目录下执行时特别有用。




 