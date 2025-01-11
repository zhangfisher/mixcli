import { MixCommand } from "../../../src"


export default ()=>{        

    const listCommand = new MixCommand();
    listCommand
        .name('list')
        .description('列表')
        .action(async function (options){
            
        })
    return listCommand
} 