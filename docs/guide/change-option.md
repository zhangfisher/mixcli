# 修改选项

允许动态修改已经存在的命令的选项：

```js

const { MixedCommand } = require('mixed-cli');

/**
 * @param {import('mixed-cli').MixedCli} cli
 */
module.exports = (cli)=>{    
    cli.find("init").then(initCommand=>{
        // 增加一个选项
        initCommand.option("-d,--debug","调试开关")
        // 修改现成的选项
        let templateOption = initCommand.options.find(option=>option.name()=='template')
        templateOption.choices(["nodejs","react","vue"])

        // 可对选项进行修改，可参阅commander的Option对象
        // templateOption.default(params.default,params.defaultDescription)         
        //  .conflicts()
        // .env()
        // .argParser()
        // .hideHelp()
        // .makeOptionMandatory()
        // .implies() 
 
    })
    
}

```