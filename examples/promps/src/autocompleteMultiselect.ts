import { MixCommand } from "../../../src"


export default ()=>{        

    const autocompleteMultiselectCommand = new MixCommand();
    autocompleteMultiselectCommand
        .name('autocompleteMultiselect')
        .description('自动完成多选')
        .action(async function (options){
            
        })
    return autocompleteMultiselectCommand
} 