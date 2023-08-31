const { Command } = require('commander');


/**
 * @param {import('flexcli').FlexCli} cli
 */
module.exports = (cli)=>{    
    const command = new Command();
    command
        .name('dev')
        .description('在开发模式下运行应用') 
    return command
}
