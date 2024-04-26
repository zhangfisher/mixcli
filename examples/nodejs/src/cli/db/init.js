/**
 * 初始化数据库访问
 * 
 */
const { installPackage } = require('flex-tools/package/installPackage');
const { getPackageJson } = require('flex-tools/package/getPackageJson');
const { updatePackageJson } = require('flex-tools/package/updatePackageJson');
const { execScript } = require('flex-tools/misc/execScript');
const logsets = require("logsets")
const fs = require("node:fs")
const path = require("node:path");
const { MixCommand,createFileByTemplate } = require('mixcli'); 
 
/**
 * 初始化执行的任务
 * @param {*} options 
 * @param {*} entry 
 * @returns 
 */
function getTasks(options){    
    const { entry,dbContext } = options
    return [
        {
            title:"检查安装环境",
            execute:async ()=>{ 
                if(options.force) return "SKIP"                          
                if(!fs.existsSync(entry)) throw new Error("无效的入口路径")
                const hasDb = fs.existsSync(dbContext.path) && fs.existsSync(dbContext.schemaFile)
                if(hasDb){
                    logsets.log("当前已安装数据库支持")
                    return "abort"
                }
            },
            error:"abort"
        }, 
        {
            title:["安装数据库ORM框架:{}",'prisma'],
            execute:async ()=>{
                if(await installPackage("prisma",{use:"pnpm",upgrade:false})){                        
                    return (await getPackageJson("prisma")).version
                }else{                    
                    return "SKIP"
                }
            }
        }, 
        {
            title:["初始化{}数据库配置",`prisma/${options.provider}`],
            execute:async ()=>{
                if(!fs.existsSync(dbContext.schemaFile)){
                    // 在当前入口应用下生成data/db/schema.prisma文件
                    await createFileByTemplate(
                        dbContext.schemaFile,
                        path.join(__dirname,"./templates/schema.prisma.art"),{
                        provider:options.provider,
                        url:options.provider === "sqlite" ? '"file:./voerka.db"' : `env("DATABASE_URL")`,
                        output: options.prismaClientLocation   
                    }) 
                }else{
                    return "SKIP"
                }                                
            }
        },
        {
            title:["生成{}","@prisma/client"],
            execute:async ()=>{
                await execScript(`pnpx prisma generate --schema=${dbContext.schemaFile}`,{silent:true})
            }
        },
        {
            title:["生成{}种子文件","seed"],
            execute:async ()=>{
                // 在当前入口应用下生成data/db/schema.prisma文件
                await createFileByTemplate(dbContext.seedFile,path.join(__dirname,"./templates/seed.art"),{
                    output: options.prismaClientLocation    
                })                            
            }
        },
        {
            title:["注入数据库相关脚本命令"],
            execute:async ()=>{
                //在多应用时才会提供output参数,普通nodejs应用不需要提供output参数                       
                const isSignalApp = options.output  ? false : true
                const entryName = path.basename(entry).toLowerCase()
                if(isSignalApp){
                    await updatePackageJson({
                        prisma:{
                            seed:`ts-node ${dbContext.relPath.replaceAll("\\","/")}/seed.ts`
                        },
                        scripts:{
                            "db:sync": "pnpm voerka db sync",
                            "db:migrate": "pnpm voerka db migrate",
                            "db:seed": "pnpm voerka db seed"
                        }
                    },{location:entry})                            
                }else{
                    await updatePackageJson({
                        scripts:{
                            [`db:sync:${entryName}`]: `pnpm voerka db sync --service ${entryName}`,
                            [`db:migrate:${entryName}`]: `pnpm voerka db migrate --service ${entryName}`,
                            [`db:seed:${entryName}`]: `pnpm voerka db seed --service ${entryName}`
                        }
                    },{location:entry})                            
                }
                
            }
        }  
    ]
}

const DbProviders = ["sqlite","mysql","sqlserver","postgresql"]

/**
 * @param {import("mixcli").MixedCli} cli
 */
module.exports = (cli)=>{ 
    const initCommand = new MixCommand("init"); 
    initCommand
        .description("初始化数据库访问")    
        .option(`-p, --provider <value>`,`数据库类型,取值${DbProviders.join()}`,{default:'sqlite',choices:DbProviders})  
        .option("--url <value>","数据库连接字符串,默认为当前目录","file:./voerka.db")  
        .option("-f,--force","强制重新安装",{prompt:false,default:false})
        .action(async (options)=>{             
            // 1. 生成任务列表
            const tasks = getTasks(options)            
            // 2. 执行任务列表
            await logsets.run(["初始化数据库访问支持:{}",path.relative(options.packageRoot,options.entry )],tasks) 
            
            if(!options.silent){
                console.log()
                logsets.list("数据库访问支持已安装,接下来：",[
                    {
                        title:["修改数据库模式文件:{}","data/db/schema.prisma"],
                        description:"指定数据库类型以及连接字符串,声明数据模型"
                    },
                    {
                        title:["执行{}生成数据库存取库{}","voerka db sync","@prisma/client"],
                        description:["当模型更新后调用此命令重新生成数据库ORM访问库{}","@prisma/client"]
                    },
                    {
                        title:["执行{}创建数据库迁移","voerka db migrate"],
                        description:["数据库迁移的作用是将数据表模型与数据库表进行同步，并且自动导入种子数据","@prisma/client"]
                    }
                ])
            }
        })
      
    return initCommand
}