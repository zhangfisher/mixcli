import { MixCommand } from "../../../src"


export default ()=>{        

    const autocompleteCommand = new MixCommand();
    autocompleteCommand
        .name('autocomplete') 
        .description('自动完成')
        .action(async function (options){
            
        })
    return autocompleteCommand
} 