/**
 * 
 * 动态更新已经存在的命令
 * 
 */
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


    })
    
}

 