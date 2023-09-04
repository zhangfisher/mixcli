
const { FlexCommand } = require('flexcli');

/**
 * @param {import('flexcli').FlexCli} cli
 */
 module.exports = (cli)=>{        
    const pauseCommand = new FlexCommand();
    pauseCommand
        .name("pause")
        .description("暂停应用")
        .option("-t, -time <time>","暂停时间")
        .action(()=>{
            console.log("pause app")
        })
    
 }