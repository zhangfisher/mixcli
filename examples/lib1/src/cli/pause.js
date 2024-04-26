
const { MixCommand } = require('mixcli');

/**
 * @param {import('mixcli').mixcli} cli
 */
 module.exports = (cli)=>{        
    const pauseCommand = new MixCommand();
    pauseCommand
        .name("pause")
        .description("暂停应用1")
        .option("-t, -time <time>","暂停时间")
        .action(()=>{
            console.log("pause app")
        })
    return pauseCommand
 }

  