import { MixCommand } from "../../../src"


export default ()=>{        

    const numberCommand = new MixCommand();
    numberCommand
        .name('number')
        .description('数字')        
        .option("-a, --count1 <value>", "计数1",{
            prompt:'number',
            default: ()=>{return 10}
        })
        .option("-b, --count2 [value]", "计数2",{
            prompt:'number',
            default: (pre:number)=>{
                return pre+1
            }
        })
        .option("-c, --count3 [value]", "计数3",{prompt:true,
            default: (pre:number)=>{
                return pre+1
            }})
        .action(async function (options){
            console.log("number=",JSON.stringify(options))
        })
    return numberCommand
} 