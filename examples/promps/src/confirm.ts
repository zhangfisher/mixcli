import { MixCommand } from "../../../src"


export default ()=>{        

    const confirmCommand = new MixCommand();
    confirmCommand
        .name('confirm')
        .option("-a, --enable1", "启用1")
        .option("-b, --enable2", "启用2")
        .action(async function (options){
            console.log("toggle=",JSON.stringify(options))
        }) 
    return confirmCommand
} 