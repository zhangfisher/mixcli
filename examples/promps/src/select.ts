import { MixCommand } from "../../../src"


export default ()=>{        

    const selectCommand = new MixCommand();
    selectCommand
        .name('select')
        .description('选择')
        .action(async function (options){
            
        })
    return selectCommand
} 