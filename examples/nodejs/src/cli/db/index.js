const { MixCommand }  = require("mixcli")
const path = require("node:path")
const initCommand = require("./init.js");
const syncCommand = require("./sync.js");
const migrateCommand = require("./migrate.js");
const seedCommand = require("./seed.js");
const { getPackageRootPath } = require("flex-tools/package/getPackageRootPath");
const { getDatabaseContext } =  require("./utils")
  
/**
 * @param {import("mixcli").MixedCli} cli
 */
module.exports = module.exports =(cli)=>{
    const dbCommand = new MixCommand('db');
    dbCommand
        .description("提供数据库初始化/创建/迁移模型等操作")         
        .option("--db-path [value]","指定数据库目录","./data/db")  
        .option("--prisma-client-location [value]","PrismaClient的输出位置",{prompt:false})  
        .option("--silent","不显示提示信息",{prompt:false})       
        .option("--entry","指定入口路径,默认是当前目录",{prompt:false,default:"./"})       
        .before(async function({options}){
            options.cwd = process.cwd()
            options.packageRoot= getPackageRootPath()           
            options.entry = path.isAbsolute(options.entry) ? options.entry : path.join(process.cwd(),options.entry)                      
            options.dbContext = getDatabaseContext(options)
            process.chdir(options.entry)
        })
        .after(async ({options})=>{
            process.chdir(options.cwd)
        })
        .addCommand(initCommand(cli))
        .addCommand(syncCommand(cli))
        .addCommand(migrateCommand(cli)) 
        .addCommand(seedCommand(cli))
             
    return dbCommand
}