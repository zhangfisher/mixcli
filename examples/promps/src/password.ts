import { MixCommand } from "../../../src"


export default ()=>{        

    const passwordCommand = new MixCommand();
    passwordCommand
        .name('password')
        .description('密码')
        .action(async function (options){
            
        })
    return passwordCommand
} 