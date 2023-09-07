
const { MixedCommand } = require('mixed-cli');

/**
 * @param {import('mixed-cli').MixedCli} cli
 */
 module.exports = (cli)=>{        
    const pauseCommand = new MixedCommand();
    pauseCommand
        .name("pause")
        .description("暂停应用")
        .option("-t, -time <time>","暂停时间")
        .action(()=>{
            console.log("pause app")
        })
    return pauseCommand
 }