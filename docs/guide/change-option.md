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
        // 或者
        let templateOption = initCommand.getOption('template')

        // 生成全新的选择项

        option.choices(["development","production","test","debug"])
        // 传入prompts库选择项  {title,value,description,disabled,}
        option.choices([
            { title:"开发",value:"development",description:"开发模式下"},
            { title:"生产",value:"production"},
            { title:"测试",value:"test"},
            { title:"调试",value:"debug", disabled: true }])
        
        option.addChoice("development")
        option.addChoice({title:'测试',value:"test"})
        option.clearChoice()
        option.removeChoice("test")

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

- 可以使用`commander`的`Option API`对`option`进行修改
- `choice`比较特殊，可以使用`.choices`声明全新的`choices`，也可以使用`addChoice`，`removeChoice`，`clearChoice`进行修改