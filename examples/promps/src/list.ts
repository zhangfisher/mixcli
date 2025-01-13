import { MixCommand } from "../../../src"


export default ()=>{        

    const listCommand = new MixCommand();
    listCommand
        .name('list')
        .option("-a, --port1 [port...]", "端口1")
        .option("-b, --port2 <port...>", "端口2")
        .action(async function (options){
            console.log("list=",JSON.stringify(options))
        })
    return listCommand
} 