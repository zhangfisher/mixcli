import  { MixCommand } from "../../../src" 

export default ()=>{    
    const command = new MixCommand();
    command
        .name('init')
        .description('初始化应用') 
        .enablePrompts()
        .initial({
            reset: false,
            provider: 'postgresql',
            count:100,
            url: "file:./abc.db",
            template: "web",
            language: ["Nodejs","C"]
        }) 
        .option(`-r, --reset`,`重置应用`,{default:true})
        .option(`-c, --count <value>`,`数量`)
        // .argument("[services...]","要运行的服务名称列表",[])        
        .option(`-p, --provider <value>`,`数据库类型,取值sqlite,mysql,sqlserver,postgresql`,{
            default:'sqlite',
            choices:["sqlite","mysql","sqlserver","postgresql"]
        })  
        .option("--url <value>","数据库连接字符串,默认为当前目录")  
        .option("--skip","跳过安装检查",{default:false})
        .option("--db-path [value]","指定数据库目录",{ default:"./data/db"})  
        .option("--prisma-client-location [value]","PrismaClient的输出位置")  
        .option("--silent","不显示提示信息")       
        .option("--entry","指定入口")        
        .option("-t,--template <value>","应用模板",{
            default:"nodejs",
            choices:[
                { title: "Nodejs应用", value: "nodejs" },
                { title: "Reace/SPA", value: "react" },
                { title: "全栈应用", value: "web" },
                { title: "微服务应用", value: "microservice" }                
            ],
            prompt:true
        })
        .option("-l,--language <value...>","支持的语言",{
            default: ["Go","Javascript"],
            choices:[
                "Go","Java","Python","Javascript","Nodejs","PHP","Ruby","C#","C++","C","Swift","Kotlin","Dart"
            ],
            prompt: "multiselect"
        })
        .before(async function ({options}){
            console.log(`--------------init:before--------------`)            
            console.log("  before init",options)
        },true)
        .action((options)=>{
            console.log(`--------------init--------------`)
            console.log("  init",options)
            return 99
        })
        .after(async function (){
            console.log(`--------------init:after--------------`)            
        })

    // const initVueCommand = new MixCommand('vue');
    // initVueCommand
    //     .before(async function ({options,command,args}){
    //         console.log("before init vue",options)
    //     })
    //     .action((options)=>{
    //         console.log("Run command: init vue",options)
    //         return 100
    //     })
    //     .after(async function ({value,options}){
    //         console.log("after init vue:",value,options)
    //     })

    // command.addCommand(initVueCommand)
    return command
}

 