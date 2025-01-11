import { MixCommand } from "../../../src"


export default ()=>{        

    const toggleCommand = new MixCommand();
    toggleCommand
        .name('toggle')
        .description('单选')
        .action(async function (options){
            
        })
    return toggleCommand
} 