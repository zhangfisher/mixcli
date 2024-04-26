const { MixCommand } = require('mixcli');

/**
 * @param {import('mixcli').mixcli} cli
 */
module.exports = (cli)=>{           
    cli.find("init").then((initCommand)=>{
      const initVueCommand = new MixCommand("vue");
        initVueCommand
          .description("创建Vue应用")  
          .option("-a, --app <value>", "应用名称",{validate:(value)=>value.length>0})                           
          .action((options)=>{            
              console.log("创建Vue应用:",options.app)
          })
        initCommand.addCommand(initVueCommand)
    })    
} 