const { MixCommand } = require('mixcli');
const path = require("node:path")
const DbProviders = ["sqlite","mysql","sqlserver","postgresql"]

/**
 * @param {import('mixcli').MixCli} cli
 */
module.exports = (cli)=>{    
    const command = new MixCommand();
    command
        .name('init')
        .description('初始化应用') 
        .argument("[services...]","要运行的服务名称列表",[])        
        // .option(`-p, --provider <value>`,`数据库类型,取值${DbProviders.join()}`,{default:'sqlite',choices:DbProviders})  
        // .option("--url <value>","数据库连接字符串,默认为当前目录","file:./voerka.db")  
        // .option("--skip","跳过安装检查",{prompt:false,default:false})
        // .option("--db-path [value]","指定数据库目录","./data/db")  
        // .option("--prisma-client-location [value]","PrismaClient的输出位置",{prompt:false})  
        // .option("--silent","不显示提示信息",{prompt:false})       
        .option("--entry","指定入口",{prompt:false})       // 指定
        .option("-t,--template <value>","应用模板",{
            default:"nodejs",
            choices:[
                {title:"Nodejs应用",value:"nodejs"},
                {title:"Reace/SPA",value:"react"},
                {title:"全栈应用",value:"web"},
                {title:"微服务应用",value:"microservice"}                
            ],
            prompt:true
        })
        .before(async function ({options,command,args}){
            console.log("before init",options)
            options.count = 1
        },true)
        .action((options)=>{
            console.log(`--------------init:${path.relative(__dirname,process.cwd())}--------------`)
            console.log("init",options)
            return 99
        })
        .after(async function ({value,options,command,args}){
            console.log("after init :",value,options)
        })
    const initVueCommand = new MixCommand('vue');
    initVueCommand
        .before(async function ({options,command,args}){
            console.log("before init vue",options)
        })
        .action((options)=>{
            console.log("Run command: init vue",options)
            return 100
        })
        .after(async function ({value,options,command,args}){
            console.log("after init vue:",value,options)
        })

    command.addCommand(initVueCommand)
    return command
}

 