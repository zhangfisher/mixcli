const { MixedCommand } = require('mixed-cli');
const path = require("node:path")
const DbProviders = ["sqlite","mysql","sqlserver","postgresql"]

/**
 * @param {import('mixed-cli').MixedCli} cli
 */
module.exports = (cli)=>{    
    const command = new MixedCommand();
    command
        .name('init')
        .description('初始化应用') 
        .option("-p, --provider <value>",`数据库类型,取值${DbProviders.join()}`,{default:'sqlite',choices:DbProviders})  
        .option("--url <value>","数据库连接字符串,默认为当前目录","file:./voerka.db")  
        .option("--skip","跳过安装检查",{prompt:false,default:false})
        .option("-o, --output [value]","指定PrismaClient输出目录")   
        .option("--silent","不显示提示信息")       
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
        .action((options)=>{
            console.log(`--------------init:${path.relative(__dirname,process.cwd())}--------------`)
            console.log("init",options)
            return 0
        })
    const initVueCommand = new MixedCommand('vue');
    initVueCommand.action((options)=>{
        console.log("Run command: init vue",options)
    })

    command.addCommand(initVueCommand)
    return command
}

 