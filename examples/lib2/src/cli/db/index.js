
const { MixCommand } = require('mixcli');

/**
 * @param {import('mixcli').mixcli} cli
 */
 module.exports = (cli)=>{        
    const dbCommand = new MixCommand();
    dbCommand
        .name("db")
        .description("数据库")
        .option("-t, --type <value>","数据库类型",{choices:["MySQL","MS SQL Server","Oracle","DB2"]})        
        .action((options)=>{
            console.log("选择数据库类型:",options.type)
            console.log("work dir=",process.cwd())
        })
    return dbCommand
 }
 