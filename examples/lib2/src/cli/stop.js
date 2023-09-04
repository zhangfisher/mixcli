
const { FlexCommand } = require('flexcli');

/**
 * @param {import('flexcli').FlexCli} cli
 */
 module.exports = (cli)=>{        
    const pauseCommand = new FlexCommand();
    pauseCommand
        .name("stop")
        .description("停止应用")
        .option("-d, --delay <time>","延迟时间",1000)
        .action(()=>{
            console.log("pause app")
        })
    
 }