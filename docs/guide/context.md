# 共享上下文

在构建`MixCli`时可以传一个`context`，用来为分散到各个包中的命令提供共享数据访问。


```js{9}
const { MixCli } = require("mixcli") 

const cli = new MixCli({
    name: "mixcli",
    title: ["MixCli commandline tool      Version: {}","1.0.1"],
    version: "1.0.0",
    description: "mixcli is a cli tool for creating cli tools",
    include: /^\@flex\//, 
    context:{a:1}     // [!code ++]
});

```

然后在命令中可以访问:

```js{3} 
const {MixCommand} = require("mixcli");
module.exports = (cli)=>{    
    console.log(cli.context.a)  // ==> 1
}
```