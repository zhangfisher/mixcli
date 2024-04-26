
const { MixCommand } = require('mixcli');

/**
 * @param {import('mixcli').MixedCli} cli
 */
 module.exports = (cli)=>{        
    const stopCommand = new MixCommand();
    stopCommand
        .name("stop")
        .description("停止应用")
        .option("-d, --delay <time>","延迟时间",1000)
        .action(()=>{
            console.log("pause app")
        })
    return stopCommand
 }