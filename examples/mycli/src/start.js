const { MixCommand } = require('mixcli');



/**
 * @param {import('mixcli').MixCli} cli
 */
module.exports = (cli)=>{    
    const command = new MixCommand();
    command
        .name('start')
        .description('运行应用')
        .option("-c, --config <config>", "指定tsoa配置文件")
        .action(()=>{
            console.log("Run start")
        })
    return command
}