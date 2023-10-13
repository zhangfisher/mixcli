# 命令钩子

命令可以指定`before`和`after`两个钩子.


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
        .before(async (options)=>{
            console.log("before init",options)
        })
        .after(async ()=>{
            
        })
        .action((options)=>{
        })

```


- `before`钩子在执行`action`命令函数之前执行，可以用来做一些准备工作。在此钩子函数中可以读取到`options`参数。
- `after`钩子在执行`action`命令函数之后执行，可以用来做一些清理工作。 
