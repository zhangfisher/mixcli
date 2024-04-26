import { MixCommand } from 'mixcli';
/**
 * @param {import('mixcli').MixCli} cli
 */
export default (cli) => {    
    const devCommand = cli.get("create");
    if(devCommand){
        const command = new MixCommand();
        command
            .name('app')
            .description('在开发模式下运行应用'); 

        devCommand.addCommand(command);
    }    

    cli.extend("create",command);
}