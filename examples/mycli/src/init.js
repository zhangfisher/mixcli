const { MixedCommand } = require('mixed-cli');

/**
 * @param {import('mixed-cli').MixedCli} cli
 */
module.exports = (cli)=>{    
    const command = new MixedCommand();
    command
        .name('init')
        .description('初始化应用') 
        .option("-t,--template","应用模板")
        .action(()=>{
            console.log("init")
        })
    return command
}

 