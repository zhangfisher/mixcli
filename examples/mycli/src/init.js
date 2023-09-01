const { Command } = require('commander');

/**
 * @param {import('flexcli').FlexCli} cli
 */
module.exports = (cli)=>{    
    const command = new Command();
    command
        .name('init')
        .description('初始化应用') 
        .action(()=>{
            console.log("init")
        })
    return command
}

 