const { FlexCommand } = require('flexcli');


/**
 * @param {import('flexcli').FlexCli} cli
 */
module.exports = (cli)=>{        
    
    

    const devCommand = new FlexCommand();

    devCommand
        .name('dev')
        .description('在开发模式下运行应用')
        .option("-p,--port <port>","指定端口号",3000)                      
        .option("-d,--debug" ,"调试模式",{ default:true,prompt:true })      
        .option("-h,--host <host>","指定主机名",{default:"localhost",prompt:true})                         
        .option("-e,--env [value]","环境变量",{ prompt:false })                                   
        .option("-m,--mode <mode>","指定模式",{choices:["development","production","test","debug"]})
        .option("-f,--framework [value]","开发框架",{choices:[
            {title:"vue",value:1},
            {title:"react",value:2,description:"默认"},
            {title:"angular",value:3}
        ]})
        .action(async function (options,cmd){
            // console.log("    run dev(name=",name,"port=",port)
            // 如果有子命令
            if(cmd.commands.length>0){
               //await cmd.selectCommands()
            }else{
                cmd.help()
            }
        })

    const appCommand = new FlexCommand();
    appCommand.name("app")
        .description("以开发模式启动应用")      // 未指定默认值,自动使用text类型提供
        .before(()=>{
            console.log("      dev app before")
        })
        .after(()=>{
            console.log("      dev app after")
        })
        .option("--color <value...>","显示颜色",{choices:["red","yellow","blue"],prompt:"multiselect"})  
        // 未指定默认值,使用自动完成，可以输入任意值
        .option("--filter <value>","文件过滤",{choices:["src","test","debug"],prompt:"autocomplete"})    
        // 未指定默认值,自动使用text类型提供
        .option("-t,--title <value>","标题(不少于5个字符)",{validate:(value)=>value.length>=5})    
        // 指定了默认值且强制提示
        .option("--count <value>","数量",{default:5,prompt:true})
        // 没有指定默认值，使用,分割多个值
        .option("-r,--routes <value...>","路由(多个值采用,分割)")                           
        // 指定了默认值时不进行提示
        .option("-p,--port <port>","指定端口号",3000)                      
        // 有默认值且强制显示提示
        .option("-d,--debug" ,"调试模式",{ default:true,prompt:true })      
        .option("-h,--host <host>","指定主机名",{default:"localhost",prompt:true})                            // 自动提示（没有输入且无默认值时）
        // 始终不进行提示取，取决env是可选还是必选
        .option("-e,--env [value]","环境变量",{ prompt:false })                                   
        .option("-m,--mode <mode>","指定模式",{choices:["development","production","test","debug"]})
        .option("-f,--framework [value]","开发框架",{choices:[
            {title:"vue",value:1},
            {title:"react",value:2,description:"默认"},
            {title:"angular",value:3}
        ]})
        .option("-o,--open","自动打开浏览器",{prompt:{          // 自定义提示
            type:"toggle",
            message:"是否自动打开浏览器？",
        }})
        .action((options)=>{            
            console.log("        run dev app")
            console.log("dev app",options)
        })

    devCommand.addCommand(appCommand)

    const libCommand = new FlexCommand();
    libCommand
        .name("lib")
        .description("以开发模式启动库")      // 未指定默认值,自动使用text类型提供
        .option("-m, --module <value>","模块类型",{choices:["esm","commonjs","umd"]})  
        .action((options)=>{            
            console.log("        run dev lib")
            console.log("dev app",options)
        })
    devCommand.addCommand(libCommand)

    return devCommand
} 