import { MixCommand } from "../../../src"


export default ()=>{        

    const toggleCommand = new MixCommand();
    toggleCommand
        .name('toggle')        
        .option("-a, --enable1", "启用1",{choices:["Yes","No"],prompt:true})
        .option("-b, --enable2", "启用2",{choices:["是","否"],prompt:true})
        .action(async function (options){
            console.log("toggle=",JSON.stringify(options))
        })
    return toggleCommand
} 