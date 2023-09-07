const { Command } = require('commander');


/**
 * @param {import('mixed-cli').MixedCli} cli
 */
module.exports = (cli)=>{    
    const devCommand = cli.get("create")
    if(devCommand){
        const command = new Command();
        command
            .name('app')
            .description('在开发模式下运行应用') 

        devCommand.addCommand(command)
    }    

    cli.extend("create",command)

}
