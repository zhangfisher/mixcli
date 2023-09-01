const { FlexCommand } = require('flexcli');


/**
 * @param {import('flexcli').FlexCli} cli
 */
module.exports = (cli)=>{        
    
    
    const command = new FlexCommand();

    command
        .name('dev')
        .description('在开发模式下运行应用') 
        .option("-p,--port <port>","指定端口号",3000)
        .option("-h,--host <host>","指定主机名")
        .option("-m,--mode <mode>","指定模式",{choices:["development","production","test","debug"]})
        .option("-f,--framework [value]","开发框架",{choices:["vue","react","angular"]})
        .prompt(true)           // 自动提示
        .action((arg,options)=>{
            console.log("dev",arg,options)
        })
    return command
} 