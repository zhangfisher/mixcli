
const { MixedCommand } = require('mixed-cli');

/**
 * @param {import('mixed-cli').MixedCli} cli
 */
module.exports = (cli)=>{                
    const initCommand = new MixedCommand("init");
    initCommand
        .description("创建应用")         
        .option("-t, --type <type>", "应用类型",{choices:["vue","react","angular"]})
        .action((options)=>{            
            console.log("Run init:",options.type)
        })
    return initCommand
} 
    