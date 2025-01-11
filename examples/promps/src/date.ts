import { MixCommand } from "../../../src"


export default ()=>{        

    const dateCommand = new MixCommand();
    dateCommand
        .name('date')
        .description('日期输入')
        .action(async function (options){
            
        })
    return dateCommand
} 