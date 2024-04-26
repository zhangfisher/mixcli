import { MixCommand } from 'mixcli';

/**
 * @param {import('mixcli').MixCli} cli
 */
export default (cli) => {        
    const devCommand = new MixCommand();

    devCommand
        .name('dev')
        .description('在开发模式下运行应用')
        .action(async function (options,cmd){
            if(cmd.commands.length>0){
            }else{
                cmd.help()
            }
        })

    const appCommand = new MixCommand();
    appCommand.name("app")
        .description("以开发模式启动应用")      
        .option("-t,--title <value>","标题",{
            required:true,
            prompt:{
                type:'text',  
                warn: "不少于5个字符"
            }}) 
        .option("--color <value...>","显示颜色",{choices:["red","yellow","blue"],prompt:"multiselect"})  
        .option("--filter <value>","文件过滤",{choices:["src","test","debug"],prompt:"autocomplete"})    
        .option("--custom <value>","描述",{
                prompt:{
                    type:'text',
                    hint:'不少于5个字符'
                }})  
        .option("--count <value>","数量",{default:5,prompt:true})
        .option("-r,--routes <value...>","路由(多个值采用,分割)")                            
        .option("-p,--port <port>","指定端口号",3000)                      
        .option("-h,--host <host>","指定主机名",{default:"localhost",prompt:true})                            
        .option("-e,--env [value]","环境变量",{ prompt:false })                                   
        .option("-m,--mode <mode>","指定模式",{choices:["development","production","test","debug"]})
        .option("-f,--framework [value]","开发框架",{choices:[
            {title:"vue",value:1},
            {title:"react",value:2,description:"默认"},
            {title:"angular",value:3}
        ]})
        .option("-o,--open","自动打开浏览器",{prompt:{          
            type:"toggle",
            message:"是否自动打开浏览器？",
        }})
        .action((options)=>{            
            console.log("        run dev app")
            console.log("dev app",options)
        })

    devCommand.addCommand(appCommand)

    const libCommand = new MixCommand();
    libCommand
        .name("lib")
        .description("以开发模式启动库")      
        .option("-m, --module <value>","模块类型",{choices:["esm","commonjs","umd"]})  
        .action((options)=>{            
            console.log("        run dev lib")
            console.log("dev app",options)
        })
    devCommand.addCommand(libCommand)

    return devCommand
} 