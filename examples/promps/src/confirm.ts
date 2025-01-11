import { MixCommand } from "../../../src"


export default ()=>{        

    const confirmCommand = new MixCommand();
    confirmCommand
        .name('confirm')
        .description('确认选项')
        .action(async function (options){
            
        })
    return confirmCommand
} 