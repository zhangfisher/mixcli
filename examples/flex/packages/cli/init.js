
const { MixCommand } = require('mixcli');

/**
 * @param {import('mixcli').MixedCli} cli
 */
module.exports = (cli)=>{                
    const initCommand = new MixCommand("init");
    initCommand
        .description("创建应用")         
        .option("-t, --type <type>", "应用类型",{choices:["vue","react","angular"]})
        .action((options)=>{            
            console.log("[cli] Run init:",options.type)
        })
    return initCommand
} 
    