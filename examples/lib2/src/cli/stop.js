
const { FlexCommand } = require('flexcli');

/**
 * @param {import('flexcli').FlexCli} cli
 */
 module.exports = (cli)=>{        
    const stopCommand = new FlexCommand();
    stopCommand
        .name("stop")
        .description("停止应用")
        .option("-d, --delay <time>","延迟时间",1000)
        .action(()=>{
            console.log("pause app")
        })
    return stopCommand
 }