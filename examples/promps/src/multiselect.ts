import { MixCommand } from "../../../src"


export default ()=>{        

    const multiselectCommand = new MixCommand();
    multiselectCommand
        .name('multiselect')
        .description('多选项')
        .action(async function (options){
            
        })
    return multiselectCommand
} 