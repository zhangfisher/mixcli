import { MixCommand } from "../../../src"


export default ()=>{        

    const dateCommand = new MixCommand();
    dateCommand
        .name('date')
        .option("-a, --date1 <value>", "日期1",{
            prompt:'date' 
        })
        .option("-b, --date2 [value]", "日期2",{
            prompt:'date' 
        })
        .option("-c, --date3 [value]", "日期3",{
            default: new Date(),
            prompt:true
        })
        .action(async function (options){
            console.log("date=",JSON.stringify(options))
        })
    return dateCommand
} 