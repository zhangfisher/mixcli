import  { MixCommand } from "../../../src"

 
export default ()=>{    
    const command = new MixCommand();
    command
        .name('start')
        .description('运行应用')
        .option("-c, --config <config>", "指定tsoa配置文件",{
            prompt:{
                type:"select",
                initial: ()=>{
                    return "tsoa.json"
                },
                choices:()=>([
                    {title:"tsoa.json",value:"tsoa.json"},
                    {title:"tsoa.prod.json",value:"tsoa.prod.json"},
                    {title:"tsoa.dev.json",value:"tsoa.dev.json"},
                ]),
                hint:'选择配置文件'
            }            
        })
        .action(()=>{
            console.log("Run start")
        })
    return command
}