
const { MixCommand } = require('mixcli');

/**
 * @param {import('mixcli').mixcli} cli
 */
 module.exports = (cli)=>{        

    cli.find("dev").then((dev)=>{
        dev.option("--restart","重启应用")
        dev.option("--pause <value>","暂停应用")
    }).catch((err)=>{
        console.log("err=",err)
    })
  

    const restartCommand = new MixCommand();
    restartCommand
        .name("restart")
        .description("重启应用")
        .option("-s, --show","显示启动时间",1000)
        .action(()=>{
            console.log("pause app")
        })
    return restartCommand
 }