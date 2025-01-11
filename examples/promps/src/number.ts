import { MixCommand } from "../../../src"


export default ()=>{        

    const numberCommand = new MixCommand();
    numberCommand
        .name('number')
        .description('数字')
        .action(async function (options){
            
        })
    return numberCommand
} 