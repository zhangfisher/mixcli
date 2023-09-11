
const { MixedCommand } = require('mixed-cli');

/**
 * @param {import('mixed-cli').MixedCli} cli
 */
 module.exports = (cli)=>{        
    const stopCommand = new MixedCommand();
    stopCommand
        .name("db")
        .description("数据库")
        .option("-t, --type <value>","数据库类型",{choices:["MySQL","MS SQL Server","Oracle","DB2"]})        
        .action((options)=>{
            console.log("选择数据库类型:",options.type)
        })
    return stopCommand
 }
 