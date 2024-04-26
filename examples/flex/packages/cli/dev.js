
const { MixCommand } = require('mixcli');
const logsets = require('logsets');

const delay = (ms)=>new Promise(resolve=>setTimeout(resolve,ms))
/**
 * @param {import('mixcli').MixedCli} cli
 */
module.exports = (cli)=>{                
    const devCommand = new MixCommand("dev");
    devCommand
        .description("开发模式")          
        // 指定了默认值且强制提示
        .option("--count <value>","数量",{default:5,prompt:true})
        // 没有指定默认值，使用,分割多个值
        .option("-r,--routes <value...>","路由(多个值采用,分割)")                           
        // 指定了默认值时不进行提示
        .option("-p,--port <port>","指定端口号",3000)                      
        // 有默认值且强制显示提示
        .option("-d,--debug" ,"调试模式",{ default:true,prompt:true })      
        .option("--color <value...>","显示颜色",{choices:["red","yellow","blue"],prompt:"multiselect"})  
        // 未指定默认值,使用自动完成，可以输入任意值
        .option("--filter <value>","文件过滤",{choices:["src","test","debug"],prompt:"autocomplete"})    
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
        .action(async (options)=>{            
            const tasks = logsets.createTasks([
                {
                    title:"任务处理被停止",
                    execute:async ()=>{
                        await delay(100)
                        return "abort"
                    }
                },
                {
                    title:"开始扫描文件",
                    execute:async ()=>{await delay(100);return 1}            
                },
                {   title:"准备对文件进行预处理",
                    execute:async ()=>{throw new Error("已安装")}, 
                },
                {   title:"准备对文件进行预处理",
                    execute:async ()=>{
                        await delay(100)
                        return "已完成"
                    }
                },
                {   title:"执行过程中显示进度",
                    execute:async ({task})=>{
                        for(let i=0;i<100;i++){
                            await delay(10)
                            task.note(i+"%")
                        }
                    }
                },
                {
                    title:"读取文件并编译成exe文件",
                    execute:async ()=>{
                        await delay(100)
                        return ['stop',"不干了"]
                    }            
                },        
                {
                    title:"任务处理被停止",
                    execute:async ()=>{
                        await delay(100)
                        return ["abort",'真的不干了']
                    }
                },
                "-",
                {
                    title:"任务执行失败",
                    execute:async ()=>{throw new Error("TimeOut")},
                    error:["ignore","忽略:{message}"]
                },
                {
                    title:"任务待办状态",
                    execute:async ()=>{throw new Error("TimeOut")},
                    error:"出错了"
                }      
            ],{ignoreErrors:true})
            try{
                let results = await tasks.run(["开始执行{}任务",5])
                //console.log(results)            
            }catch(e){
                //console.error(e)
            }
        })
    return devCommand
} 
    

 