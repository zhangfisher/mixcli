
const { MixedCommand } = require('mixed-cli');

/**
 * @param {import('mixed-cli').MixedCli} cli
 */
 module.exports = (cli)=>{        
    const stopCommand = new MixedCommand();
    stopCommand
        .name("stop")
        .description("停止应用")
        .option("-d, --delay <time>","延迟时间",1000)
        .action(()=>{
            console.log("pause app")
        })
    return stopCommand
 }