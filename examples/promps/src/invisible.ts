import { MixCommand } from "../../../src"


export default ()=>{        

    const invisibleCommand = new MixCommand();
    invisibleCommand
        .name('invisible')
        .description('invisible')
        .action(async function (options){
            
        })
    return invisibleCommand
} 