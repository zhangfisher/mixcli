/**
 * 
 * 动态更新已经存在的命令
 * 
 */
const { MixCommand } = require('mixcli');

/**
 * @param {import('mixcli').mixcli} cli
 */
module.exports = (cli)=>{    
    cli.find("init").then(initCommand=>{
        // 增加一个选项
        initCommand.option("-d,--debug","调试开关")
        // 修改现成的选项
        let templateOption = initCommand.options.find(option=>option.name()=='template')
        templateOption.choices(["nodejs","react","vue"])

        initCommand.action(async ({value,options,args})=>{
            console.log(`[Init] args=${JSON.stringify(args)} options=${JSON.stringify(options)} value=${value}`)
            return 1
        },{at:'append',id:"1"})

        initCommand.action(async ({value,options,args})=>{
            console.log(`[Init] args=${JSON.stringify(args)} options=${JSON.stringify(options)} value=${value}`)
            return 2
        },{at:'append',id:"2"})

        initCommand.action(async ({value,options,args})=>{
            console.log(`[Init] args=${JSON.stringify(args)} options=${JSON.stringify(options)} value=${value}`)
            return 3
        },{at:'append',id:"3"})
    })
    
}

 