const { MixedCommand } = require('mixed-cli');
const path = require("node:path")

/**
 * @param {import('mixed-cli').MixedCli} cli
 */
module.exports = (cli)=>{    
    const command = new MixedCommand();
    command
        .name('init')
        .description('初始化应用') 
        .option("-t,--template <value>","应用模板",{
            choices:[
                {title:"Nodejs应用",value:"nodejs"},
                {title:"Reace/SPA",value:"react"},
                {title:"全栈应用",value:"web"},
                {title:"微服务应用",value:"microservice"}                
            ],
            prompt:false
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

 